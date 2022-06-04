const fs = require('fs');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require("./../../models/tourModel")
const User = require("./../../models/userModel")
const Review = require("./../../models/reviewModel")

dotenv.config();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(con => {
    /* console.log(con.connections) */
    console.log('Conexión exitosa con la BD...')
})

//LEER ARCHIVO JSON

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

//IMPORTAR DATOS EN LA BD

const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users,{validateBeforeSave:false})
        await Review.create(reviews)
        console.log('Datos cargados correctamente');
        
    } catch (err) {
        console.log(err)
    }
    process.exit();
}

//BORRAR TODOS LOS DATOS DE LA COLECCIÓN

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Datos borrados correctamente');
        
    } catch (err) {
        console.log(err)
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
    deleteData()
}

