const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const sessaoPlenariaController = require('../controllers/sessaoPlenariaController');
const protocoloController = require('../controllers/protocoloController');


// Rotas para usuários
router.post('/usuarios', usuarioController.registrarUsuario);
router.get('/usuarios', usuarioController.listarUsuarios);
router.get('/usuarios/:id', usuarioController.obterUsuarioPorId);
router.put('/usuarios/:id', usuarioController.atualizarUsuario);
router.delete('/usuarios/:id', usuarioController.excluirUsuario);
router.post('/login', usuarioController.loginUsuario);

// Rotas para sessões plenárias
router.post('/sessoes-plenarias', sessaoPlenariaController.criarSessaoPlenaria);
router.get('/sessoesplenarias', sessaoPlenariaController.listarSessoesPlenarias);
router.get('/sessoesplenarias/:id/protocolos', sessaoPlenariaController.buscarProtocolosPorSessaoPlenaria);

// Rotas para protocolos
router.post('/protocolos', protocoloController.criarProtocolo);
router.get('/protocolos', protocoloController.listarProtocolos);
router.get('/protocolos/:id', protocoloController.obterProtocoloPorId);
router.put('/protocolos/:id', protocoloController.atualizarProtocolo);
router.delete('/protocolos/:id', protocoloController.excluirProtocolo);

//router.post('/protocolos', upload.single('pdf'), protocoloController.criarProtocolo);



module.exports = router;
