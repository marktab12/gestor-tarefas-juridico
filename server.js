const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'escritorio-juridico-secret-2024';

// Garante que a pasta de dados existe (para Render com disco persistente)
const dataDir = process.env.DATA_DIR || './data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'tarefas.db'));

// Criação das tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_tarefa TEXT,
    tarefa TEXT NOT NULL,
    responsavel TEXT,
    obs TEXT,
    devolutiva TEXT,
    status TEXT DEFAULT 'pendente',
    criado_por TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticação
function autenticar(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Não autorizado' });
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

// ── ROTAS DE USUÁRIO ──────────────────────────────────────────
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' });
  try {
    const hash = await bcrypt.hash(senha, 10);
    const stmt = db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
    stmt.run(nome, email.toLowerCase(), hash);
    res.json({ ok: true });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(400).json({ erro: 'E-mail já cadastrado' });
    res.status(500).json({ erro: 'Erro ao cadastrar' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email?.toLowerCase());
  if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
  const ok = await bcrypt.compare(senha, usuario.senha);
  if (!ok) return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
  const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, nome: usuario.nome });
});

// ── ROTAS DE TAREFAS ──────────────────────────────────────────
app.get('/api/tarefas', autenticar, (req, res) => {
  const tarefas = db.prepare('SELECT * FROM tarefas ORDER BY data_tarefa DESC, id DESC').all();
  res.json(tarefas);
});

app.post('/api/tarefas', autenticar, (req, res) => {
  const { data_tarefa, tarefa, responsavel, obs, devolutiva, status } = req.body;
  if (!tarefa) return res.status(400).json({ erro: 'A tarefa não pode estar vazia' });
  const stmt = db.prepare(`
    INSERT INTO tarefas (data_tarefa, tarefa, responsavel, obs, devolutiva, status, criado_por)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(data_tarefa || '', tarefa, responsavel || '', obs || '', devolutiva || '', status || 'pendente', req.usuario.nome);
  const nova = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(result.lastInsertRowid);
  res.json(nova);
});

app.put('/api/tarefas/:id', autenticar, (req, res) => {
  const { data_tarefa, tarefa, responsavel, obs, devolutiva, status } = req.body;
  const stmt = db.prepare(`
    UPDATE tarefas SET data_tarefa=?, tarefa=?, responsavel=?, obs=?, devolutiva=?, status=?, atualizado_em=CURRENT_TIMESTAMP
    WHERE id=?
  `);
  stmt.run(data_tarefa || '', tarefa, responsavel || '', obs || '', devolutiva || '', status || 'pendente', req.params.id);
  const atualizada = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(req.params.id);
  res.json(atualizada);
});

app.delete('/api/tarefas/:id', autenticar, (req, res) => {
  db.prepare('DELETE FROM tarefas WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Rota fallback → retorna o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
