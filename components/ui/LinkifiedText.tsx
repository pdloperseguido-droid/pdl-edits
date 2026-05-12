import React from 'react';
import { cn } from '@/lib/utils';

interface LinkifiedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

export function LinkifiedText({ text, className, linkClassName }: LinkifiedTextProps) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <span className={cn("whitespace-pre-wrap break-words", className)}>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-violet-400 hover:text-violet-300 hover:underline transition-colors break-all",
                linkClassName
              )}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
