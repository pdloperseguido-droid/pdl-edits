'use client';

import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isDirectVideo, setIsDirectVideo] = useState(false);

  useEffect(() => {
    // Detect YouTube
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if (ytMatch) {
      setEmbedUrl(`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`);
      return;
    }

    // Detect Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
    if (vimeoMatch) {
      setEmbedUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`);
      return;
    }

    // Default to direct video if it looks like one
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      setIsDirectVideo(true);
    } else {
      // If we don't know what it is, try to use it as a direct source anyway
      setIsDirectVideo(true);
    }
  }, [url]);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isDirectVideo) {
    return (
      <video
        src={url}
        controls
        autoPlay
        className="w-full h-full object-contain bg-black"
      >
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
      Link de vídeo inválido ou não suportado.
    </div>
  );
}
