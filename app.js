const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes'); // Ajuste o caminho conforme necessário

const app = express();

// Middleware para permitir todas as origens
app.use(cors()); // Permite todas as origens

// Outros middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usando o router para definir as rotas
app.use('/api', routes); // Prefixo '/api' para todas as rotas

module.exports = app;
