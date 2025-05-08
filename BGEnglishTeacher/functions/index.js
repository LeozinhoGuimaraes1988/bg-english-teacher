const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

admin.initializeApp();
const storage = new Storage();

exports.uploadImagemAluno = functions.https.onRequest(async (req, res) => {
  // 🔓 Habilita CORS para todos os domínios (ou especifique seu domínio)
  // res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Origin', 'https://bg-english-teacher.web.app');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Trata requisição preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send('Não autorizado');
  }

  const idToken = authHeader.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('Erro ao verificar token', error);
    return res.status(403).send('Token inválido');
  }

  const busboy = Busboy({ headers: req.headers });
  const uploads = {};
  let alunoId;

  busboy.on('field', (fieldname, val) => {
    if (fieldname === 'alunoId') alunoId = val;
  });

  busboy.on('file', (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const filepath = path.join(os.tmpdir(), filename);
    uploads[fieldname] = { file: filepath, mimetype: mimeType };
    console.log('[🟩 recebendo arquivo]', filename, '→', filepath);
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on('finish', async () => {
    if (!uploads['file']) {
      return res.status(400).send('Nenhum arquivo enviado');
    }

    const fileInfo = uploads['file'];
    const bucket = admin.storage().bucket();
    const destination = `fotos-alunos/${alunoId}/${path.basename(
      fileInfo.file
    )}`;

    console.log('[uploadImagemAluno] Início do upload:', destination);
    console.log('[uploadImagemAluno] Tipo:', fileInfo.mimetype);

    try {
      await bucket.upload(fileInfo.file, {
        destination,
        metadata: {
          contentType: fileInfo.mimetype,
        },
      });

      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(destination)}?alt=media`;

      console.log('[uploadImagemAluno] Upload concluído:', fileUrl);
      return res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error('[uploadImagemAluno] Erro ao subir imagem:', error);
      return res.status(500).send('Erro no upload');
    }
  });

  busboy.end(req.rawBody);
});
