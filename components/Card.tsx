import { ReactNode } from "react";
import classNames from "classnames"
import Tags from '@components/Tags'
import Link from 'next/link'
import styles from "@styles/components/Card.module.css";

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

const Card = ({ title, description, tags, colorMap, link, image, children, className, id }: CardProps) => {
    return (
        <div key={id} className={classNames(className, styles.card)}>
            {children && children}
            <div className={styles.verso}>
                {image && image.src &&
                    <img
                        className={styles.image}
                        src={image.src}
                        alt={title}
                    />
                }
                {title &&
                    <h2 className={styles.title}>{title}</h2>
                }
                {tags &&
                    <Tags tags={tags} colorMap={colorMap} className={styles.tags}/>
                }
                {description &&
                    <p className={styles.description}>{description}</p>
                }
                {link &&
                    <Link href={{pathname: link.path}}>
                        <p className={classNames("link", styles.link)}>{link.text}</p>
                    </Link>
                }
            </div>
        </div>
    );
}

export default Card