/* const fs = require('fs') */
const Tour = require('../models/tourModel')

/* const tours = JSON.parse( fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)) */
/* 
exports.checkID = (req,res,next,val)=>{
    console.log(`El id del tour es ${val}`)
    if(req.params.id * 1 >tours.length ){
        return res.status(404).json({
            status: 'fail',
            message: 'ID inválido'
        })
    }
    next();
} */


/* exports.checkBody = (req,res,next)=>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price...'
        })
    }
    next();
} */

exports.getAllTours = async (req, res) => {



    try {

        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields']

        console.log(req.query);

        const tours = await Tour.find(queryObj); 

        /* const tours = await Tour.find()
        .where('duration')
        .equals(5)
        .where('difficulty')
        .equals('easy'); */

        res.status(200).json({
            status: 'success',
            request: req.requestTime,
            results: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getTour = async (req, res) => {


    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

    /*const id = req.params.id * 1 //al multiplicar hace de un string un int 
     const tour = tours.find(el=>el.id===id)
    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    }) */
}

exports.createTour = async (req, res) => {


    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }


}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }



}


exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }


}