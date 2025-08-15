const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Configurações
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Banco de dados
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) console.error(err.message);
    else console.log("Conectado ao SQLite.");
});

// Cria tabela de funcionários
db.run(`CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cargo TEXT,
    salario REAL
)`);

// Rotas
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

// Inicia servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
