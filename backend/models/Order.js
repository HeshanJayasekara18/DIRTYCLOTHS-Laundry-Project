const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const OrderSchema = new mongoose.Schema({
    orderID: {type: String, required:true, unique:true, default: uuidv4},    name: {type: String, required: true},
    order_type: {type: String, required: true},
    order_time: {type: Date, required: true,},
    location:{type: String, required: true},
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;