const app = require('./app');
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});