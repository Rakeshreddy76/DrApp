const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const zxcvbn = require('zxcvbn');

const userSchema = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	email: Joi.string().email().required(),
	password: Joi.string()
	  .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
	  .min(8)
	  .max(128)
	  .required(),
})
const userMongooseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide your name'],
		minlength: [2, 'Your name must be at least 2 characters'],
		maxlength: [50, 'Your name cannot exceed 50 characters'],
	  },
	  email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		lowercase: true,
	  },
	  password: {
		type: String,
		required: [true, 'Please provide a password'],
		validate: [
		  {
			validator: function (value) {
			  const passwordStrength = zxcvbn(value).score;
			  return passwordStrength >= 3; // Require a minimum strength of 3 out of 4
			},
			message: 'Password is too weak',
		  },
		  {
			validator: function (value) {
			  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value);
			},
			message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
		  },
		],
	  },
});

userMongooseSchema.validateUser = async function (user) {
	return userSchema.validateAsync(user);
  };
  
  // Create a Mongoose model
  const User = mongoose.model('User', userMongooseSchema);
  
  // Export the model
  module.exports = User;