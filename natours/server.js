const mongoose = require('mongoose')
const app =  require('./app')


const DB = 'mongodb+srv://javi:root@cluster0.1xg4m.mongodb.net/natours?retryWrites=true&w=majority'

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    userFindAndModify:false
}).then(con =>{
    console.log(con.connections)
    console.log('Conexión exitosa...')
})

const port = 3000;

app.listen(port,()=>{
    console.log(`App corriendo en el puerto ${port}`);
});