
const fs = require('fs');
const { saveDatabase } = require('../database/connection');

async function importarHistorico(caminhoArquivo, db) {
    const dados = JSON.parse(
        fs.readFileSync(caminhoArquivo, 'utf8')
    );

    const gpu = dados.chip;

    if (!gpu || !gpu.model || !gpu.vendor || !Array.isArray(dados.series)) {
        throw new Error('Formato JSON do RadarGPU inválido.');
    }

    // Procura a placa antes de cadastrar
    let consultaGpu = db.prepare(`
        SELECT id FROM placas_video WHERE nome = ?
    `);

    consultaGpu.bind([gpu.model]);

    let placaId;

    if (consultaGpu.step()) {
        placaId = consultaGpu.getAsObject().id;
    }

    consultaGpu.free();

    // Cadastra somente se ainda não existir
    if (!placaId) {
        db.run(`
            INSERT INTO placas_video (nome, fabricante)
            VALUES (?, ?)
        `, [gpu.model, gpu.vendor.toUpperCase()]);

        placaId = db.exec(
            'SELECT last_insert_rowid() AS id'
        )[0].values[0][0];
    }

    const inserir = db.prepare(`
        INSERT OR IGNORE INTO historico_precos_diarios (
            placa_id,
            data_observacao,
            preco_minimo,
            preco_medio,
            quantidade_ofertas,
            loja_menor_preco,
            fonte
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let importados = 0;
    let ignorados = 0;

    for (const registro of dados.series) {
        inserir.run([
            placaId,
            registro.day,
            registro.min,
            registro.avg,
            registro.n_offers,
            registro.store,
            'RadarGPU'
        ]);

        if (db.getRowsModified() > 0) {
            importados++;
        } else {
            ignorados++;
        }
    }

    inserir.free();

    saveDatabase();

    return {
        gpu: gpu.model,
        importados,
        ignorados
    };
}

module.exports = { importarHistorico };
