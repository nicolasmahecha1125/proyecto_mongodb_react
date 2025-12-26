import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "El nombre debe ser texto",
    "string.empty": "El nombre es obligatorio",
  }),
  description: Joi.string().optional(),
  price: Joi.number().positive().required().messages({
    "number.base": "El precio debe ser numérico",
    "number.positive": "El precio debe ser mayor a 0",
    "any.required": "El precio es obligatorio",
  }),
  stock: Joi.number().integer().min(0).default(0),
 
});


export const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  
});
