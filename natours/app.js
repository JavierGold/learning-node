const express = require('express');
const morgan =require('morgan')
const app = express();
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter=require('./routes/tourRoutes')
const userRouter=require('./routes/userRoutes')


const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);

app.use(express.json());


app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`))

app.use((req,res,next)=>{
    
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    console.log(req.headers)
    next()
})

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*', (req, res, next) => {
    next(new AppError('No encuentro la ruta', 404))
  });

  app.use(globalErrorHandler);

module.exports = app;

