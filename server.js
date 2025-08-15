const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) console.error(err.message);
    else console.log("Conectado ao SQLite.");
});

db.run(`CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cargo TEXT,
    salario REAL
)`);

app.get("/funcionarios", (req, res) => {
    db.all("SELECT * FROM funcionarios", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post("/funcionarios", (req, res) => {
    const { nome, cargo, salario } = req.body;
    db.run(
        "INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)",
        [nome, cargo, salario],
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put("/funcionarios/:id", (req, res) => {
    const { nome, cargo, salario } = req.body;
    const { id } = req.params;
    db.run(
        "UPDATE funcionarios SET nome=?, cargo=?, salario=? WHERE id=?",
        [nome, cargo, salario, id],
        function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ changes: this.changes });
        }
    );
});

app.delete("/funcionarios/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM funcionarios WHERE id=?", [id], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ changes: this.changes });
    });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
