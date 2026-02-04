const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// BANCO DE DADOS
// =========================
const db = new sqlite3.Database("database.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =========================
// TABELAS
// =========================
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS requisicoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT,
  descricao TEXT,
  status TEXT,
  data TEXT
)
`);

// =========================
// USUÁRIO PADRÃO
// login: admin
// senha: 123
// =========================
db.run(`
INSERT OR IGNORE INTO users (id, username, password)
VALUES (1, 'admin', '123')
`);

// =========================
// LOGIN
// =========================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (row) res.json({ success: true });
      else res.json({ success: false });
    }
  );
});

// =========================
// CRUD REQUISIÇÕES
// =========================

// CREATE – criar requisição
app.post("/requisicoes", (req, res) => {
  const { usuario, descricao } = req.body;
  const data = new Date().toLocaleString();

  db.run(
    `INSERT INTO requisicoes (usuario, descricao, status, data)
     VALUES (?, ?, ?, ?)`,
    [usuario, descricao, "Pendente", data],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// READ – listar todas
app.get("/requisicoes", (req, res) => {
  db.all(
    "SELECT * FROM requisicoes ORDER BY id DESC",
    (err, rows) => {
      res.json(rows);
    }
  );
});

// READ – buscar por ID
app.get("/requisicoes/:id", (req, res) => {
  db.get(
    "SELECT * FROM requisicoes WHERE id = ?",
    [req.params.id],
    (err, row) => {
      res.json(row);
    }
  );
});

// UPDATE – editar descrição
app.put("/requisicoes/:id", (req, res) => {
  const { descricao } = req.body;

  db.run(
    "UPDATE requisicoes SET descricao = ? WHERE id = ?",
    [descricao, req.params.id],
    () => {
      res.json({ updated: true });
    }
  );
});

// UPDATE – alterar status
app.put("/requisicoes/:id/status", (req, res) => {
  const { status } = req.body;

  db.run(
    "UPDATE requisicoes SET status = ? WHERE id = ?",
    [status, req.params.id],
    () => {
      res.json({ statusUpdated: true });
    }
  );
});

// DELETE – excluir requisição
app.delete("/requisicoes/:id", (req, res) => {
  db.run(
    "DELETE FROM requisicoes WHERE id = ?",
    [req.params.id],
    () => {
      res.json({ deleted: true });
    }
  );
});

// =========================
// START
// =========================
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
