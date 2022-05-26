const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const {promisify}=require('util');

const signToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync( async (req,res,next)=>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
      });


      const token =signToken(newUser._id)
      

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
})


exports.login =catchAsync (async (req,res,next)=>{
    const {email,password} = req.body;

    //checar si existen

    if(!email || !password){
      return  next(new AppError('Please provide email and password', 400))
    }
    // checar si el usuario existe y la contraseña es correcta

    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password, user.password))){
        return  next(new AppError('Incorrect email or password', 401))
    }

    //si todo está bien envía el token al user
    const token=signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
})

exports.protect = catchAsync(async(req,res,next)=>{

    // obtener el token y checar si existe

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.',401))
    }

    //validar el token

    jwt.verify(token, process.env.JWT_SECRET,)


    //checar si el usuario existe

    //checar si el usuario cambio de contraseña después que se tuvo el token

    next();
});
