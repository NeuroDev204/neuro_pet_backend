import Joi from 'joi';

/**
 * Auth Validation Schemas
 * Input validation using Joi for all auth endpoints
 */

export const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),
    fullname: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Full name is required'
        }),
    phone: Joi.string()
        .pattern(/^[+]?[\d\s\-()]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'any.required': 'Phone number is required'
        }),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        country: Joi.string().default('Vietnam')
    }).optional()
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

export const verifyEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    code: Joi.string()
        .length(6)
        .required()
        .messages({
            'string.length': 'Verification code must be 6 digits',
            'any.required': 'Verification code is required'
        })
});

export const resendOtpSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
});
