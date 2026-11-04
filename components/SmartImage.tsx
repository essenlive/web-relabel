import Image, { type ImageProps } from 'next/image';

// Optimise local assets and Supabase-hosted images with next/image.
// Any other host (legacy URLs) falls back to a plain lazy <img> instead of throwing.
const canOptimize = (src: string) =>
  src.startsWith('/') || /^https:\/\/[^/]+\.supabase\.co\//.test(src);

type SmartImageProps = Omit<ImageProps, 'src' | 'alt' | 'fill'> & { src: string; alt: string };

export default function SmartImage({ src, alt, width, height, className, style, priority, sizes }: SmartImageProps) {
  if (!canOptimize(src)) {
    return <img src={src} alt={alt} width={width as number} height={height as number} className={className} style={style} loading="lazy" decoding="async" />;
  }
  return <Image src={src} alt={alt} width={width} height={height} className={className} style={style} priority={priority} sizes={sizes} />;
}
