import { useEffect } from "react";

interface AdUnitProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

export default function AdUnit({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
}: AdUnitProps) {
  useEffect(() => {
    try {
      const win = window as Window & { adsbygoogle?: unknown[] };
      (win.adsbygoogle = win.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4213093304763697"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
