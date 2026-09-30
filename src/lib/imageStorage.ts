import { isSupabaseConfigured, supabase } from './supabase';

export const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const IMAGE_BUCKET = 'nextwin-library-media';

const allowedImageTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

export type ImageFolder = 'products' | 'bundles' | 'banners' | 'categories' | 'blog';

export function validateImageFile(file: File): string | null {
  if (!allowedImageTypes[file.type]) {
    return 'Formato de imagem não suportado. Use JPG, PNG ou WEBP.';
  }
  if (file.size > IMAGE_MAX_SIZE) {
    return 'A imagem excede o tamanho permitido de 5 MB.';
  }
  return null;
}

export async function validateImageContents(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10';
  const isWebp =
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';

  return (
    ((file.type === 'image/jpeg' || file.type === 'image/jpg') && isJpeg) ||
    (file.type === 'image/png' && isPng) ||
    (file.type === 'image/webp' && isWebp)
  );
}

export async function uploadImage(file: File, folder: ImageFolder, recordId?: string): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configure o Supabase para enviar imagens. Você ainda pode usar uma URL externa.');
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Entre com uma conta autorizada para enviar imagens.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['admin', 'editor'].includes(profile.role)) {
    throw new Error('Somente administradores autorizados podem enviar imagens.');
  }

  const validationError = validateImageFile(file);
  if (validationError || !(await validateImageContents(file))) {
    throw new Error(validationError || 'Arquivo de imagem inválido.');
  }

  const extension = allowedImageTypes[file.type];
  const safeRecordId = recordId?.replace(/[^a-zA-Z0-9_-]/g, '') || 'drafts';
  const fileId = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${folder}/${user.id}/${safeRecordId}/${fileId}.${extension}`;

  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      contentType: extension === 'jpg' ? 'image/jpeg' : file.type,
      upsert: false
    });

  if (error || !data) {
    throw new Error('Não foi possível fazer o upload. Verifique a configuração do Storage e tente novamente.');
  }

  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
}
