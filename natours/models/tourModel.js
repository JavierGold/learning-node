const mongoose = require('mongoose')
const slugify=require('slugify')


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Se necesita un nombre'],
        unique: true,
        trim: true
    },
    slug:String,
    test:String,
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
    
},{
    toJSON:{ virtuals:true},
    toObject:{ virtuals:true}
});

tourSchema.virtual('durationWeek').get(function(){
    return this.duration / 7
})

//DOCUMENT MIDDLEWARE
tourSchema.pre('save',function(next){
this.slug = slugify(this.name,{lower:true})
next()
})

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;