import { cn } from "@libs/utils";

interface TagsProps {
    tags: string[];
    colorMap?: Map<string, string> | string[];
    className?: string;
    dark?: boolean;
}

const DEFAULT_COLORS = ["#facc15", "#38bdf8", "#4ade80", "#fb7185", "#f472b6", "#22d3ee"];

const Tags = ({tags, colorMap, className, dark}: TagsProps) => {

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
        <div className={cn("block [&>*:not(:last-child)]:mr-1", className)}>
            {tags.map((tag: string, i: number)=>(
                <span
                    className={cn("inline-block mb-1 px-2 py-1 rounded-sm bg-zinc-100 text-xs leading-normal font-normal", dark ? "text-black" : "text-white")}
                    style={{ backgroundColor: resolvedColorMap.get(tag) }}
                    key={i}>{tag}</span>
            ))}
        </div>
    );
}

export default Tags
