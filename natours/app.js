const fs = require('fs')
const express = require('express');
const app = express();

app.use(express.json());

/* app.get('/',(req,res)=>{
    res.status(200).json({message: 'Hola desde el servidor',app:'Natours'});
});

app.post('/',(req,res)=>{
    res.send('Puedes hacer post...')
}) */

const tours = JSON.parse( fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data:{
            tours: tours
        }
    })
})

app.get('/api/v1/tours/:id',(req,res)=>{

    const id=req.params.id * 1 //al multiplicar hace de un string un int 

    if(id >tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'ID inválido'
        })
    }

    const tour = tours.find(el=>el.id===id)

    res.status(200).json({
        status: 'success',
        
        data:{
            tour
        }
    })
})

app.post('/api/v1/tours',(req,res)=>{
   /*  console.log(req.body); */

   const newId = tours[tours.length-1].id +1;
   const newTour = Object.assign({id: newId }, req.body)

   tours.push(newTour);

   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
   })
})



const port = 3000;

app.listen(port,()=>{
    console.log(`App corriendo en el puerto ${port}`);
});
