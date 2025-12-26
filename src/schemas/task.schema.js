import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      "string.base": "Title must be a text",
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),

  description: Joi.string()
    .optional()
    .messages({
      "string.base": "Description must be a text",
    }),
  date: Joi.date().optional(),
})