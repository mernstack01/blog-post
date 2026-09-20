'use client';

import { useState } from 'react';
import { Wrench } from 'lucide-react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80';

export default function SafeImage({
  src,
  alt = '',
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  ...rest
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    typeof src === 'string' && src.trim() ? src : fallbackSrc
  );


  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    }
  };

  if (!imgSrc || (hasError && imgSrc === fallbackSrc)) {
    return (
      <div
        className={`bg-gradient-to-tr from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 ${className}`}
        aria-label={alt}
      >
        <Wrench className="w-8 h-8 opacity-40 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
}
