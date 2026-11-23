
const AuthService = require('../services/AuthService');

async function register(req, res) {
    try {
        const { nome, email, senha } = req.body;

        const usuario = await AuthService.register(nome, email, senha);

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            usuario
        });
    } catch (error) {
        return res.status(400).json({ erro: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const resultado = await AuthService.login(email, senha);

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(401).json({ erro: error.message });
    }
}

module.exports = { register, login };
