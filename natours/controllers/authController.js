const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const {
    promisify
} = require('util');

const signToken = id => {
    return jwt.sign({
        id: id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    //para que no salga la contraseña en la res
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
        photo:req.body.photo
    });

    createSendToken(newUser,201,res)

})


exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    //checar si existen

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }
    // checar si el usuario existe y la contraseña es correcta

    const user = await User.findOne({
        email
    }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //si todo está bien envía el token al user
    createSendToken(user,200,res)
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  };

  
exports.protect = catchAsync(async (req, res, next) => {

    // obtener el token y checar si existe

    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    //validar el token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, )

    //checar si el usuario existe
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(new AppError('The user that has this token does no longer exists', 401))
    }

    //checar si el usuario cambio de contraseña después que se hizo el token

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        //verificar que haya token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
  
       //checar si el usuario existe
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }
  
        // checar si el usuario cambión de contraseña
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
  
        // checar si ya está iniciado
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    };
};


exports.forgotPassword = catchAsync(async (req, res, next) => {

    // 1.- Obtener usuario de acuerdo al email que se puso

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2.- Generar otro token random

    const resetToken = user.createPasswordResetToken()

    await user.save({
        validateBeforeSave: false
    });

    // 3.- Enviarlo al email del usuario
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }

})

exports.resetPassword = catchAsync(async (req, res, next) => {

    //obtener el usuario basado en el token

    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });

    //checar si el token no está expirado y si hay usuario

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //Actualizar el cambio de contraseña

    //login con el user y enviar jwt

    createSendToken(user,200,res)

})

exports.updatePassword = catchAsync(async (req, res, next) => {
    //obtener usuario de la colección
    const user = await User.findById(req.user.id).select('+password');


    //checar si la contraseña en el post es correcta

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    //si está correcta, actualizar la contraseña

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //Log in del usuario, enviar jwt 

    createSendToken(user,200,res)
});