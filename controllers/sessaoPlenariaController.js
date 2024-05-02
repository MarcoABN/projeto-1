const SessaoPlenaria = require('../models/SessaoPlenaria');
const Protocolo = require('../models/Protocolo');

// Função para criar uma nova sessão plenária
exports.criarSessaoPlenaria = async (req, res) => {
  const { data, status } = req.body;

  try {
    const novaSessaoPlenaria = await SessaoPlenaria.create({ data, status });
    res.status(201).json(novaSessaoPlenaria);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para listar todas as sessões plenárias
exports.listarSessoesPlenarias = async (req, res) => {
  try {
    const sessoesPlenarias = await SessaoPlenaria.findAll();
    res.status(200).json(sessoesPlenarias);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para buscar todos os protocolos associados a uma sessão plenária específica
exports.buscarProtocolosPorSessaoPlenaria = async (req, res) => {
  const { id } = req.params;

  try {
    const sessaoPlenaria = await SessaoPlenaria.findByPk(id, { include: Protocolo });
    if (!sessaoPlenaria) {
      res.status(404).json({ erro: 'Sessão plenária não encontrada' });
      return;
    }
    
    const protocolos = sessaoPlenaria.Protocolos;
    res.status(200).json(protocolos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
