'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export function ChatScrollAnchor({
  trackVisibility,
}: { trackVisibility?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView && trackVisibility) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isInView, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}
