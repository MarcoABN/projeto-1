const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Protocolo = sequelize.define('Protocolo', {
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  assunto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dataCriacao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Adicione colunas para informações de votação
  statusVotacao: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'reprovado', 'nao votado'),
    allowNull: false,
    defaultValue: 'nao votado'
  },
});

module.exports = Protocolo;
