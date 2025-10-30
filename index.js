const express = require('express');
const app = express();
const pool = require('./database/db');
const { swaggerUi, swaggerSpec } = require('./swagger');

const PORT = 3000;
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`servidor rodando! ${PORT}`);
});


// ===================== GET =====================

/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Retorna todos os usuários cadastrados
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       500:
 *         description: Erro ao buscar usuários
 */
app.get('/compras', async (req, res) => {
    try {
        const usuarios = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(usuarios.rows);
    } catch (err) {
        console.error('Falha na conexão com o usuário', err);
        res.status(500).json({ menssagem: 'Falha na conexão com o usuário' });
    }
});

/**
 * @swagger
 * /database/db.js:
 *   get:
 *     summary: Retorna todos os itens da lista de compras
 *     tags: [Lista]
 *     responses:
 *       200:
 *         description: Itens retornados com sucesso
 *       500:
 *         description: Erro ao acessar a lista
 */
app.get('/database/db.js', async (req, res) => {
    try {
        const lista = await pool.query('SELECT * FROM lista');
        res.status(200).json(lista.rows);
    } catch (err) {
        console.error('Falha ao acessar a lista', err);
        res.status(500).json({ menssagem: 'Falha ao acessar a lista' });
    }
});


// ===================== POST =====================

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               created_at: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       500:
 *         description: Erro ao criar usuário
 */
app.post('/usuarios', async (req, res) => {
    const { name, email, password, created_at } = req.body;

    try {
        const usuarios = await pool.query(
            'INSERT INTO usuarios (name, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, created_at]
        );
        res.status(201).json(usuarios.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar usuario:', err);
        res.status(500).json({ menssagem: 'Erro ao adicionar usuario', err });
    }
});

/**
 * @swagger
 * /lista:
 *   post:
 *     summary: Adiciona um novo item na lista de compras
 *     tags: [Lista]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               amount: { type: integer }
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       500:
 *         description: Erro ao adicionar item
 */
app.post('/lista', async (req, res) => {
    const { item, description, price, amount } = req.body;

    try {
        const lista = await pool.query(
            'INSERT INTO lista (item, description, price, amount) VALUES ($1, $2, $3, $4) RETURNING *',
            [item, description, price, amount]
        );
        res.status(201).json(lista.rows[0]);
    } catch (err) {
        console.error('Erro ao adicionar item na lista:', err.message);
        res.status(500).json({ menssagem: 'Erro ao adicionar produto na lista', erro: err.message });
    }
});


// ===================== PUT =====================

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: integer }
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar
 */
app.put('/usuarios', async (req, res) => {
    const { id, name, email, password } = req.body;

    try {
        const usuarios = await pool.query(
            'UPDATE usuarios SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [name, email, password, id]
        );

        if (usuarios.rows.length === 0) {
            return res.status(404).json({ menssagem: 'Usuário não encontrado' });
        }

        res.status(200).json(usuarios.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err.message);
        res.status(500).json({ menssagem: 'Erro ao atualizar usuário', erro: err.message });
    }
});

/**
 * @swagger
 * /lista:
 *   put:
 *     summary: Atualiza um item existente na lista
 *     tags: [Lista]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: integer }
 *               item: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               amount: { type: integer }
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro ao atualizar
 */
app.put('/lista', async (req, res) => {
    const { id, item, description, price, amount } = req.body;

    try {
        const lista = await pool.query(
            'UPDATE lista SET item = $1, description = $2, price = $3, amount = $4 WHERE id = $5 RETURNING *',
            [item, description, price, amount, id]
        );

        if (lista.rows.length === 0) {
            return res.status(404).json({ menssagem: 'Item não encontrado' });
        }

        res.status(200).json(lista.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar item:', err.message);
        res.status(500).json({ menssagem: 'Erro ao atualizar item', erro: err.message });
    }
});


// ===================== DELETE =====================

/**
 * @swagger
 * /usuarios:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: integer }
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao deletar
 */
app.delete('/usuarios', async (req, res) => {
    const { id } = req.body;

    try {
        const usuarios = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

        if (usuarios.rows.length === 0) {
            return res.status(404).json({ menssagem: 'Usuário não encontrado' });
        }

        res.status(200).json({ menssagem: 'Usuário removido com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err.message);
        res.status(500).json({ menssagem: 'Erro ao deletar usuário', erro: err.message });
    }
});

/**
 * @swagger
 * /lista:
 *   delete:
 *     summary: Remove um item da lista pelo ID
 *     tags: [Lista]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: integer }
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro ao deletar
 */
app.delete('/lista', async (req, res) => {
    const { id } = req.body;

    try {
        const lista = await pool.query('DELETE FROM lista WHERE id = $1 RETURNING *', [id]);

        if (lista.rows.length === 0) {
            return res.status(404).json({ menssagem: 'Item não encontrado' });
        }

        res.status(200).json({ menssagem: 'Item removido com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar item:', err.message);
        res.status(500).json({ menssagem: 'Erro ao deletar item', erro: err.message });
    }
});
