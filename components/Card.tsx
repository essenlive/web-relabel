import { ReactNode } from "react";
import Tags from '@components/Tags'
import Link from 'next/link'
import SmartImage from '@components/SmartImage';
import { cn } from "@libs/utils";

interface CardProps {
    title?: string;
    description?: string;
    tags?: string[];
    colorMap?: Map<string, string> | string[];
    link?: { path: string; text: string };
    image?: { src: string; alt: string } | null;
    children?: ReactNode;
    className?: string;
    id?: string;
}

// Title / description share the same spacing: tight by default, roomy at the card edges.
const textBlock = "w-auto px-6 py-[0.1rem] first:pt-6 last:pb-6";

const Card = ({ title, description, tags, colorMap, link, image, children, className }: CardProps) => {
    return (
        <div className={cn("group relative w-full min-h-[300px] border-4 border-primary bg-white shadow-2xl", className)}>
            {children && children}
            {/* With a label as front face, the details only appear on hover */}
            <div className={cn(
                "absolute inset-0 flex flex-col content-center justify-between overflow-auto bg-white transition-all duration-250 ease-in-out",
                // Touch/keyboard: reveal on focus; coarse pointers get the details stacked under the label.
                children && "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:static pointer-coarse:opacity-100 pointer-coarse:border-t-4 pointer-coarse:border-primary"
            )}>
                {image && image.src &&
                    <SmartImage
                        className="max-h-1/2 object-cover border-b-4 border-primary"
                        src={image.src}
                        alt={image.alt || title || ''}
                        width={600}
                        height={400}
                        sizes="(max-width: 768px) 100vw, 350px"
                        style={{ height: 'auto' }}
                    />
                }
                {title &&
                    <h2 className={cn(textBlock, "uppercase text-primary")}>{title}</h2>
                }
                {tags &&
                    <Tags tags={tags} colorMap={colorMap} className="px-6 py-[0.1rem]"/>
                }
                {description &&
                    <p className={textBlock}>{description}</p>
                }
                {link &&
                    <Link href={{pathname: link.path}} className="focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-4">
                        <span className="link block px-6 py-6">{link.text}</span>
                    </Link>
                }
            </div>
        </div>
    );
}

export default Card
