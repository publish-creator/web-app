'use client';

import QRCode from 'qrcode';

import { useEffect, useState } from 'react';

export function AuthMfaQrCode({ otpauthUrl }: { otpauthUrl: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(otpauthUrl, { errorCorrectionLevel: 'M', margin: 1, width: 352 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [otpauthUrl]);

  if (!dataUrl) {
    return (
      <div
        aria-label="Gerando QR Code"
        className="size-44 shrink-0 animate-pulse rounded-xl bg-white/10"
        role="img"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- a data: URL generated in the browser; next/image would round-trip it through the optimizer
    <img
      alt="QR Code para o aplicativo autenticador"
      className="size-44 shrink-0 rounded-xl bg-white p-2"
      height={176}
      src={dataUrl}
      width={176}
    />
  );
}
