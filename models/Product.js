const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    description: {
        type: String,
        default: "",
    },
    category: {
        type: String
    },
    code: {
        type: String,
    },
    price: {
        type: Number
    },
    brand: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now(),
    },

})

module.exports = mongoose.model('Product', productSchema);