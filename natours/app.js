const express = require('express');
const morgan =require('morgan')
const app = express();


const tourRouter=require('./routes/tourRoutes')
const userRouter=require('./routes/userRoutes')

app.use(express.json());


app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`))

app.use((req,res,next)=>{
    
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*', (req,res,next) => {
    res.status(404).json({
        status:'fail',
        message:'no podemos encontrar'
    })
})


module.exports = app;

