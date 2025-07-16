const Order = require('../models/Order');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
}

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ orderID: id });
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            order 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching order', 
            error: error.message 
        });
    }
}

const addOrder = async (req, res) => {
    try {
        // Log incoming data for debugging
        console.log('Received order data:', req.body);
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                errors: missingFields.map(field => ({
                    field,
                    message: `${field} is required`
                }))
            });
        }

        // Generate orderID if not provided
        const orderID = req.body.orderID || 'ORD-' + Date.now();
        
        // Create order object with generated orderID
        const orderData = {
            ...req.body,
            orderID,
            status: req.body.status || 'pending',
            createdAt: new Date()
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        
        console.log('Order saved successfully:', savedOrder);
        
        // Return response in the format expected by frontend
        res.status(201).json({
            success: true,
            orderId: savedOrder.orderID,
            message: 'Order created successfully',
            order: savedOrder
        });
        
    } catch (error) {
        console.error('Error creating order:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error creating order', 
            error: error.message 
        });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Updating order:', id, req.body);
        
        const updatedOrder = await Order.findOneAndUpdate(
            { orderID: id },
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            order: updatedOrder
        });
        
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating order', 
            error: error.message 
        });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ orderID: id });
        
        if (!deletedOrder) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Order deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error deleting order', 
            error: error.message 
        });
    }
}

// Get orders by customer email
const getOrdersByCustomer = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ email: decodeURIComponent(email) });
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order history',
            error: error.message
        });
    }
}

module.exports = {
    getAllOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersByCustomer
};