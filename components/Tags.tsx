import classNames from "classnames"
import styles from "@styles/components/Tags.module.css";

interface TagsProps {
    tags: string[];
    colorMap?: Map<string, string> | string[];
    className?: string;
    dark?: boolean;
}

const Tags = ({tags, colorMap, className, dark}: TagsProps) => {

    let resolvedColorMap: Map<string, string>;

    if (!(colorMap instanceof Map)) {
        let colors = colorMap ? colorMap : ["var(--yellow-400)", "var(--lightBlue-400)", "var(--green-400)", "var(--rose-400)", "var(--pink-400)", "var(--cyan-400)"];
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
        <div className={classNames(className, styles.tags)}>
            {tags.map((tag: string, i: number)=>(
                <span className={styles.tag} style={{ backgroundColor: resolvedColorMap.get(tag), color: dark ? "var(--black)" : "var(--white)"}} key={i}>{tag}</span>
            ))}
        </div>
    );
}

export default Tags