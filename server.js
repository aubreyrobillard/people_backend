///////////////////////
//IMPORT DEPENDENCIES//
///////////////////////

// read our .env variables
require('dotenv').config();
// pull PORT from .env, give default value
// const PORT = process.env.PORT || 8000
// CONST DATABASE_URL = process.env.DATABASE_URL
const { PORT = 8000, DATABASE_URL } = process.env
const express = require('express')
// create application object
const app = express()
// import mongoose
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')



///////////////////////
//DATABASE CONNECTION//
///////////////////////

// establish connection
mongoose.connect(DATABASE_URL)
// connection events
mongoose.connection
    .on('open', () => console.log('you are connected to mongoose'))
    .on('close', () => console.log('you are not connected to mongoose'))
    .on('error', (error) => console.log(error))



///////////////////////
////////MODELS////////
///////////////////////
// models = always PascalCase, singular "People"
// collection , tables= snake_case, plural "peoples"

const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", peopleSchema)

///////////////////////
////MIDDLEWARE/////
///////////////////////
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors())
// morgan for logging requests
app.use(morgan('dev'))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())


///////////////////////
///////ROUTES//////////
///////////////////////

//'/people'
// INDUCES - INDEX, xNEWx, DELETE, UPDATE, CREATE, xEDITx, SHOW
// INDUCS- INDEX, DESTROY, UPDATE, CREATE, SHOW, (FOR A JSON API)

// INDEX
// async api or database calls
app.get('/people', async (req, res) => {
    try {
        // fetch the people from the database
        const person = await People.find({})
        res.json(person)
    } catch (error) {
        // send back the error as json
        res.status(400).json({error})
    }
})

// POST
// create a new person
app.post('/people', async (req, res) => {
    try {
        // create the new person
        const person = await People.create(req.body)
        // send back the newly created person
        res.json(person)
    } catch (error) {
        res.status(400).json({error})
    }
})

// SHOW
// get a single person
app.get('/people/:id', async (req, res) => {
    try {
        const id = req.params.id
        // get a person from db
        const person = await People.findById(id)
        //return person as json
        res.json(person)
    } catch (error) {
        res.status(400).json({error})
    }
})

// UPDATE
// update a person
app.put('/people/:id', async (req, res) => {
    try{
        const id = req.params.id
        const person = await People.findByIdAndUpdate(id, req.body, {new: true})
        res.json(person)
    } catch (error){
        res.status(400).json({error})
    }
})

// DESTROY (delete)
// delete a person (all my ex's)
app.delete('/people/:id', async (req, res) => {
    try{
        const id = req.params.id
        const person = await People.findByIdAndDelete(id)
        res.status(204).json(person)
    } catch (error){
        res.status(400).json({error})
    }
})


app.get('/', (req, res) => {
    res.json({hello: 'world'})
});

///////////////////////
///////LISTENER////////
///////////////////////
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
});