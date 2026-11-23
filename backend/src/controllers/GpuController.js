
const GpuRepository = require('../repositories/GpuRepository');

// Lista todas as GPUs
function listar(req, res) {
    try {
        const gpus = GpuRepository.findAll();
        return res.status(200).json(gpus);
    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao listar placas de vídeo.'
        });
    }
}

// Consulta uma GPU específica
function buscarPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }

        const gpu = GpuRepository.findById(id);

        if (!gpu) {
            return res.status(404).json({
                erro: 'Placa de vídeo não encontrada.'
            });
        }

        return res.status(200).json(gpu);
    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao buscar placa de vídeo.'
        });
    }
}

// Consulta o histórico de preços
function historico(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }

        const gpu = GpuRepository.findById(id);

        if (!gpu) {
            return res.status(404).json({
                erro: 'Placa de vídeo não encontrada.'
            });
        }

        const historico = GpuRepository.findHistory(id);

        return res.status(200).json({
            gpu,
            total: historico.length,
            historico
        });
    } catch (error) {
        return res.status(500).json({
            erro: 'Erro ao consultar histórico.'
        });
    }
}

// Consulta os indicadores históricos e classifica o preço
function analise(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }

        const gpu = GpuRepository.findById(id);

        if (!gpu) {
            return res.status(404).json({
                erro: 'Placa de vídeo não encontrada.'
            });
        }

        const analise = GpuRepository.getAnalysis(id);

        const precoAtual = req.query.precoAtual
            ? Number(req.query.precoAtual)
            : null;

        let classificacao = null;

        if (precoAtual !== null) {
            classificacao = GpuRepository.classifyPurchase(
                precoAtual,
                analise
            );
        }

        return res.status(200).json({
            gpu,
            analise,
            precoAtual,
            classificacao
        });
    } catch (error) {

            console.error(error);

        return res.status(500).json({
            erro: 'Erro ao analisar preços.'
        });
    }
}

module.exports = {
    listar,
    buscarPorId,
    historico,
    analise
};
