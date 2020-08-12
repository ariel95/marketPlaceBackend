const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Recipe = require('../models/Recipe');
const { recipeValidation } = require('../validations/recipesValidations');
const jwt = require('jsonwebtoken');

//Add recipe
router.post('/', verifyToken, async (req, res) => {
    try {
        const { error } = recipeValidation(req.body);
        if (error) return res.status(400).send( {errorMessage: error.details[0].message});

        //Take the uid from the token
        const token =  req.header('auth-token');
        const {_id} = jwt.decode(token);

        //Create the recipe
        const recipe = new Recipe({
            uid: _id,
            name: req.body.name,
            description: req.body.description,
            cookingTimeInMinutes: req.body.cookingTimeInMinutes,
            country: req.body.country,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients,
            numberOfServings: req.body.numberOfServings
        })        

        const recipeSaved = await recipe.save();

        res.status(200).send({ message:"Recipe created correctly", recipe: recipeSaved._id });

    } catch (error) {
        res.status(400).send({catchMessage: error.toString()});
    }
});


module.exports = router;