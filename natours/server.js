const mongoose = require('mongoose')
const app =  require('./app')


const DB = 'mongodb+srv://javi:root@cluster0.1xg4m.mongodb.net/natours?retryWrites=true&w=majority'

mongoose.connect(DB,{
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

