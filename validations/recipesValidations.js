const Joi = require('joi');

const recipeValidation = (data) => {
    try {
        const schema = Joi.object({
            uid: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            cookingTimeInMinutes: Joi.number().integer(),
            country: Joi.string(),
            imageUrl: Joi.string(),
            ingredients: Joi.array(),
            numberOfServings: Joi.number().integer(),
        })
    
        return schema.validate(data);    
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

module.exports.recipeValidation = recipeValidation;