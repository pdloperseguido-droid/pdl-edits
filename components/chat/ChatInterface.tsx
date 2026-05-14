'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, Loader2, X, FileIcon, ImageIcon, Film, FileText } from 'lucide-react';
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
  const [isPolling, setIsPolling] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  
  // File upload state
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [retryCount, setRetryCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAdmin = currentUserRole === 'ADMIN';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    const poll = async () => {
      try {
        const newMessages = await getMessages(orderId);
        setMessages(newMessages as Message[]);
        setConnectionStatus('connected');
        setRetryCount(0);
      } catch (err) {
        setConnectionStatus('reconnecting');
        setRetryCount(prev => prev + 1);
        if (retryCount > 5) setConnectionStatus('error');
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [orderId, retryCount]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if ((!trimmed && !attachedFile) || isSending || isUploading) return;

    setIsSending(true);
    setError('');

    const result = await sendMessage({ 
      orderId, 
      content: trimmed || (attachedFile ? `Arquivo enviado: ${attachedFile.name}` : ''),
      fileUrl: attachedFile?.url,
      fileType: attachedFile?.type,
      fileName: attachedFile?.name
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

    // Validação básica no cliente
    if (file.size > 50 * 1024 * 1024) {
      setError('Arquivo muito grande (máximo 50MB)');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no upload');
      }

      setAttachedFile({
        url: data.url,
        name: data.name,
        type: data.type
      });
    } catch (err: any) {
      setError(err.message || 'Falha ao enviar arquivo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    const result = await updateOrderStatus({ orderId, status: newStatus });
    if (result?.error) {
      setError(result.error);
    } else {
      setStatus(newStatus);
    }
    setIsUpdatingStatus(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full relative">
            <div className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-75",
              connectionStatus === 'connected' ? "bg-emerald-500" : 
              connectionStatus === 'reconnecting' ? "bg-amber-500" : "bg-rose-500"
            )} />
            <div className={cn(
              "relative w-full h-full rounded-full shadow-lg",
              connectionStatus === 'connected' ? "bg-emerald-500 shadow-emerald-500/20" : 
              connectionStatus === 'reconnecting' ? "bg-amber-500 shadow-amber-500/20" : "bg-rose-500 shadow-rose-500/20"
            )} />
          </div>
          <div>
            <p className="text-sm font-black text-white font-display tracking-tight flex items-center gap-2">
              Chat de Atendimento
              {isAdmin && <span className="text-[9px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded-md border border-violet-500/20">ADMIN VIEW</span>}
            </p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-1.5">
              {connectionStatus === 'connected' ? (
                <>
                  <span className="text-emerald-500/70">●</span> Conexão Segura E2EE · SSL
                </>
              ) : connectionStatus === 'reconnecting' ? (
                <span className="text-amber-500 animate-pulse italic">Tentando reconectar...</span>
              ) : (
                <span className="text-rose-500 font-bold italic">Offline · Verifique sua internet</span>
              )}
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
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-40">
             <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6">
                <Send className="w-8 h-8 text-violet-400" />
             </div>
             <h3 className="text-white font-bold font-display">Sem conversas ainda</h3>
             <p className="text-zinc-500 text-sm mt-1 max-w-[200px]">Inicie o contato com a PDL Edits por aqui.</p>
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

      {/* Barra de Ações & Input */}
      <div className="p-4 border-t border-white/5 bg-[#0D0D0D]">
        {/* Preview do arquivo anexado */}
        {attachedFile && (
          <div className="mb-3 flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
               {attachedFile.type === 'IMAGE' ? <ImageIcon className="w-5 h-5 text-violet-400" /> : 
                attachedFile.type === 'VIDEO' ? <Film className="w-5 h-5 text-violet-400" /> :
                attachedFile.type === 'PDF' ? <FileText className="w-5 h-5 text-violet-400" /> :
                <FileIcon className="w-5 h-5 text-violet-400" />}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-white truncate font-display">{attachedFile.name}</p>
               <p className="text-[10px] text-zinc-500 uppercase font-medium">Pronto para enviar</p>
            </div>
            <button 
              onClick={() => setAttachedFile(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-rose-400 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-400 font-medium">
             ⚠ {error}
          </div>
        )}

        <div className="flex items-end gap-3">
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
              "w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center transition-all flex-shrink-0 group",
              isUploading ? "bg-violet-500/20" : "bg-white/5 hover:bg-white/10"
            )}
            title="Anexar arquivo"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
            ) : (
              <Paperclip className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            )}
          </button>

          <div className="flex-1 bg-white/5 border border-white/5 rounded-[1.5rem] overflow-hidden focus-within:border-violet-500/40 focus-within:bg-white/[0.08] transition-all">
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isUploading ? "Enviando arquivo..." : "Digite sua mensagem..."}
              className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none max-h-32 min-h-[52px]"
              rows={1}
              disabled={isSending || isUploading}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!content.trim() && !attachedFile) || isSending || isUploading}
            className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-lg shadow-violet-500/20 disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
