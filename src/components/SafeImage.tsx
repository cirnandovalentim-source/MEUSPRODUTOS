import { useState, useEffect, ImgHTMLAttributes, MouseEvent } from 'react';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../lib/utils';
import { X, ZoomIn } from 'lucide-react';

export interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | string[] | null;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  expandable?: boolean;
}

export function SafeImage({
  src,
  fallbackSrc = DEFAULT_PRODUCT_IMAGE,
  alt = '',
  className = '',
  expandable = true,
  onClick,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => getImageUrl(src, fallbackSrc));
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentSrc(getImageUrl(src, fallbackSrc));
    setHasError(false);
  }, [src, fallbackSrc]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (expandable && !e.defaultPrevented) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className={`relative group/img ${expandable ? 'cursor-zoom-in' : ''} w-full h-full`}>
        <img
          {...props}
          src={currentSrc}
          alt={alt}
          className={`${className} transition-opacity duration-200`}
          onError={handleError}
          onClick={handleImageClick}
        />
        {expandable && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Expandir imagem"
            className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 md:-right-10 text-white hover:text-gray-300 p-2 bg-white/10 rounded-full backdrop-blur-sm transition-colors focus:outline-none"
              title="Fechar (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentSrc}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white/5 border border-white/10"
              onError={handleError}
            />
            {alt && (
              <p className="mt-3 text-white/90 text-sm md:text-base font-medium text-center px-4 bg-black/40 py-1.5 rounded-full backdrop-blur-sm">
                {alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

