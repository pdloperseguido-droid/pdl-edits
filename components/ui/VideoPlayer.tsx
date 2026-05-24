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
    // Detect YouTube (suporta Shorts, watch?v=, youtu.be e parâmetros adicionais)
    const extractYTId = (videoUrl: string) => {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
      const match = videoUrl.match(regex);
      return match ? match[1] : null;
    };

    const ytId = extractYTId(url);
    if (ytId) {
      setEmbedUrl(`https://www.youtube.com/embed/${ytId}?autoplay=1`);
      return;
    }

    // Detect Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
    if (vimeoMatch) {
      // Pega apenas o ID (números) caso haja query params na URL do Vimeo
      const vimeoId = vimeoMatch[1].split(/[?#]/)[0];
      setEmbedUrl(`https://player.vimeo.com/video/${vimeoId}?autoplay=1`);
      return;
    }

    // Default to direct video se parecer com um
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      setIsDirectVideo(true);
    } else {
      // Tenta usar como direct source para outros links
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
