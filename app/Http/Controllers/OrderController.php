<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Item;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth()->user()->type !== "Seller") {
            // Get the current authenticated user's ID
            $userId = auth()->id();

            // Fetch cart items for the authenticated user
            $orders = Order::with([
                    'item' => function($query) {
                        $query->select('id', 'name', 'price', 'quantity', 'state', 'image_path'); // Specify the columns you want to include
                    },
                    'store' => function($query) {
                        $query->select('id', 'name', 'state', 'additional_fee'); // Specify columns for the store if needed
                    }
                ])
                        ->where('user_id', $userId)
                        ->get()->toArray();

            // Pass the data to the Inertia view
            return Inertia::render('Orders/Index', [
                'orders' => $orders
            ]);
        }
        else{
            // Get the current authenticated user's ID
            $store_id = auth()->user()->store_id;

            // Fetch cart items for the authenticated user
            $orders = Order::with([
                'item' => function($query) {
                    $query->select('id', 'name', 'price', 'quantity', 'state', 'image_path'); // Specify the columns you want to include
                },
                'user' => function($query) {
                    $query->select('id', 'name', 'department'); // Specify columns for the store if needed
                }
            ])
                    ->where('store_id', $store_id)
                    ->get()->toArray();
        // Pass the data to the Inertia view
        return Inertia::render('SellerOrders/Index', [
            'orders' => $orders
        ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'item_id' => 'required|exists:items,id',
            'store_id' => 'required|exists:stores,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
        ]);

        // Retrieve user details
        $user = User::findOrFail($validated['user_id']);
        
        //Log::info('User details:', $user->toArray()); // Convert the user object to an array for better readability

        // Log the user's balance
        //Log::info('User Balance: ' . $user->balance);
        //Log::info('Order Total Price: ' . $validated['total_price']);
        
        
        // Check if user balance is sufficient
        if ($user->balance < $validated['total_price']) {
            return response()->json([
                'message' => 'Insufficient balance.'
            ], 400);
        }
        
        // If balance is sufficient, reduce the balance and update expenses
        $user->balance -= $validated['total_price'];
        $user->expense += $validated['total_price'];
        $user->save();
        
    
        // Create the order without deducting the item stock
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'item_id' => $validated['item_id'],
            'store_id' => $validated['store_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $validated['total_price'],
            'status' => 'Pending', // Set the status to pending as seller confirmation is required
            'pending_time' => now(),
            'payment_method' => "eBalance",
        ]);
    
        return response()->json([
            'message' => 'Order created successfully! Awaiting seller confirmation.',
            'order' => $order,
        ], 201);
    }

    public function paymongo(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'item_id' => 'required|exists:items,id',
            'store_id' => 'required|exists:stores,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:2000', // Minimum PayMongo amount
            'item_name' => 'required|string',
        ]);
    
        // Call PayMongo API to create a checkout session
        $response = Http::withBasicAuth(config('paymongo.secret_key'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'amount' => $validated['total_price'], // In centavos
                        'currency' => 'PHP',
                        'description' => 'Purchase from Store',
                        'line_items' => [
                            [
                                'name' => 'Order for: ' . $validated['item_name'],
                                'amount' => $validated['total_price'], // In centavos
                                'currency' => 'PHP',
                                'quantity' => 1,
                            ],
                        ],
                        'payment_method_types' => ['card', 'gcash', 'paymaya'],
                        'success_url' => route('carts.index'),
                        'cancel_url' => route('carts.index'),
                    ],
                ],
            ]);
    
        if ($response->failed()) {
            return response()->json(['message' => 'Failed to create PayMongo checkout session.'], 500);
        }
        else{
                    // Reduce the item's quantity
        $item = Item::find($validated['item_id']); // Retrieve the item by ID
        if ($item->quantity !== null) { // Check if the item has a quantity field
            if ($item->quantity < $validated['quantity']) {
                return response()->json(['message' => 'Not enough stock available for the item.'], 400);
            }
            $item->quantity -= $validated['quantity']; // Deduct the ordered quantity
            $item->save(); // Save the updated item
        }
    
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'item_id' => $validated['item_id'],
            'store_id' => $validated['store_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $validated['total_price'] / 100, // Convert centavos to pesos
            'status' => 'Accepted', // Payment not yet completed
            'created_at' => now(),
            'accepted_time' => now(),
            'pending_time' => now(),
            'payment_method' => "Paymongo",
        ]);
    
        $checkoutUrl = $response->json('data.attributes.checkout_url');
    
        return response()->json([
            'message' => 'Checkout session created successfully.',
            'checkout_url' => $checkoutUrl,
        ]);
        }
    }
    

    public function generalSuccess(Request $request)
{
    // Redirect to the orders page with a success message
    return redirect('/orders')->with('message', 'Payment successful! Please check your orders for details.');
}

public function generalCancel(Request $request)
{
    // Redirect to the orders page with a cancellation message
    return redirect('/orders')->with('message', 'Payment cancelled.');
}


    
    public function handleWebhook(Request $request)
    {
        // Validate the PayMongo webhook signature
        $signature = $request->header('Paymongo-Signature');
        if (!$this->validateSignature($request->getContent(), $signature)) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $payload = $request->json();

        if ($payload['data']['type'] === 'event' && $payload['data']['attributes']['type'] === 'checkout.session.completed') {
            $attributes = $payload['data']['attributes'];

            // Extract data
            $amount = $attributes['data']['attributes']['amount'];
            $currency = $attributes['data']['attributes']['currency'];
            $lineItems = $attributes['data']['attributes']['line_items'];
            $userId = $lineItems[0]['metadata']['user_id'];
            $itemId = $lineItems[0]['metadata']['item_id'];
            $storeId = $lineItems[0]['metadata']['store_id'];
            $quantity = $lineItems[0]['metadata']['quantity'];

            // Save order to the database
            $order = Order::create([
                'user_id' => $userId,
                'item_id' => $itemId,
                'store_id' => $storeId,
                'quantity' => $quantity,
                'total_price' => $amount / 100, // Convert centavos to pesos
                'status' => 'Accepted', // Payment confirmed
                'accepted_time' => now(),
            ]);

            return response()->json(['message' => 'Order saved successfully.'], 200);
        }

        return response()->json(['message' => 'Unhandled event type.'], 400);
    }



    private function validateSignature($payload, $signature)
    {
        $secret = config('paymongo.secret_key');
        $computedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($computedSignature, $signature);
    }



    public function success(Order $order)
    {
        $order->update(['status' => 'Accepted', 'accepted_time' => now()]);

        return redirect('/orders')->with('message', 'Payment successful! Order confirmed.');
    }

    public function cancelPayment(Order $order)
    {
        $order->update(['status' => 'Cancelled', 'cancelled_time' => now()]);
    
        return redirect('/orders')->with('message', 'Payment cancelled.');
    }
    







    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }




    /**
     * Cancel a pending order and update user's balance and expenses.
     */
    public function cancel($id)
    {
        try{
        // Find the order by ID
        $order = Order::findOrFail($id);

        // Check if the order is still pending
        if ($order->status !== 'Pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled.'], 400);
        }
        

        $user = $order->user; // Assuming you have a belongsTo relationship set up between Order and User

        // Log the cancellation event
        Log::info('Cancelling Order ID: ' . $order->id . ' for User ID: ' . $user->id);

        // Add the total price back to the user's balance
        $user->balance += $order->total_price;

        // Reduce the amount from the user's expense
        $user->expense -= $order->total_price;

        // Update the user record
        $user->save();

        // Change the order status to cancelled
        $order->status = 'Cancelled';
        $order->cancelled_time = now(); // Add the current time to the cancelled_time field
        $order->save();

        // Return success response
        return response()->json(['message' => 'Order has been cancelled successfully.']); }
        catch (\Exception $e) {
            Log::error('Error canceling order: '.$e->getMessage());
            return response()->json(['error' => 'Unable to cancel order.'], 500);
        }
    }

    //Accept
    public function accept($id)
    {
        try {
            // Find the order by ID
            $order = Order::findOrFail($id);
    
            // Check if the order is still pending
            if ($order->status !== 'Pending') {
                return response()->json(['message' => 'Only pending orders can be accepted.'], 400);
            }
    
            $user = $order->user; // Assuming you have a belongsTo relationship between Order and User
            $item = $order->item; // Assuming you have a belongsTo relationship between Order and Item
            $store = $order->store;
    
            // Log the acceptance event
            Log::info('Accepting Order ID: ' . $order->id . ' for User ID: ' . $user->id);
            $user->expense -= $order->total_price;
            $user->save();

            $store->balance += $order->total_price;
            $store->save();
            // Reduce the item's quantity
            if ($item->quantity !== null) { // Ensure the item has a quantity field
                if ($item->quantity < $order->quantity) {
                    return response()->json(['message' => 'Not enough stock available for the item.'], 400);
                }
    
                $item->quantity -= $order->quantity;
                $item->save();
            }
    
            // Update the order status to accepted
            $order->status = 'Accepted';
            $order->accepted_time = now(); // Set the current time for the accepted_time field
            $order->save();
    
            // Return success response
            return response()->json(['message' => 'Order has been accepted successfully.']);
        } catch (\Exception $e) {
            Log::error('Error accepting order: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to accept order.'], 500);
        }
    }
    
    //for top 5 of the day

    public function getTopSelling(Request $request)
    {
        $today = Carbon::today();
        $userId = $request->user()->id; // Get the authenticated user's ID

        /*----------------------------------------------------------------------------------------------*/
        //Top sales of the day
        $topSellingItems = Order::select('item_id', DB::raw('SUM(quantity) as total_quantity'))
            ->whereDate('created_at', $today) // Filter orders created today
            ->groupBy('item_id') // Group by item
            ->orderByDesc('total_quantity') // Order by most sold
            ->with('item.store') // Eager load the item details
            ->take(5) // Limit to top 5
            ->get();

        /*----------------------------------------------------------------------------------------------*/
        //Top items user orders
        $userTopItems = Order::select('item_id', DB::raw('SUM(quantity) as total_quantity'))
            ->where('user_id', $userId) // Filter by the authenticated user
            ->groupBy('item_id') // Group by item
            ->orderByDesc('total_quantity') // Order by most ordered
            ->with('item.store') // Eager load the item and store details
            ->take(10) // Limit to top 10
            ->get();

        /*----------------------------------------------------------------------------------------------*/
        // Determine most ordered types
        $mostOrderedTypes = Order::join('items', 'orders.item_id', '=', 'items.id')
            ->where('orders.user_id', $userId)
            ->select('items.type', DB::raw('COUNT(*) as order_count'))
            ->groupBy('items.type')
            ->orderByDesc('order_count')
            ->pluck('order_count', 'type')
            ->toArray();

        $totalOrders = array_sum($mostOrderedTypes); // Total number of orders across all types

        // Fetch random recommendations from the top types proportionally
        $orderedItemIds = Order::where('user_id', $userId)->pluck('item_id')->toArray(); // Items the user has already ordered

        $recommendedItems = collect();

        foreach ($mostOrderedTypes as $type => $count) {
            // Calculate the proportion of items to fetch for this type
            $typeProportion = round(($count / $totalOrders) * 20); // Proportion of the 20 recommendations
            $typeProportion = max($typeProportion, 1); // Ensure at least 1 item per type if it has orders

            $randomItems = Item::where('type', $type)
                ->whereNotIn('id', $orderedItemIds) // Exclude already ordered items
                ->where('state', 1) // Only available items
                ->with('store')
                ->inRandomOrder() // Randomize the results
                ->take($typeProportion) // Limit to the proportional count
                ->get();

            $recommendedItems = $recommendedItems->merge($randomItems);
        }
        // Ensure the total recommendations do not exceed 20 items
        $recommendedItems = $recommendedItems->take(20);

        /*----------------------------------------------------------------------------------------------*/
        // Daily Orders
        $dailyOrders = Order::where('user_id', $userId)
        ->where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days including today
        ->whereIn('status', ['Accepted', 'Claimed']) // Include only Accepted and Claimed orders
        ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total_amount'))
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get()
        ->map(function ($order) {
            return [
                'date' => $order->date,
                'total_amount' => $order->total_amount,
            ];
        });



        //for seller
        $storeId = User::where('id', $userId)->value('store_id');

        $dailyIncome = Order::where('store_id', $storeId) // Filter by store ID
        ->where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days including today
        ->whereIn('status', ['Accepted', 'Claimed']) // Include only Accepted and Claimed orders
        ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total_amount'))
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get()
        ->map(function ($order) {
            return [
                'date' => $order->date,
                'total_amount' => $order->total_amount,
            ];
        });

        //top items on your shop
        $storeTopSellingItems = Order::where('store_id', $storeId) // Filter by store ID
        ->where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days
        ->whereIn('status', ['Accepted', 'Claimed']) // Include only Accepted and Claimed orders
        ->select('item_id', DB::raw('COUNT(*) as order_count')) // Count orders per item
        ->groupBy('item_id') // Group by item
        ->orderByDesc('order_count') // Order by most orders
        ->with('item') // Eager load item details
        ->take(5) // Limit to 5
        ->get()
        ->map(function ($order) {
            return [
                'item_name' => $order->item->name ?? 'Unknown Item',
                'order_count' => $order->order_count,
            ];
        });

        // Total Sales Today
        $salesToday = Order::where('store_id', $storeId)
        ->whereDate('created_at', Carbon::today())
        ->whereIn('status', ['Accepted', 'Claimed'])
        ->sum('total_price');

        // Total Sales This Month
        $salesThisMonth = Order::where('store_id', $storeId)
        ->whereMonth('created_at', Carbon::now()->month)
        ->whereYear('created_at', Carbon::now()->year)
        ->whereIn('status', ['Accepted', 'Claimed'])
        ->sum('total_price');

        // Pending Orders Count
        $pendingOrders = Order::where('store_id', $storeId)
        ->where('status', 'Pending')
        ->count();

        // Cancelled Orders Count
        $acceptedOrders = Order::where('store_id', $storeId)
        ->where('status', 'Accepted')
        ->count();



        //for admin
        $overallDailyIncome = Order::where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days including today
        ->whereIn('status', ['Accepted', 'Claimed']) // Include only Accepted and Claimed orders
        ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total_amount'))
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get()
        ->map(function ($order) {
            return [
                'date' => $order->date,
                'total_amount' => $order->total_amount,
            ];
        });

        // Top Selling Items Overall
        $overallTopSellingItems = Order::where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days
        ->whereIn('status', ['Accepted', 'Claimed']) // Include only Accepted and Claimed orders
        ->select('item_id', 'store_id', DB::raw('COUNT(*) as order_count')) // Count orders per item and include store_id
        ->groupBy('item_id', 'store_id') // Group by item and store
        ->orderByDesc('order_count') // Order by most orders
        ->with(['item', 'store']) // Eager load both item and store details
        ->take(5) // Limit to 5
        ->get()
        ->map(function ($order) {
            return [
                'item_name' => $order->item->name ?? 'Unknown Item',
                'store_name' => $order->store->name ?? 'Unknown Store',
                'order_count' => $order->order_count,
            ];
        });
    
        $storeWiseDailyIncome = Order::where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days including today
        ->whereIn('status', ['Accepted', 'Claimed']) // Include only Accepted and Claimed orders
        ->select(
            'store_id', // Include the store ID
            DB::raw('DATE(created_at) as date'), // Group by date
            DB::raw('SUM(total_price) as total_amount') // Calculate total sales
        )
        ->groupBy('store_id', 'date') // Group by store and date
        ->orderBy('store_id') // Order by store for easier organization
        ->orderBy('date', 'asc') // Then order by date
        ->with('store')
        ->get()
        ->map(function ($order) {
            return [
                'store_id' => $order->store_id,
                'date' => $order->date,
                'total_amount' => $order->total_amount,
                'store' => $order->store->name,
            ];
        });
    



            Log::info('Top selling items:', $topSellingItems->toArray());
            Log::info('Top 10 items ordered by user:', $userTopItems->toArray());
            Log::info('Recommended items to user:', $recommendedItems->toArray());

        return inertia('Dashboard', [
            'topSellingItems' => $topSellingItems,
            'userTopItems' => $userTopItems, // Include user's top items in the response
            'recommendedItems' => $recommendedItems,
            'dailyOrders' => $dailyOrders,
            'dailyIncome' => $dailyIncome,
            'storeTopSellingItems' => $storeTopSellingItems,
            
            'salesToday' => $salesToday,
            'salesThisMonth' => $salesThisMonth,
            'pendingOrders' => $pendingOrders,
            'acceptedOrders' => $acceptedOrders,

            //admin
            'overallDailyIncome' => $overallDailyIncome,
            'overallTopSellingItems' => $overallTopSellingItems,
            'storeWiseDailyIncome' => $storeWiseDailyIncome,
        ]);
    }

    //Get the user expenses last 7 days
    public function getUserOrderStats()
    {
        $userId = auth()->id(); // Get authenticated user ID

        // Calculate the total daily orders for the past 7 days
        $dailyOrders = Order::where('user_id', $userId)
            ->where('created_at', '>=', Carbon::today()->subDays(6)) // Past 7 days including today
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total_amount'))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($order) {
                return [
                    'date' => $order->date,
                    'total_amount' => $order->total_amount,
                ];
            });

        return inertia('Dashboard', [
            'dailyOrders' => $dailyOrders,
        ]);
    }

}
