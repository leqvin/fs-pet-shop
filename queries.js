const Pool = require('pg').Pool
const pool = new Pool({
  user: 'Vince',
  host: 'localhost',
  database: 'pets',
  //password: 'password', <= Not needed due to trust
  port: 5432,
})

// POST route, CREATE
const createPet = (req, res) => {
    const {name, kind, age} = req.body;
    let ageBool = typeof(age) === 'number';
    console.log(ageBool)
    if(name && kind && ageBool){
        pool.query('INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *', [name, kind, age], (err,result) =>{
            if (err) {
                throw err;
                //res.status(500).send(`Internal Server Error`)
            } else {
                res.status(201).send(result.rows[0])
            }
        })
    } else {
        res.status(404).send("Age not int or missing parameters");
    }
}

// GET route, READ
const getPets = (req, res) => {
    pool.query('SELECT * FROM pets ORDER BY id ASC', (err, result) => {
        if (err) {
            throw err;
        } else {
            res.status(200).send(result.rows)
        }
    })
}

// GET pet by specific ID
const getPetById = (req, res) => {
    const id = Number(req.params.id);
    pool.query('SELECT * FROM pets WHERE id = $1',[id], (err, result) => {
        if (err) {
            throw error
        } else {
            if(result.rowCount===0){
                res.status(404).send("Pet ID Not Found")
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    })
}

// PATCH route, UPDATE
const updatePet = (req, res) => {
    const id = Number(req.params.id);
    const {name, kind, age} = req.body;
    const query = 'UPDATE pets SET name = COALESCE($1, name), kind = COALESCE($2, kind), age = COALESCE($3, age)  WHERE id = $4 RETURNING *';
    pool.query(query, [name, kind, age, id], (err, result) =>{
        if (err) {
            throw error;
        } else {
            if(result.rows.length===0){
                res.status(404).send("Pet ID Not Found")
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    })
}

// DELETE route, DELETE
const deletePet = (req, res) => {
    const id = Number(req.params.id);
    pool.query('DELETE FROM pets WHERE id = $1 RETURNING *', [id], (err, result) => {
        if (err) {
            throw error; 
        } else {
            if(result.rows.length===0){
                res.status(404).send("Pet ID Not Found")
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    })
}

module.exports = {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
  };