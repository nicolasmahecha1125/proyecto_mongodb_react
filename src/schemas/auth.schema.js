import joi from "joi";

export const registerSchema = joi.object({
  username: joi.string().min(1).required().messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "string.min": "El nombre de usuario debe tener al menos 1 carácter",
    "any.required": "El nombre de usuario es un campo obligatorio",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "El email no tiene un formato válido",
    "any.required": "El email es un campo obligatorio",
  }),
  password: joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es un campo obligatorio",
  }),
   address: joi.string().required().messages({
    "string.empty": "La dirección es obligatoria",
    "any.required": "La dirección es un campo obligatorio",
  }),
   role: joi.string().valid("cliente", "admin").default("cliente").messages({
    "any.only": "El rol debe ser 'cliente' o 'admin'",
  }),
});

export const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "El email no tiene un formato válido",
    "any.required": "El email es un campo obligatorio",
  }),
  password: joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
    "any.required": "La contraseña es un campo obligatorio",
  }),
});
