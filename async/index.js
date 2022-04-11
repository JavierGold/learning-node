const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent')

const readFilePro = file => {
    return new Promise((resolve,reject)=>{
        fs.readFile(file,(err,data)=>{
            if(err) reject('I could not find that file...')
            resolve(data);
        })
    })
}

const writeFilePro=(file,data)=>{
    return new Promise((resolve,reject)=>{
        fs.writeFile(file,data,err=>{
            if(err)reject('Could no write the file...');
            resolve('sucess');
        })
    })
}


const getDogPic = async () =>{
    try {
   const data = await readFilePro(`${__dirname}/dog.txt` )
   console.log(`Breed: ${data}`)

   const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
   console.log(res.body.message);

   await writeFilePro(`dog-img.txt`, res.body.message)
   console.log('Random dog img saved to file...');
    }
    catch (err){
        console.log(err.message)
        throw(err)
    }

    return '2 LISTO'
}

console.log('1 Se recibirán fotos de perros')
getDogPic().then(x=>{
    console.log(x)
    console.log('3 ya se recibieron')
})
.catch(err=>{
    console.log(err);
})

/* 
readFilePro(`${__dirname}/dog.txt` )
    .then(data=>{
    console.log(`Breed: ${data}`)
    return superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
    })
    .then(res => {

            console.log(res.body.message);
            return writeFilePro(`dog-img.txt`, res.body.message)
        })
        .then(()=>{
            console.log('Random dog img saved to file...');
        })
        .catch(err => {
            console.log(err.message)
        }) */


