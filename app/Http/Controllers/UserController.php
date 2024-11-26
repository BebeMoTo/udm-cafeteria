<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at'); // Default sort by created_at
    
        // Base query with eager loading of the related store
        $query = User::with('store');
    
        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
    
        // Apply sorting
        if ($sort === "created_at") {
            $query->orderBy($sort, 'desc');
        }
        else {
            $query->orderBy($sort, 'asc');
        }
    
        // Fetch users with pagination
        $users = $query->paginate($perPage);
    
        // Check if it's an AJAX request for lazy loading
        if ($request->wantsJson()) {
            return response()->json($users);
        }
    
        // Regular Inertia render for the initial page load
        return Inertia::render('AdminUsers/Index', [
            'users' => $users,
        ]);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch the stores
        $stores = Store::all();

        // Pass stores to the 'AdminUsers/Create' page
        return Inertia::render('AdminUsers/Create', [
            'stores' => $stores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the form data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'sex' => 'required|in:Male,Female',
            'storeNum' => 'nullable|integer',
            'type' => 'required|in:Admin,Seller',
        ], [
            'email.unique' => 'The email is already taken. Please choose a different one.',
        ]);
        
        if ($validated['type'] === "Seller") {
            // Save the user in the database
            $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']), // Encrypt the password
            'sex' => $validated['sex'],
            'type' => $validated['type'], 
            'balance' => null,
            'expense' => null,
            'department' => 'None',
            'store_id' => $validated['storeNum'], // Now can be set to null safely
            ]);
        } else {
            // Save the user in the database
            $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']), // Encrypt the password
            'sex' => $validated['sex'],
            'type' => $validated['type'], // Assuming this is an admin creation form
            'balance' => 0,
            'expense' => 0,
            'department' => 'None',
            'store_id' => $validated['storeNum'], // Now can be set to null safely
        ]);
        }
        

        // Redirect with a success message
        return redirect()->back()->with('success', 'Admin user created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (auth()->user()->type === 'Seller') {
            $user = User::with('store')->find($id); // Load the store relationship
            return Inertia::render('Dashboard', [
                'auth' => [
                    'user' => $user,
                ],
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Normally, you'd return a view here
        // return view('users.edit', compact('user'));

        // In your case with Inertia/React, you will return the data
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'department' => 'nullable|string',
            'balance' => 'nullable|numeric',
        ]);
    
        //$user->update($request->all());
        $user->update($request->all());
    
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Find the user by ID
            $user = User::findOrFail($id);
    
            // Delete the user
            $user->delete();
    
            // Return success response
            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            // Return error response if something goes wrong
            return response()->json(['message' => 'Error deleting user', 'error' => $e->getMessage()], 500);
        }
    
    }
}
