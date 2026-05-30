import { QRCodeSVG } from "qrcode.react";

export function QRLabel({
  value, title, subtitle, size = 96, className = "",
}: { value: string; title?: string; subtitle?: string; size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-md border border-border bg-card p-3 ${className}`}>
      <QRCodeSVG value={value} size={size} bgColor="transparent" fgColor="currentColor" level="M" />
      <div className="text-xs">
        {title && <p className="font-mono font-semibold">{title}</p>}
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">Scan to open order</p>
      </div>
    </div>
  );
}
