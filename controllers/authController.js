const jwt = require('jsonwebtoken');

const User = require('../models/userModels');
const createError = require('../utils/appError');

// SIGNUP USER
exports.signup = async (req, res, next) => {
    try {
        // Check if the user already exists
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return next(new createError('Email already exists!', 400));
        }

        // Directly use the password from the request
        const newUser = await User.create({
            ...req.body,
            password: req.body.password, // Save plain text password (not recommended)
        });

        // Assign JWT (JSON Web Token) to the user
        const token = jwt.sign({ id: newUser._id }, 'secretkey123', {
            expiresIn: '90d',
        });

        // Send response
        console.log('User registered successfully:', {
            id: newUser._id,
            user: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully.',
            token,
            user: {
                _id: newUser._id,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
            },
        });

    } catch (error) {
        next(error);
    }
};

// LOGIN USER
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return next(new createError('User not found!', 404));
        }

        // Check if the password matches directly (plain text)
        if (password !== user.password) {
            return next(new createError('Invalid email or password!', 401));
        }

        // Assign JWT (JSON Web Token) to the user
        const token = jwt.sign({ id: user._id }, 'secretkey123', {
            expiresIn: '90d',
        });

        // Send response
        res.status(200).json({
            status: 'success',
            message: 'Logged in Successfully!',
            token,
            user: {
                _id: user._id,
                email: user.email,
                password: user.password,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
