import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Link as LinkIcon, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { ImageFolder, uploadImage, validateImageContents, validateImageFile } from '../../lib/imageStorage';

interface ImageFieldProps {
  label: string;
  folder: ImageFolder;
  value: string;
  onChange: (value: string) => void;
  onValidityChange: (isValid: boolean) => void;
  recordId?: string;
  required?: boolean;
}

type ImageMode = 'upload' | 'url';
type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export const ImageField: React.FC<ImageFieldProps> = ({ label, folder, value, onChange, onValidityChange, recordId, required = false }) => {
  const [mode, setMode] = useState<ImageMode>('upload');
  const [urlDraft, setUrlDraft] = useState(value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [message, setMessage] = useState('');
  const [urlError, setUrlError] = useState('');
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [isValid, setIsValid] = useState(Boolean(value) || !required);
  const validityHandler = useRef(onValidityChange);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filePickerActive = useRef(false);

  useEffect(() => {
    setUrlDraft(value);
    setPreviewLoaded(Boolean(value));
    setIsValid(Boolean(value) || !required);
  }, [value]);

  useEffect(() => {
    validityHandler.current = onValidityChange;
  }, [onValidityChange]);

  useEffect(() => {
    validityHandler.current(isValid);
  }, [isValid]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (!filePickerActive.current) return;
      window.setTimeout(() => {
        if (!filePickerActive.current || fileInputRef.current?.files?.length) return;
        filePickerActive.current = false;
        setMessage('Seleção de imagem cancelada.');
      }, 250);
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, []);

  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    filePickerActive.current = false;
    event.target.value = '';
    if (!file) {
      setMessage('Seleção de imagem cancelada.');
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setSelectedFile(null);
      setLocalPreview('');
      setUploadState('error');
      setIsValid(Boolean(value) || !required);
      setMessage(validationError);
      return;
    }

    try {
      const validContents = await validateImageContents(file);
      if (!validContents) throw new Error('Arquivo de imagem inválido.');
      const bitmap = await createImageBitmap(file);
      bitmap.close();
      const preview = URL.createObjectURL(file);
      setSelectedFile(file);
      setLocalPreview(preview);
      setUploadState('selected');
      setIsValid(false);
      setMessage('Imagem selecionada. Confira o preview e envie para concluir.');
    } catch {
      setSelectedFile(null);
      setLocalPreview('');
      setUploadState('error');
      setIsValid(Boolean(value) || !required);
      setMessage('Arquivo de imagem inválido.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Selecione uma imagem.');
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setMessage('Enviando...');
    try {
      const publicUrl = await uploadImage(selectedFile, folder, recordId);
      onChange(publicUrl);
      setUrlDraft(publicUrl);
      setSelectedFile(null);
      setLocalPreview('');
      setUploadState('success');
      setIsValid(true);
      setMessage('Upload concluído.');
    } catch (error) {
      setUploadState('error');
      setIsValid(Boolean(value) || !required);
      setMessage(error instanceof Error ? error.message : 'Não foi possível fazer o upload.');
    }
  };

  const handleUrlChange = (nextValue: string) => {
    setUrlDraft(nextValue);
    setPreviewLoaded(false);
    setUrlError('');
    setMessage('');
    setIsValid(!required && !nextValue);
    if (!nextValue) onChange('');

    if (nextValue && !isHttpUrl(nextValue)) {
      setUrlError('URL da imagem inválida. Use um endereço HTTP ou HTTPS.');
    }
  };

  const handleUrlLoad = () => {
    setPreviewLoaded(true);
    setUrlError('');
    setMessage('URL validada.');
    onChange(urlDraft);
    setIsValid(true);
  };

  const handleUrlError = () => {
    setPreviewLoaded(false);
    setUrlError('Não foi possível carregar esta imagem.');
    setIsValid(false);
  };

  const removeImage = () => {
    onChange('');
    setUrlDraft('');
    setSelectedFile(null);
    setLocalPreview('');
    setPreviewLoaded(false);
    setUploadState('idle');
    setUrlError('');
    setIsValid(!required);
    setMessage('Imagem removida.');
  };

  const isLegacyPath = Boolean(value && urlDraft === value && !isHttpUrl(value));
  const previewSrc = mode === 'url'
    ? (urlDraft === value && isLegacyPath ? value : isHttpUrl(urlDraft) ? urlDraft : '')
    : localPreview || value;
  const canShowPreview = Boolean(previewSrc) && (isLegacyPath || !urlError);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setMode('upload'); setMessage(''); }}
          aria-pressed={mode === 'upload'}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${mode === 'upload' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
        >
          <Upload className="w-3.5 h-3.5" /> Enviar imagem
        </button>
        <button
          type="button"
          onClick={() => { setMode('url'); setMessage(''); }}
          aria-pressed={mode === 'url'}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${mode === 'url' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Usar URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onClick={() => { filePickerActive.current = true; setMessage('Selecionando...'); }}
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700"
          />
          <p className="text-[11px] text-slate-500">JPG, PNG ou WEBP. Tamanho máximo: 5 MB.</p>
          {selectedFile && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploadState === 'uploading'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white disabled:opacity-60"
            >
              {uploadState === 'uploading' ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploadState === 'uploading' ? 'Enviando...' : 'Enviar imagem'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(event) => handleUrlChange(event.target.value)}
            placeholder="https://site.com/imagem.jpg"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
          />
          {urlDraft && isHttpUrl(urlDraft) && !previewLoaded && (
            <p className="text-[11px] text-slate-400">Carregando e validando imagem...</p>
          )}
        </div>
      )}

      {canShowPreview && (
        <div className="flex items-start gap-3">
          <div className="w-28 h-24 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
            <img
              src={previewSrc}
              alt="Pré-visualização da imagem"
              onLoad={mode === 'url' && !isLegacyPath ? handleUrlLoad : undefined}
              onError={mode === 'url' && !isLegacyPath ? handleUrlError : undefined}
              className="h-full w-full object-contain"
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={removeImage}
              className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remover imagem
            </button>
          )}
          {!value && localPreview && <ImagePlus className="w-4 h-4 text-slate-500" />}
        </div>
      )}

      {(message || urlError) && (
        <p role="status" className={`text-[11px] ${uploadState === 'error' || urlError ? 'text-rose-400' : 'text-emerald-400'}`}>
          {urlError || message}
        </p>
      )}
    </div>
  );
};
