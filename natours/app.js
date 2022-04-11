const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.status(200).json({message: 'Hola desde el servidor',app:'Natours'});
});

app.post('/',(req,res)=>{
    res.send('Puedes hacer post...')
})

const port = 3000;

app.listen(port,()=>{
    console.log(`App corriendo en el puerto ${port}`);
});