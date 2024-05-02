const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'feminino', 'outro'),
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargo: {
    type: DataTypes.ENUM('vereador', 'presidente', 'comissao', 'procurador', 'prefeito', 'assessor'),
    allowNull: false
  }
});

module.exports = Usuario;
