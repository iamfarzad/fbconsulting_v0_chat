'use client';

import type { Attachment } from 'ai';
import { IconLoader } from './icons';
import { memo } from 'react';
import equal from 'fast-deep-equal';

function PurePreviewAttachment({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}): JSX.Element {
  const { name, url, contentType } = attachment;

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <div className="w-20 h-16 aspect-video glassmorphism-base rounded-xl relative flex flex-col items-center justify-center transition-transform hover:scale-105 duration-200 border border-white/10 overflow-hidden">
        {contentType ? (
          contentType.startsWith('image') ? (
            <div role="img" aria-label={name ?? 'Image attachment preview'}>
              {/* NOTE: it is recommended to use next/image for images */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={url}
                src={url}
                alt={name ?? 'An image attachment'}
                className="rounded-xl size-full object-cover hover:opacity-90 transition-opacity duration-200"
              />
            </div>
          ) : (
            <div className="" role="presentation" />
          )
        ) : (
          <div className="" role="presentation" />
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <div className="animate-spin text-white/80">
              <IconLoader className="size-6" />
            </div>
          </div>
        )}
      </div>
      <div className="text-xs text-white/70 max-w-16 truncate font-medium">
        {name}
      </div>
    </div>
  );
}

// Memoize component with deep comparison of attachments
type PreviewAttachmentProps = {
  attachment: Attachment;
  isUploading?: boolean;
};

export const PreviewAttachment = memo(
  PurePreviewAttachment,
  (
    prevProps: PreviewAttachmentProps,
    nextProps: PreviewAttachmentProps,
  ): boolean => {
    if (prevProps.isUploading !== nextProps.isUploading) return false;
    return equal(prevProps.attachment, nextProps.attachment);
  },
);
