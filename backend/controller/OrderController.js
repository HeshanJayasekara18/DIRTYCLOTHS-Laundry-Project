//Order Controller
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
        const order = await Order.findOne({orderID : id});
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }

}

const addOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save(); // Missing this line!
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findOneAndUpdate(
            { orderID: id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }   
}

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ orderID: id });
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
}

module.exports = {
    getAllOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder
};