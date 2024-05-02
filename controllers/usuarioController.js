const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Função para registrar um novo usuário
exports.registrarUsuario = async (req, res) => {
  const { nome, email, senha, cargo, cpf } = req.body;

  // Verifique se os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha || !cargo || !cpf) {
    return res.status(400).json({ erro: 'Nome, email, senha, cargo e CPF são obrigatórios' });
  }

  try {
    // Verificar se o email já está em uso
    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ erro: 'Este email já está em uso' });
    }

    // Verificar se o CPF já está em uso
    const cpfExistente = await Usuario.findOne({ where: { cpf } });
    if (cpfExistente) {
      return res.status(400).json({ erro: 'Este CPF já está em uso' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar um novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: hashedPassword,
      cargo,
      telefone: req.body.telefone || null,
      dataNascimento: req.body.dataNascimento || null,
      genero: req.body.genero || null,
      endereco: req.body.endereco || null,
      cpf
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para fazer login de usuário
exports.loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  // Verifique se o email e a senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    // Verifique se o usuário com o email fornecido existe no banco de dados
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Verifique se a senha fornecida corresponde à senha do usuário no banco de dados
    const senhaCorrespondente = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorrespondente) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Se as credenciais estiverem corretas, crie um token de acesso
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET, // Você precisa definir essa variável de ambiente
      { expiresIn: '1h' } // Defina a expiração do token conforme desejado
    );

    // Envie o token como resposta
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para recuperar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para recuperar um usuário pelo ID
exports.obterUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    } else {
      res.status(200).json(usuario);
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para atualizar um usuário pelo ID
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsUpdated] = await Usuario.update(req.body, {
      where: { id },
    });
    if (rowsUpdated === 0) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    } else {
      const usuarioAtualizado = await Usuario.findByPk(id);
      res.status(200).json(usuarioAtualizado);
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para excluir um usuário pelo ID
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioExcluido = await Usuario.destroy({ where: { id } });
    if (usuarioExcluido === 0) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
