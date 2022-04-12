const fs = require('fs')
const express = require('express');
const morgan =require('morgan')
const app = express();




app.use(express.json());

app.use(morgan('dev'));

app.use((req,res,next)=>{
    console.log('Hola desde el middleware...')
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
})
const tours = JSON.parse( fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req,res)=>{
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        request: req.requestTime,
        results: tours.length,
        data:{
            tours: tours
        }
    })
}

const getTour = (req,res)=>{
    const id=req.params.id * 1 //al multiplicar hace de un string un int 
    if(id >tours.length || !tour){
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
}


const createTour=(req,res)=>{
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
 }

 const updateTour = (req,res)=>{
    if(req.params.id * 1 >tours.length ){
        return res.status(404).json({
            status: 'fail',
            message: 'ID inválido'
        })
    }
    res.status(200).json({
        status:'success',
        data: {
            tour: 'Tour actualizado...'
        }
    })
}


const deleteTour =(req,res)=>{
    if(req.params.id * 1 >tours.length ){
        return res.status(404).json({
            status: 'fail',
            message: 'ID inválido'
        })
    }
    res.status(204).json({
        status:'success',
        data: null
    })
}

/* app.get('/api/v1/tours',getAllTours);
app.get('/api/v1/tours/:id',getTour);
app.post('/api/v1/tours',createTour);
app.patch('/api/v1/tours/:id',updateTour);
app.delete('/api/v1/tours/:id',deleteTour); */

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;

app.listen(port,()=>{
    console.log(`App corriendo en el puerto ${port}`);
});

