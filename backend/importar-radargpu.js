
const fs = require('fs');
const path = require('path');

const { initializeDatabase } = require('./src/database/schema');
const { importarHistorico } = require('./src/services/RadarGpuImporter');

async function executar() {
    try {
        const db = await initializeDatabase();

        const pastaDados = path.join(__dirname, 'data');

        const arquivos = fs.readdirSync(pastaDados)
            .filter(arquivo => arquivo.endsWith('-history.json'))
            .sort();

        if (arquivos.length === 0) {
            throw new Error('Nenhum arquivo de histórico encontrado.');
        }

        console.log(`\nEncontrados ${arquivos.length} arquivos.\n`);

        let totalImportados = 0;
        let totalIgnorados = 0;

        for (const arquivo of arquivos) {
            const caminho = path.join(pastaDados, arquivo);

            try {
                const resultado = await importarHistorico(caminho, db);

                totalImportados += resultado.importados;
                totalIgnorados += resultado.ignorados;

                console.log(`GPU: ${resultado.gpu}`);
                console.log(`Importados: ${resultado.importados}`);
                console.log(`Ignorados: ${resultado.ignorados}`);
                console.log('------------------------------');
            } catch (error) {
                console.error(`Erro em ${arquivo}:`, error.message);
            }
        }

        console.log('\n===== IMPORTAÇÃO FINALIZADA =====');
        console.log('Arquivos encontrados:', arquivos.length);
        console.log('Total importado:', totalImportados);
        console.log('Total ignorado:', totalIgnorados);
        console.log('=================================\n');

    } catch (error) {
        console.error('Erro na importação:', error);
        process.exitCode = 1;
    }
}

executar();
