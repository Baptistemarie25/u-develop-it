const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use api routes 
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});


//Get all candidates

router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                As party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get a single candidate 

router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                As party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});


// delete candidate 

router.delete('/candidate/:id', (req,res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({error: res.message});
        } else if (!result.affectedRows){
            res.json({
                message:'candidate not found'
            });
        } else {
            res.json({
                message: 'Successfully Deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//create a candidate
router.post('/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
        if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
        const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
        const params = [body.first_name, body.last_name, body.industry_connected];

        db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    
    const sql = `UPDATE candidates SET party_id = ? 
                    WHERE id = ?`;
        const params = [req.body.party_id, req.params.id];
        db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
            message: 'Candidate not found'
            });
        } else {
            res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
            });
        }
    });
});

router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//delete parties 

router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: res.message});
            //checks if anything was deleted 
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});