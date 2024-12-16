<!DOCTYPE html>
<html>
<head>
    <title>Your Order Has Been Accepted</title>
</head>
<body>
    <h1>Hello {{ $user->name }},</h1>
    <p>Your order has been accepted! Here are the details:</p>

    <h3>Order Information</h3>
    <ul>
        <li><strong>Order ID:</strong> {{ $order->id }}</li>
        <li><strong>Item:</strong> {{ $order->item->name }}</li>
        <li><strong>Quantity:</strong> {{ $order->quantity }}</li>
        <li><strong>Total Price:</strong> P {{ number_format($order->total_price, 2) }}</li>
        <li><strong>Store:</strong> {{ $order->store->name }}</li>
    </ul>

    <p>Thank you for ordering with us!</p>
</body>
</html>
