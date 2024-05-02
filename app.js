const express = require('express');
const routes = require('./routes/routes');
const sequelize = require('./config/db.config'); // Importe o objeto Sequelize

const app = express();

app.use(express.json());

// Rotas
app.use('/api', routes);

// Sincronize o modelo com o banco de dados
sequelize.sync().then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
}).catch(err => {
    console.error('Erro ao sincronizar modelos com o banco de dados:', err);
});

module.exports = app;