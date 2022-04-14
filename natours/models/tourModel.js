const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Se necesita un nombre'],
        unique: true
    },
    rating: {
        type:Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'Se necesita un precio']
    }
});

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;