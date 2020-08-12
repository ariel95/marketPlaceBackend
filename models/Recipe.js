const mongoose = require('mongoose');
const { object } = require('joi');

const recipeSchema = new mongoose.Schema({
    cookingTimeInMinutes:{
        type: Number,
        default: -1,
    },
    country: {
        type: String,
        default: "",
    },
    description:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    imageUrl:{
        type: String,
        default: "",
    },
    ingredients:{
        type: [Object],
        default: [],
    },
    name:{
        type: String,
        required: true,
    },
    numberOfServings:{
        type: Number,
        default: -1,
    },
    uid:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Recipe', recipeSchema);