const mongoose = require('mongoose')
const app =  require('./app')
const dotenv = require('dotenv')

dotenv.config();



mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(con =>{
    /* console.log(con.connections) */
    console.log('Conexión exitosa con la BD...')
})



const port = 3000;
app.listen(port,()=>{
    console.log(`App corriendo en el puerto ${port}`);
});

