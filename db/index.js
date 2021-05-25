const Sequelize = require ('sequelize')
const { STRING, DATE, UUID, UUIDV4 } = Sequelize
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/sequelize_hw_db')

const Family = db.define ('family', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING
    }
})

const Person = db.define ('person', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING
    }
})

Family.belongsTo (Person, { as: 'headOHH' })
Person.hasMany(Family, { foreignKey: 'headOHHId', as: 'familyInCharge'})

Person.belongsTo (Person, { as: 'parent'})
Person.hasMany (Person, { foreignKey: 'parentId', as: 'children'})


const syncAndSeed = async () => {
    await db.sync({ force: true})
    const [moe, lucy, larry, ethyl, smith, white, brown] = await Promise.all([
        Person.create({name: 'moe'}),
        Person.create({name: 'lucy'}),
        Person.create({name: 'larry'}),
        Person.create({name: 'ethyl'}),
        Family.create({name: 'smith'}),
        Family.create({name: 'white'}),
        Family.create({name: 'brown'}),
    ])
    smith.headOHHId = lucy.id
    white.headOHHId = larry.id
    brown.headOHHId = ethyl.id
    moe.parentId = lucy.id
    await Promise.all([
        smith.save(),
        white.save(),
        brown.save(),
        moe.save()
    ])
}

module.exports = {
    db,
    syncAndSeed,
    models: {
        Family,
        Person
    }

}