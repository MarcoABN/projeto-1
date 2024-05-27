const fs = require('fs');
const path = require('path');
const Protocolo = require('../models/Protocolo');

// Função para criar um novo protocolo com arquivo PDF
exports.criarProtocolo = async (req, res) => {
  const { numero, assunto, conteudo, dataCriacao } = req.body;
  const pdf = req.files?.pdf; // Assumindo que o arquivo PDF é enviado como parte do corpo da requisição

  try {
    // Verifique se um arquivo PDF foi enviado
    if (!pdf) {
      return res.status(400).json({ erro: 'O arquivo PDF é obrigatório' });
    }

    // Salvar o arquivo PDF no servidor
    const pdfName = `${Date.now()}_${pdf.name}`;
    const pdfPath = path.join(__dirname, '..', 'uploads', pdfName);
    await pdf.mv(pdfPath);

    // Criar um novo protocolo com o caminho do arquivo PDF
    const novoProtocolo = await Protocolo.create({
      numero,
      assunto,
      conteudo,
      dataCriacao,
      pdfPath // Salva o caminho do arquivo no banco de dados
    });

    res.status(201).json(novoProtocolo);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.listarProtocolos = async (req, res) => {
  try {
    const protocolos = await Protocolo.findAll();
    const protocolosComPDF = protocolos.map(protocolo => {
      return {
        id: protocolo.id,
        numero: protocolo.numero,
        assunto: protocolo.assunto,
        conteudo: protocolo.conteudo,
        dataCriacao: protocolo.dataCriacao,
        pdfPath: protocolo.pdfPath // Inclui o caminho do arquivo PDF
      };
    });
    res.status(200).json(protocolosComPDF);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.obterProtocoloPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const protocolo = await Protocolo.findByPk(id);
    if (!protocolo) {
      res.status(404).json({ erro: 'Protocolo não encontrado' });
    } else {
      res.status(200).json(protocolo);
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para atualizar um protocolo pelo ID
exports.atualizarProtocolo = async (req, res) => {
  const { id } = req.params;
  const pdf = req.files?.pdf; // Assumindo que o arquivo PDF pode ser enviado na atualização

  try {
    let updateData = { ...req.body };

    // Se um novo arquivo PDF for enviado, atualize o caminho do arquivo
    if (pdf) {
      const pdfName = `${Date.now()}_${pdf.name}`;
      const pdfPath = path.join(__dirname, '..', 'uploads', pdfName);
      await pdf.mv(pdfPath);
      updateData.pdfPath = pdfPath;
    }

    const [rowsUpdated] = await Protocolo.update(updateData, {
      where: { id },
    });

    if (rowsUpdated === 0) {
      res.status(404).json({ erro: 'Protocolo não encontrado' });
    } else {
      const protocoloAtualizado = await Protocolo.findByPk(id);
      res.status(200).json(protocoloAtualizado);
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para excluir um protocolo pelo ID
exports.excluirProtocolo = async (req, res) => {
  const { id } = req.params;
  try {
    const protocolo = await Protocolo.findByPk(id);
    if (!protocolo) {
      return res.status(404).json({ erro: 'Protocolo não encontrado' });
    }

    // Excluir o arquivo PDF associado
    if (protocolo.pdfPath) {
      fs.unlinkSync(protocolo.pdfPath);
    }

    await Protocolo.destroy({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
