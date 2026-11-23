
const UserRepository = require('../repositories/UserRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

async function register(nome, email, senha) {
    if (!nome || !email || !senha) {
        throw new Error('Preencha todos os campos.');
    }

    if (senha.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres.');
    }

    email = email.trim().toLowerCase();

    if (UserRepository.findByEmail(email)) {
        throw new Error('Este e-mail já está cadastrado.');
    }

    const hashedPassword = await hashPassword(senha);
    return UserRepository.create(nome.trim(), email, hashedPassword);
}

async function login(email, senha) {
    if (!email || !senha) {
        throw new Error('Informe e-mail e senha.');
    }

    const user = UserRepository.findByEmail(email.trim().toLowerCase());

    if (!user || !(await comparePassword(senha, user.senha))) {
        throw new Error('E-mail ou senha incorretos.');
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        usuario: UserRepository.findById(user.id)
    };
}

module.exports = { register, login };
