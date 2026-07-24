"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Check } from 'lucide-react';
import { toBlob, toPng } from 'html-to-image';
import { ShareableCard } from './ShareableCard';
import { ResultsSnapshot } from '../types';

interface ShareButtonProps {
  snapshot: ResultsSnapshot;
}

export function ShareButton({ snapshot }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);

    try {
      // Ensure fonts are loaded before capturing
      await document.fonts.ready;
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (navigator.share && navigator.canShare && isMobile) {
        // Use Web Share API for mobile devices
        const blob = await toBlob(cardRef.current, { cacheBust: true });
        if (blob) {
          const file = new File([blob], 'type100x-result.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Type100X Result',
              text: `Just reached ${snapshot.wpm} WPM on Type100X! 🚀`,
              files: [file],
            });
            setShared(true);
          }
        }
      } else {
        // Fallback to direct download for desktop
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `type100x-${snapshot.wpm}wpm.png`;
        link.href = dataUrl;
        link.click();
        setShared(true);
      }
    } catch (err) {
      console.error('Error sharing image:', err);
    } finally {
      setIsSharing(false);
      setTimeout(() => setShared(false), 3000);
    }
  };

  return (
    <>
      <Button 
        onClick={handleShare} 
        disabled={isSharing}
        variant="secondary"
        className="gap-2 shadow-premium-sm hover:shadow-premium transition-all"
      >
        {shared ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            Shared!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            {isSharing ? 'Preparing...' : 'Share Result'}
          </>
        )}
      </Button>

      {/* Hidden container for the image export */}
      <div 
        className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0"
        aria-hidden="true"
      >
        <ShareableCard ref={cardRef} snapshot={snapshot} />
      </div>
    </>
  );
}
