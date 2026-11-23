
const express = require('express');
const GpuController = require('../controllers/GpuController');

const router = express.Router();

router.get('/', GpuController.listar);
router.get('/:id', GpuController.buscarPorId);
router.get('/:id/historico', GpuController.historico);
router.get('/:id/analise', GpuController.analise);

module.exports = router;
