'use client';
import classNames from "classnames"
import styles from "@styles/components/LabelStructure.module.css";
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic'
import type { Structure } from '../types';

const P5Wrapper = dynamic(() => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper), { ssr: false })

interface LabelStructureProps {
    structure: Partial<Structure>;
    bordered?: boolean;
}

export default function LabelStructure({ structure, bordered }: LabelStructureProps) {
    const projectCounts = Array.isArray(structure.data) ? structure.data : [0, 0, 0, 0];
    const memberships = Array.isArray(structure.communities) ? structure.communities.length : 0;
    const labelData = {
        projects: projectCounts,
        memberships,
    }

    const [width, setWidth] = useState<number>(400)
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(ref.current ? ref.current.offsetWidth : 30);
        }, 1000);
        return () => clearTimeout(timer);
    }, [ref.current]);

    return (
        <div
            ref={ref}
            style={{ fontSize: `${width / 20}px` }}
            className={classNames(styles.label,
                { [`${styles.bordered}`]: bordered })}>
                <h2 className={styles.name}>{structure.name && structure.name}</h2>
                <div className={styles.adress}>{structure.adress && structure.adress}</div>
                <div className={styles.sketch}>
                    <Sketch structure={structure} labelData={labelData} />
                </div>
            <div className={styles.communities}>
                { structure.communities && ((structure.communities as any[]).map((community: any, i: number) => ( <h3 key={i}>{community.name}</h3>)))}
            </div>

        </div>
    )
}




interface SketchProps {
    structure: Partial<Structure>;
    labelData: { projects: number[]; memberships: number };
}

const Sketch = ({ structure, labelData }: SketchProps) => {
    function sketch(p5: any) {


        const width = 500;
        const height = width;
        const dim = width* 1/2
        const x = width / 2;
        const y = x;
        const ep = width/8;

        let [others, suppliers, designers, workshops] = labelData.projects;
        let total = others + suppliers + designers + workshops;
        total = 15;

        let comMemberships: number = labelData.memberships >= 4 ? 4 : labelData.memberships;


        let [c1, c2, c3, c4] = structure.colors && structure.colors.length >= 4 ? structure.colors : ["#D3494E", "#FFE5AD", "#13BBAF", "#7BC8F6"]
        let empty: any = "#e1e1e1";


        p5.setup = function() {
            p5.createCanvas(width, height);
            p5.strokeCap(p5.ROUND);
            p5.angleMode(p5.DEGREES);
            p5.background(255);

            c1 = p5.color(c1),
            c2 = p5.color(c2),
            c3 = p5.color(c3),
            c4 = p5.color(c4);
            empty = p5.color(empty);

            p5.stroke(empty);
            p5.strokeWeight(ep);
            p5.noFill()
            p5.circle(x, y, dim);
            p5.noStroke()
            communities(comMemberships)
            projects(x, y, dim);
        }
        function communities(n: number) {
            n > 4 ? 4 : n;
            let base = p5.sin(45) * dim / 2;
            let end = p5.sin(45) * (dim / 2 + (width - dim) / 2);
            let directions: number[][] = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
            // p5.shuffle(directions, true)
            p5.push();
            p5.stroke(empty);
            p5.strokeWeight(ep);
            for (let i = 0; i < n; i++) {
                let dir = directions[i]
                p5.line(x + base * dir[0], y + base * dir[1], x + end * dir[0], y + end * dir[1])
            }
            p5.pop()

        }

        function projects(_x: number, _y: number, _d: number) {
            let startValue = 1;
            // let startValue = p5.random(1);
            let range = 0;

            range = others / total;
            drawSlice(c1, startValue, startValue + range);
            startValue += range;
            range = suppliers / total;
            drawSlice(c2, startValue, startValue + range);
            startValue += range;
            range = designers / total;
            drawSlice(c3, startValue, startValue + range);
            startValue += range;
            range = workshops / total;
            drawSlice(c4, startValue, startValue + range);
            startValue += range;

        }

        function drawSlice(color: any, percent1: number, percent2: number) {
            p5.stroke(color);
            p5.strokeWeight(ep);
            p5.ellipseMode(p5.CENTER);
            p5.arc(x, y, dim, dim, -90 + percent1 * 360, -90 + percent2 * 360);
        }

    };
    return (<P5Wrapper sketch={sketch} />)
}
