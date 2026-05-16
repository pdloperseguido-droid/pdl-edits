'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, Paperclip, Loader2, X, FileIcon, ImageIcon,
  Film, FileText, Wifi, WifiOff, AlertCircle
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { StatusDropdown } from './OrderStatusBadge';
import { sendMessage, getMessages } from '@/server/actions/messages';
import { updateOrderStatus } from '@/server/actions/orders';
import type { OrderStatus } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  isRead: boolean;
  createdAt: Date | string;
  fileUrl?: string | null;
  fileType?: 'IMAGE' | 'VIDEO' | 'PDF' | 'OTHER' | null;
  fileName?: string | null;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
}

interface AttachedFile {
  url: string;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF' | 'OTHER';
}

interface ChatInterfaceProps {
  orderId: string;
  currentUserId: string;
  currentUserRole: string;
  initialMessages: Message[];
  orderStatus: OrderStatus;
}

// Atalhos de assunto para cliente
const QUICK_TOPICS = [
  'Quero editar vídeos para Reels',
  'Preciso de edição para YouTube',
  'Quero um orçamento personalizado',
  'Tenho vídeos para anúncio',
];

export function ChatInterface({
  orderId,
  currentUserId,
  currentUserRole,
  initialMessages,
  orderStatus: initialStatus,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [retryCount, setRetryCount] = useState(0);
  const [showQuickTopics, setShowQuickTopics] = useState(initialMessages.length === 0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAdmin = currentUserRole === 'ADMIN';

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        const lastIsOwn = messages[messages.length - 1]?.senderId === currentUserId;
        if (isAtBottom || lastIsOwn) scrollToBottom();
      }
    }
  }, [messages, currentUserId, scrollToBottom]);

  useEffect(() => { scrollToBottom('auto'); }, [scrollToBottom]);

  useEffect(() => {
    const poll = async () => {
      try {
        const newMessages = await getMessages(orderId);
        setMessages(prev => {
          if (
            newMessages.length !== prev.length ||
            (newMessages.length > 0 && newMessages[newMessages.length - 1].id !== prev[prev.length - 1]?.id)
          ) {
            return newMessages as Message[];
          }
          return prev;
        });
        setConnectionStatus('connected');
        setRetryCount(0);
      } catch {
        setConnectionStatus('reconnecting');
        setRetryCount(prev => {
          const next = prev + 1;
          if (next > 5) setConnectionStatus('error');
          return next;
        });
      }
    };
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleSend = async (messageOverride?: string) => {
    const text = (messageOverride ?? content).trim();
    if ((!text && !attachedFile) || isSending || isUploading) return;

    setIsSending(true);
    setError('');
    setShowQuickTopics(false);

    const result = await sendMessage({
      orderId,
      content: text || (attachedFile ? `Arquivo enviado: ${attachedFile.name}` : ''),
      fileUrl: attachedFile?.url,
      fileType: attachedFile?.type,
      fileName: attachedFile?.name,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      setContent('');
      setAttachedFile(null);
      const updated = await getMessages(orderId);
      setMessages(updated as Message[]);
      scrollToBottom();
    }

    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { setError('Arquivo muito grande (máximo 50MB)'); return; }

    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro no upload');
      setAttachedFile({ url: data.url, name: data.name, type: data.type });
    } catch (err: any) {
      setError(err.message || 'Falha ao enviar arquivo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    const result = await updateOrderStatus({ orderId, status: newStatus });
    if (result?.error) setError(result.error);
    else setStatus(newStatus);
    setIsUpdatingStatus(false);
  };

  // Status indicator
  const statusDot = {
    connected: 'bg-emerald-500',
    reconnecting: 'bg-amber-500',
    error: 'bg-rose-500',
  }[connectionStatus];

  return (
    <div className="flex flex-col h-full bg-[#070707] rounded-xl overflow-hidden">

      {/* Header do chat */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0c0c0c] border-b border-white/[0.05] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Indicador de conexão */}
          <div className="relative w-2 h-2">
            <div className={cn('absolute inset-0 rounded-full animate-ping opacity-60', statusDot)} />
            <div className={cn('relative w-full h-full rounded-full', statusDot)} />
          </div>

          <div>
            <p className="text-[13px] font-bold font-display text-white flex items-center gap-2">
              Chat do Pedido
              {isAdmin && (
                <span className="text-[9px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded border border-violet-500/20 font-semibold">
                  ADMIN
                </span>
              )}
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              {connectionStatus === 'connected'
                ? '● Conexão segura · SSL'
                : connectionStatus === 'reconnecting'
                ? '⟳ Reconectando...'
                : '✕ Sem conexão'}
            </p>
          </div>
        </div>

        {isAdmin && (
          <StatusDropdown
            currentStatus={status}
            orderId={orderId}
            onStatusChange={handleStatusChange}
            isLoading={isUpdatingStatus}
          />
        )}
      </div>

      {/* Mensagens */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}
      >
        {/* Estado vazio + quick topics */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-[14px] font-bold font-display text-white mb-1">Bem-vindo ao chat do pedido</h3>
            <p className="text-[12px] text-zinc-500 max-w-[240px] mb-6 leading-relaxed">
              Use este canal para enviar seu material e acompanhar a edição em tempo real.
            </p>

            {!isAdmin && showQuickTopics && (
              <div className="flex flex-col gap-2 w-full max-w-[280px]">
                <p className="text-[10px] text-zinc-600 uppercase font-semibold tracking-wider mb-1">Comece com um assunto</p>
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSend(topic)}
                    disabled={isSending}
                    className="text-left px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[12px] text-zinc-300 hover:bg-violet-500/10 hover:border-violet-500/20 hover:text-violet-300 transition-all disabled:opacity-50"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            senderName={msg.sender?.name || 'Usuário'}
            senderRole={msg.sender?.role || 'CLIENT'}
            senderImage={msg.sender?.image}
            isOwnMessage={msg.senderId === currentUserId}
            isRead={msg.isRead}
            createdAt={msg.createdAt}
            fileUrl={msg.fileUrl}
            fileType={msg.fileType}
            fileName={msg.fileName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de input */}
      <div className="flex-shrink-0 p-4 bg-[#0c0c0c] border-t border-white/[0.05]">

        {/* Preview arquivo anexado */}
        {attachedFile && (
          <div className="mb-3 flex items-center gap-3 p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
              {attachedFile.type === 'IMAGE' ? <ImageIcon className="w-4 h-4 text-violet-400" /> :
               attachedFile.type === 'VIDEO' ? <Film className="w-4 h-4 text-violet-400" /> :
               attachedFile.type === 'PDF' ? <FileText className="w-4 h-4 text-violet-400" /> :
               <FileIcon className="w-4 h-4 text-violet-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white truncate">{attachedFile.name}</p>
              <p className="text-[10px] text-zinc-600">Pronto para enviar</p>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-rose-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="mb-3 flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <p className="text-[12px] text-rose-400 font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.webm,.pdf,.zip"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || isUploading}
            className={cn(
              'w-10 h-10 rounded-xl border flex items-center justify-center transition-all flex-shrink-0',
              isUploading
                ? 'bg-violet-500/15 border-violet-500/20'
                : 'bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.12]'
            )}
            title="Anexar arquivo (máx 50MB)"
          >
            {isUploading
              ? <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
              : <Paperclip className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Textarea */}
          <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-violet-500/40 focus-within:bg-white/[0.06] transition-all">
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isUploading ? 'Enviando arquivo...' : 'Digite sua mensagem... (Enter para enviar)'}
              className="w-full bg-transparent px-4 py-3 text-[13.5px] text-white placeholder:text-zinc-600 resize-none focus:outline-none min-h-[44px] max-h-28"
              rows={1}
              disabled={isSending || isUploading}
            />
          </div>

          {/* Enviar */}
          <button
            onClick={() => handleSend()}
            disabled={(!content.trim() && !attachedFile) || isSending || isUploading}
            className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg shadow-violet-900/30"
          >
            {isSending
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* Dica */}
        <p className="text-[10px] text-zinc-700 mt-2.5 text-center">
          Shift+Enter para nova linha · Suportamos vídeos, imagens, PDF e ZIP até 50MB
        </p>
      </div>
    </div>
  );
}
