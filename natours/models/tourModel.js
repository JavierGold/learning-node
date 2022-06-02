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
    duration:{
        type:Number,
        required: [true, 'Se necesita una duración'],
    },
    maxGroupSize:{
        type:Number,
        required: [true, 'Se necesita un tamaño máximo'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty is either: easy, medium, difficult'
        }
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
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
        validate: {
          validator: function(val) {
            // this only points to current doc on NEW document creation
            return val < this.price;
          },
          message: 'Discount price ({VALUE}) should be below regular price'
        }
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
    secretTour: {
        type: Boolean,
        default: false
      },
    startLocation: {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      },
      locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
        }
      ],
      guides: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        }
      ]
    
},{
    toJSON:{ virtuals:true},
    toObject:{ virtuals:true}
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
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