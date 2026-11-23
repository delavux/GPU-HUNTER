
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const GpuRepository = require('./repositories/GpuRepository');
const UserRepository = require('./repositories/UserRepository');
const { initializeDatabase } = require('./database/schema');
const authRoutes = require('./routes/auth.routes');
const gpuRoutes = require('./routes/gpu.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/gpus', gpuRoutes);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ mensagem: 'GPU HUNTER API ONLINE!' });
});

async function startServer() {
    try {
        const database = await initializeDatabase();
        UserRepository.setDatabase(database);
        GpuRepository.setDatabase(database);

        const PORT = process.env.PORT || 3333;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`GPU HUNTER ONLINE na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}


startServer();
