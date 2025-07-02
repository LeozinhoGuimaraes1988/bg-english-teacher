import { getAuth } from 'firebase/auth';

export const uploadImagem = async (file, alunoId) => {
  if (!(file instanceof File)) {
    console.error('[uploadImagem] Tipo de arquivo inválido:', file);
    throw new Error('Arquivo inválido');
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Usuário não autenticado. Upload não permitido.');
  }

  const token = await user.getIdToken(true); // 🔐 autenticação obrigatória

  const formData = new FormData();
  formData.append('file', file);
  formData.append('alunoId', alunoId);

  const response = await fetch(
    'https://uploadimagemaluno-rkwkak3lea-uc.a.run.app',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[uploadImagem] Erro no upload:', errorText);
    throw new Error('Erro ao fazer upload da imagem');
  }

  const data = await response.json();
  return data.url; // retorna a URL da imagem no Storage
};
