const Joi = require("joi");

const listingschema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().allow("", null),  
        }).required()
    }).required()
});

module.exports = { listingschema };