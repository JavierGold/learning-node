const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Se necesita un nombre'],
        unique: true,
        trim: true
    },
    duration:{
        type:Number,
        required: [true, 'Se necesita una duración'],
    },
    maxGroupSize:{
        type:Number,
        required: [true, 'Se necesita un tamaño máximo'],
    },
    difficulty:{
        type: String,
        required: [true, 'Se necesita una dificultad'],
    },
    ratingsAverage: {
        type:Number,
        default: 4.5
    },
    ratingsQuantity: {
        type:Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Se necesita un precio']
    },
    priceDiscount: {
        type: Number,
    },
    summary:{
        type: String,
        trim: true,
        required: [true, 'Se necesita un resumen']
    },
    description:{
        type: String,
        trim: true,
        required: [true, 'Se necesita una descripción']
    },
    imageCover: {
        type:String,
        required: [true, 'Se necesita una imagen de portada']
    },
    images: {
        type:[String],
        required: [true, 'Se necesita una imagen']
    },
    createdAt: {
        type:Date,
        default: Date.now()
    },
    startDates: {
        type:[Date],
    },
    
});

tourSchema.virtual('durationWeek').get(function(){
    return this.duration / 7
})

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;