import { ReactNode } from "react";
import classNames from "classnames"
import styles from "@styles/components/Modal.module.css";

interface ModalProps {
    title?: string;
    description?: string;
    tags?: string[];
    colorMap?: Map<string, string>;
    link?: { path: string; text: string };
    image?: { src: string; alt: string } | null;
    children?: ReactNode;
    className?: string;
}

export default function Modal ({ title, description, tags, colorMap, link, image, children, className }: ModalProps) {
    return (
        <>
        <div className={classNames(className, styles.modal)}>
            {children && children}
        </div>
        <div className={styles.overlay}>

        </div>
        </>
    );
}