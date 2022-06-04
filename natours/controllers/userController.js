const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync (async (req,res,next)=>{
    const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.createUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'En construcción...'});
}

exports.updateMe= catchAsync( async(req,res,next)=>{
  
  //crear error si el usuario hace post de password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  //poner los campos que se pueden cambiar

  const filteredBody = filterObj(req.body, 'name', 'email');

  //actualizar el user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });

})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.getUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'En construcción...'});
}

exports.updateUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'En construcción...'});
}

exports.deleteUser = factory.deleteOne(User)