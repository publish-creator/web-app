const MODULES = 25;

function isFinderOrigin(x: number, y: number) {
  return (
    (x < 7 && y < 7) || (x >= MODULES - 7 && y < 7) || (x < 7 && y >= MODULES - 7)
  );
}

function finderFilled(x: number, y: number) {
  const fx = x >= MODULES - 7 ? MODULES - 7 : 0;
  const fy = y >= MODULES - 7 ? MODULES - 7 : 0;
  const dx = x - fx;
  const dy = y - fy;

  return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
}

function dataFilled(secret: string, x: number, y: number) {
  let hash = 0;

  for (let index = 0; index < secret.length; index += 1) {
    hash = (hash * 33 + secret.charCodeAt(index) + x * 17 + y * 13) >>> 0;
  }

  return hash % 3 !== 0;
}

export function AuthMfaQrCode({ secret }: { secret: string }) {
  const cells: Array<{ key: string; x: number; y: number }> = [];

  for (let y = 0; y < MODULES; y += 1) {
    for (let x = 0; x < MODULES; x += 1) {
      const filled = isFinderOrigin(x, y) ? finderFilled(x, y) : dataFilled(secret, x, y);

      if (filled) {
        cells.push({ key: `${x}-${y}`, x, y });
      }
    }
  }

  return (
    <svg
      aria-label="QR Code mockado do autenticador"
      className="size-44 shrink-0 rounded-xl bg-white p-2"
      role="img"
      viewBox={`0 0 ${MODULES} ${MODULES}`}
    >
      {cells.map((cell) => (
        <rect fill="#111827" height="1" key={cell.key} width="1" x={cell.x} y={cell.y} />
      ))}
    </svg>
  );
}
