const express = require('express');
const fs = require('fs');
const path = require('path');
const Protocolo = require('../models/Protocolo');

exports.criarProtocolo = async (req, res) => {
  const { numero, assunto, conteudo, statusVotacao, dataCriacao } = req.body;
  const pdf = req.files?.pdf; // Assumindo que o arquivo PDF é enviado como parte do corpo da requisição

  try {
    // Verifique se um arquivo PDF foi enviado
    if (!pdf) {
      return res.status(400).json({ erro: 'O arquivo PDF é obrigatório' });
    }

    // Salvar o arquivo PDF no servidor
    const pdfName = `${Date.now()}_${pdf.name}`;
    const pdfPath = path.join(__dirname, '..', 'uploads', pdfName);
    
    // Assegure-se de que o diretório de upload existe
    const fs = require('fs');
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    await pdf.mv(pdfPath);

    // Criar um novo protocolo com o caminho do arquivo PDF
    const novoProtocolo = await Protocolo.create({
      numero,
      assunto,
      conteudo,
      statusVotacao,
      dataCriacao: dataCriacao || new Date(), // Usa a data atual se dataCriacao não for fornecida
      pdfPath: pdfName, // Salva o caminho do arquivo no banco de dados
      
    });

    res.status(201).json(novoProtocolo);
  } catch (error) {
    console.error("Erro ao criar protocolo:", error);
    res.status(500).json({ erro: error.message });
  }
};


// Função para listar todos os protocolos
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
        statusVotacao: protocolo.statusVotacao,
        pdfPath: protocolo.pdfPath
      };
    });
    res.status(200).json(protocolosComPDF);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Função para obter um protocolo por ID
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
      updateData.pdfPath = pdfName;
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
    const caminho = path.join(__dirname, '..', 'uploads', protocolo.pdfPath);
    if (!protocolo) {
      return res.status(404).json({ erro: 'Protocolo não encontrado' });
    }

    // Excluir o arquivo PDF associado
    if (caminho) {
      fs.unlinkSync(caminho);
    }

    await Protocolo.destroy({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
