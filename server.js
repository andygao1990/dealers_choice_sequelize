const { db, syncAndSeed, models:{ Person, Family } } = require ('./db')
const express = require ('express')
const app = express()

app.get('/api/families', async (req, res, next) => {
    try {
        res.send(await Family.findAll({
            include: [
                {model: Person, as: 'headOHH'}
        ]
        }))

    }
    catch(err){
        next(err)
    }
})

app.get('/api/people', async (req, res, next) => {
    try {
        res.send(await Person.findAll({
            include: [
                {model: Person, as: 'parent'},
                {model: Person, as: 'children'},
                {model: Family, as: 'familyInCharge'}
        ]
        }))

    }
    catch(err){
        next(err)
    }
})

const setUp = async () => {
    try {
        await db.authenticate()
        await syncAndSeed()
        const port = process.env.PORT || 3000
        app.listen(port, ()=>console.log(`listening on port ${port}`))
    }
    catch(err) {
        console.log(err)
    }
} 

setUp()