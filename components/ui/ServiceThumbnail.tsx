'use client';

const FALLBACK = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop';

interface ServiceThumbnailProps {
  src: string | null | undefined;
  alt: string;
  icon: string;
}

export function ServiceThumbnail({ src, alt, icon }: ServiceThumbnailProps) {
  return (
    <div className="relative h-48 overflow-hidden">
      <img
        src={src || FALLBACK}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <span className="absolute bottom-3 left-4 text-3xl" aria-hidden="true">{icon}</span>
    </div>
  );
}
