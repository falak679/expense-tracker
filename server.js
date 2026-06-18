

const express = require("express");

const sqlite3 = require("sqlite3").verbose();

const app = express();

const db =new sqlite3.Database("expenses.db");
db.run(`
 CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount INTEGER,
    category TEXT,
    date TEXT
 )
`);


app.use(express.json());

app.use(express.static("."));

app.get("/expenses", (req, res) => {

    db.all(
        "SELECT * FROM expenses",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

app.post("/expenses", (req, res) => {
     
    console.log(req.body);

    const { name, amount , category, date } = req.body;

    db.run(
        "INSERT INTO expenses (name, amount,category,date) VALUES (?, ?, ?, ?)",
        [name, amount, category,date],
        function(err) {

            if (err) {
                console.log("SQL ERROR:", err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Expense added"
            });

        }
    );

});

app.put("/expenses/:id", (req, res) => {

    const {
        name,
        amount,
        category,
        date
    } = req.body;

    db.run(
        `UPDATE expenses
         SET name = ?,
             amount = ?,
             category = ?,
             date = ?
         WHERE id = ?`,
        [
            name,
            amount,
            category,
            date,
            req.params.id
        ],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Expense updated"
            });

        }
    );

});

app.delete("/expenses/:id", (req, res) => {

    db.run(
        "DELETE FROM expenses WHERE id = ?",
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Expense deleted"
            });

        }
    );

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});