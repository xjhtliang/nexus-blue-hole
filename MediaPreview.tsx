import React, { useEffect } from 'react';
import { X, FileText, Play, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { createPortal } from 'react-dom';

export type MediaType = 'IMAGE' | 'VIDEO' | 'PDF' | 'FILE' | 'UNKNOWN';

export interface MediaItem {
  url: string;
  type: MediaType;
  title?: string;
  thumbnailUrl?: string;
}

interface MediaPreviewProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ item, isOpen, onClose }) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors z-[110]"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div 
        className="relative w-full max-w-5xl h-full max-h-[90vh] p-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg shadow-2xl bg-black/90">
          
          {/* Media Content */}
          {item.type === 'IMAGE' && (
            <img 
              src={item.url} 
              alt={item.title || 'Preview'} 
              className="max-w-full max-h-full object-contain"
            />
          )}

          {item.type === 'VIDEO' && (
            <video 
              src={item.url} 
              controls 
              autoPlay 
              className="max-w-full max-h-full"
            />
          )}

          {(item.type === 'PDF' || item.type === 'FILE' || item.type === 'UNKNOWN') && (
            <div className="text-center text-white p-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                <FileText className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium mb-2">{item.title || 'File Preview'}</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto truncate">{item.url}</p>
              
              <div className="flex gap-3 justify-center">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
                <a 
                  href={item.url} 
                  download
                  className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Caption */}
        {item.title && (
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <span className="inline-block px-4 py-2 bg-black/50 text-white rounded-full text-sm backdrop-blur-md">
              {item.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

// --- Helper for Default Thumbnails ---

export const DefaultThumbnail: React.FC<{ type: MediaType; className?: string }> = ({ type, className }) => {
    const iconClass = "w-8 h-8 text-muted-foreground";
    
    return (
        <div className={cn("w-full h-full bg-secondary/30 flex items-center justify-center", className)}>
            {type === 'IMAGE' && <ImageIcon className={iconClass} />}
            {type === 'VIDEO' && <Play className={iconClass} />}
            {type === 'PDF' && <FileText className={iconClass} />}
            {(type === 'FILE' || type === 'UNKNOWN') && <FileText className={iconClass} />}
        </div>
    );
};