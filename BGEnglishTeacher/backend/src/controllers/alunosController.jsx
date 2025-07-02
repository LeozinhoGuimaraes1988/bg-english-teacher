const admin = require('firebase-admin');
const db = admin.firestore();

exports.listarAlunos = async (req, res) => {
  try {
    const snapshot = await db.collection('alunos').get();
    const alunos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar alunos' });
  }
};

exports.criarAluno = async (req, res) => {
  try {
    const data = req.body;
    const alunoRef = await db.collection('alunos').add({
      ...data,
      dataCadastro: new Date().toISOString(),
      aulasRealizadas: 0,
    });
    res.status(201).json({ id: alunoRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
};
