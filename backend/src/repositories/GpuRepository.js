
let db;

function setDatabase(database) {
    db = database;
}

// Lista todas as placas cadastradas
function findAll() {
    const resultado = db.exec(`
        SELECT id, nome, fabricante
        FROM placas_video
        ORDER BY nome ASC
    `);

    return resultado.length ? resultado[0].values.map(linha => ({
        id: linha[0],
        nome: linha[1],
        fabricante: linha[2]
    })) : [];
}

// Busca uma placa pelo ID
function findById(id) {
    const stmt = db.prepare(`
        SELECT id, nome, fabricante
        FROM placas_video
        WHERE id = ?
    `);

    stmt.bind([id]);

    const gpu = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();

    return gpu;
}

// Consulta o histórico diário de preços
function findHistory(placaId) {
    const stmt = db.prepare(`
        SELECT
            data_observacao,
            preco_minimo,
            preco_medio,
            quantidade_ofertas,
            loja_menor_preco
        FROM historico_precos_diarios
        WHERE placa_id = ?
        ORDER BY data_observacao ASC
    `);

    stmt.bind([placaId]);

    const historico = [];

    while (stmt.step()) {
        historico.push(stmt.getAsObject());
    }

    stmt.free();

    return historico;
}


function getAnalysis(placaId) {
    const stmt = db.prepare(`
        SELECT
            MIN(preco_minimo) AS menor_preco,
            MAX(preco_minimo) AS maior_preco,
            ROUND(AVG(preco_minimo), 2) AS preco_medio,
            COUNT(*) AS total_registros
        FROM historico_precos_diarios
        WHERE placa_id = ?
    `);

    stmt.bind([placaId]);

    const analise = stmt.step() ? stmt.getAsObject() : null;

    stmt.free();

    return analise;
}



function classifyPurchase(precoAtual, analise) {
    if (
        typeof precoAtual !== 'number' ||
        !Number.isFinite(precoAtual) ||
        precoAtual <= 0 ||
        !analise ||
        analise.menor_preco == null ||
        analise.preco_medio == null
    ) {
        throw new Error('Dados insuficientes para classificar a compra.');
    }

    const minimo = Number(analise.menor_preco);
    const media = Number(analise.preco_medio);

    if (precoAtual <= minimo * 1.10) {
        return 'Excelente compra';
    }

    if (precoAtual < media * 0.90) {
        return 'Bom preço';
    }

    if (precoAtual <= media * 1.10) {
        return 'Preço normal';
    }

    return 'Caro';
}



module.exports = {
    setDatabase,
    findAll,
    findById,
    findHistory,
    getAnalysis,
    classifyPurchase
};
