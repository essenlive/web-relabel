import { cn } from "@libs/utils";

interface TagsProps {
    tags: string[];
    colorMap?: Map<string, string> | string[];
    className?: string;
}

const DEFAULT_COLORS = ["#facc15", "#38bdf8", "#4ade80", "#fb7185", "#f472b6", "#22d3ee"];

const Tags = ({tags, colorMap, className}: TagsProps) => {

    let resolvedColorMap: Map<string, string>;

    if (!(colorMap instanceof Map)) {
        const colors = colorMap ? colorMap : DEFAULT_COLORS;
        let i = 0;
        resolvedColorMap = new Map<string, string>();
        tags.forEach((tag: string) => {
            if (!resolvedColorMap.has(tag)) {
                resolvedColorMap.set(tag, colors[i % colors.length])
                i++
            }
        })
    } else {
        resolvedColorMap = colorMap;
    }

    return (
        <div className={cn("flex flex-wrap gap-1", className)}>
            {tags.map((tag: string, i: number)=>(
                <span
                    className="inline-flex items-center gap-1 px-1.5 py-px border border-primary bg-white text-primary text-[11px] font-semibold leading-tight whitespace-nowrap"
                    key={i}>
                    <span aria-hidden className="size-2 border border-primary" style={{ backgroundColor: resolvedColorMap.get(tag) }} />
                    {tag}
                </span>
            ))}
        </div>
    );
}

export default Tags
