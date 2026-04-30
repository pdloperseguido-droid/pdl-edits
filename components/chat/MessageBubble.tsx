import { cn, formatRelativeTime } from '@/lib/utils';
import { Check, CheckCheck, FileText, Download, PlayCircle } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  senderName: string;
  senderRole: string;
  senderImage?: string | null;
  isOwnMessage: boolean;
  isRead: boolean;
  createdAt: Date | string;
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
}

/** Balão de mensagem Premium com suporte a arquivos */
export function MessageBubble({
  content,
  senderName,
  senderRole,
  senderImage,
  isOwnMessage,
  isRead,
  createdAt,
  fileUrl,
  fileType,
  fileName,
}: MessageBubbleProps) {
  const isAdmin = senderRole === 'ADMIN';

  return (
    <div
      className={cn(
        'flex gap-2.5 max-w-[90%] md:max-w-[75%]',
        isOwnMessage ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
      )}
    >
      {/* Avatar minimalista */}
      <div className="flex-shrink-0 mt-auto mb-1">
        {senderImage ? (
          <img
            src={senderImage}
            alt={senderName}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10 shadow-lg"
          />
        ) : (
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black',
            isAdmin ? 'btn-gradient text-white' : 'bg-zinc-800 text-zinc-500 border border-white/5'
          )}>
            {senderName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Conteúdo do balão */}
      <div className={cn('flex flex-col gap-1', isOwnMessage ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl p-1',
            isOwnMessage 
              ? 'bg-violet-600 shadow-[0_4px_15px_rgba(124,58,237,0.3)]' 
              : 'bg-zinc-900 border border-white/5 shadow-xl'
          )}
        >
          {/* Fundo decorativo sutil para mensagens próprias */}
          {isOwnMessage && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          )}

          <div className="px-3 py-2 relative z-10">
             {/* Preview de arquivo */}
            {fileUrl && (
              <div className="mb-2">
                {fileType === 'IMAGE' ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                    <img
                      src={fileUrl}
                      alt={fileName ?? 'Imagem'}
                      className="max-w-[240px] md:max-w-xs rounded-xl border border-white/10 cursor-pointer transition-all group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                       <Download className="w-6 h-6 text-white" />
                    </div>
                  </a>
                ) : fileType === 'VIDEO' ? (
                  <div className="relative max-w-[240px] md:max-w-xs group">
                    <video
                      src={fileUrl}
                      className="w-full rounded-xl border border-white/10"
                    />
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl group-hover:bg-black/20 transition-all"
                    >
                       <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
                    </a>
                  </div>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={fileName}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 min-w-[180px]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                       <FileText className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate font-display">{fileName ?? 'Arquivo'}</p>
                      <p className="text-[9px] text-zinc-500 uppercase font-medium">Download</p>
                    </div>
                  </a>
                )}
              </div>
            )}

            {/* Texto da mensagem */}
            {content && (
              <p className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap break-words font-medium",
                isOwnMessage ? "text-white" : "text-zinc-200"
              )}>
                {content}
              </p>
            )}
          </div>
        </div>

        {/* Info de rodapé (compacta) */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
            {formatRelativeTime(createdAt)}
          </span>
          {isOwnMessage && (
            <div className="flex items-center">
              {isRead ? (
                <CheckCheck className="w-3 h-3 text-violet-500" />
              ) : (
                <Check className="w-3 h-3 text-zinc-700" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
