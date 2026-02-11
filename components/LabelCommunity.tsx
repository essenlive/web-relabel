'use client';
import classNames from "classnames"
import styles from "@styles/components/LabelCommunity.module.css";
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic'
import type { Community, Structure } from '../types';

const P5Wrapper = dynamic(() => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper), { ssr: false })

interface CommunityData {
    designers: number;
    suppliers: number;
    workshops: number;
    others: number;
}

interface CommunityWithData extends Partial<Community> {
    data?: CommunityData;
    name?: string;
    colors?: string[];
}

interface LabelCommunityProps {
    community: CommunityWithData;
    bordered?: boolean;
}

export default function LabelCommunity({ community,  bordered }: LabelCommunityProps) {
    const structures: any[] = Array.isArray(community.structures) && community.structures.length > 0
        ? community.structures
        : [
            {"typologies": ["stockage"]},
            {"typologies": ["stockage"]},
            {"typologies": ["designer"]},
            {"typologies": ["designer"]},
            {"typologies": ["designer"]},
            {"typologies": ["atelier"]},
            {"typologies": ["atelier"]},
            {"typologies": ["atelier"]},
            {"typologies": ["atelier"]},
            {"typologies": ["autres"]},
            {"typologies": ["autres"]},
        ];

    const labelData: CommunityData = { designers: 0, suppliers: 0, workshops: 0, others: 0 };
    structures.forEach((structure: any) => {
        if (structure.typologies?.indexOf('autre') >= 0) labelData.others++;
        if (structure.typologies?.indexOf('designer') >= 0) labelData.designers++;
        if (structure.typologies?.indexOf('atelier') >= 0) labelData.workshops++;
        if (structure.typologies?.indexOf('stockage') >= 0) labelData.suppliers++;
    });

    const [width, setWidth] = useState<number>(400)
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => { setWidth(ref.current ? ref.current.offsetWidth : 30); }, [ref.current]);

    return (
        <div
            ref={ref}
            style={{ fontSize: `${width / 20}px` }}
            className={classNames(styles.label,
                { [`${styles.bordered}`]: bordered })}>

            <div className={styles.sketch}>
                <Sketch community={community} labelData={labelData} structures={structures} />
            </div>
            <h2 className={styles.name}> {community.name && community.name}</h2>
            <h4 className={styles.date}> {community.year && community.year}</h4>

        </div>
    )
}


interface SketchProps {
    community: CommunityWithData;
    labelData: CommunityData;
    structures: any[];
}

const Sketch = ({ community, labelData, structures }: SketchProps) => {

    function sketch(p5: any) {

        // Constantes graphiques
        const width =700;
        const height = width;
        const dim = 100;
        const nbCases = width / dim;
        const ep = 20;

        let [c1, c2, c3, c4 ] = community.colors && community.colors.length >= 4 ? community.colors : ["#D3494E", "#FFE5AD", "#13BBAF", "#7BC8F6"]
        let empty: any = "#e1e1e1";
        let noeuds: boolean[][] = [];
        let colorStack: any[] = [];


        p5.setup = function () {
            p5.createCanvas(width, height);
            p5.strokeCap(p5.ROUND);
            c1 = p5.color(c1);
            c2 = p5.color(c2);
            c3 = p5.color(c3);
            c4 = p5.color(c4);
            empty = p5.color(empty);


            initAvailableColors()
            initNodes(nbCases)
            initPartnerNodes(structures.length >= 25 ? 25 : structures.length);
        }

        // Fill colorStack colorstack
        function initAvailableColors() {
            const designers = Array(labelData.designers).fill(c1)
            const workshops = Array(labelData.workshops).fill(c2)
            const suppliers = Array(labelData.suppliers).fill(c3)
            const others = Array(labelData.others).fill(c4)
            colorStack = [...designers, ...workshops, ...suppliers, ...others];
        }
        // Initialize false node grid
        function initNodes(nbCases: number) {
            for (let i = 0; i < nbCases; i++)  noeuds[i] = Array(nbCases).fill(false);
        }
        // Create partner nodes in node grid
        function initPartnerNodes(partnerNodes: number) {
            var compteur = 0;
            while (compteur < partnerNodes) {
                let togglei = p5.floor(p5.random(1, nbCases - 1));
                let togglej = p5.floor(p5.random(1, nbCases - 1));
                if (noeuds[togglei][togglej] == false) {
                    noeuds[togglei][togglej] = true;
                    compteur++;
                }
            }

        }

        // Pick a color from the color stack
        function pickColorFromStack(): any {
            let toggleColor = p5.floor(p5.random(colorStack.length));
            let color = colorStack[toggleColor];
            colorStack.splice(toggleColor, 1);
            return color;
        }

        p5.draw = function () {
            p5.push();
            p5.translate(width / 2, height / 2);
            p5.rotate(p5.PI / 4);

            // Draw center grid
            for (let i = 1; i < nbCases - 1; i++) {
                for (let j = 1; j < nbCases - 1; j++) {

                    // Pick a random color from colorStack
                    // If it is a partner use a circle else use a random pattern
                    if (noeuds[i][j] == true) {
                        picto5(dim * i - width / 2, dim * j - height / 2, dim, pickColorFromStack(), ep);
                    } else if (p5.random(5) > 1) {
                        var toggle = p5.floor(p5.random(3));
                        switch (toggle) {
                            case 0:
                                picto1(dim * i - width / 2, dim * j - height / 2, dim, empty, ep);
                                break;
                            case 1:
                                picto2(dim * i - width / 2, dim * j - height / 2, dim, empty, ep);
                                break;
                            case 2:
                                picto4(dim * i - width / 2, dim * j - height / 2, dim, empty, ep);
                                break;

                            default:
                        }
                    }
                }
            }
            // Draw grid edges
            for (var k = 1; k < nbCases - 2; k++) {
                if(p5.random(3)>1) picto6((nbCases - 1) * dim - width / 2, dim * (k + 0.5) - height / 2, dim, empty, ep);
                if (p5.random(3)>1)picto7(-width / 2, dim * (k + 0.5) - height / 2, dim, empty, ep);
            }
            for (var l = 1; l < nbCases - 2; l++) {
                if (p5.random(3)>1)picto8(dim * l - width / 2, -height / 2, dim, empty, ep);
                if (p5.random(3)>1)picto9(dim * l - width / 2, (nbCases - 1) * dim - height / 2, dim, empty, ep);
            }
            p5.pop();
            p5.noLoop();
        }


        function picto1(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) {
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.arc(posX, posY, dim, dim, 0, p5.PI / 2);
            p5.arc(posX + dim, posY + dim, dim, dim, -p5.PI, -p5.PI / 2);
        }
        function picto2(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) {
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.arc(posX, posY + dim, dim, dim, -p5.PI / 2, 0);
            p5.arc(posX + dim, posY, dim, dim, p5.PI / 2, p5.PI);
        }
        function picto3(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) { // point central
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.ellipse(posX + dim / 2, posY + dim / 2, dim / 2, dim / 2);
        }
        function picto4(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) {
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.line(posX + dim / 2, posY, posX + dim / 2, posY + dim);
            p5.line(posX, posY + dim / 2, posX + dim, posY + dim / 2);
        }
        function picto5(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) {
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.line(posX + dim / 2, posY, posX + dim / 2, posY + dim);
            p5.line(posX, posY + dim / 2, posX + dim, posY + dim / 2);
            p5.fill(255);
            p5.ellipse(posX + dim / 2, posY + dim / 2, dim / 2, dim / 2);
        }
        function picto6(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) { // courbe de bord
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.arc(posX, posY + dim / 2, dim, dim, -p5.PI / 2, p5.PI / 2);
        }
        function picto7(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) { // courbe de bord
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.arc(posX + dim, posY + dim / 2, dim, dim, p5.PI / 2, 3 * p5.PI / 2);
        }
        function picto8(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) { // courbe de bord
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.arc(posX + dim, posY + dim, dim, dim, p5.PI, 2 * p5.PI);
        }
        function picto9(posX: number, posY: number, dim: number, couleur: any = c4, ep: number) { // courbe de bord
            p5.strokeWeight(ep);
            p5.stroke(couleur);
            p5.noFill();
            p5.arc(posX + dim, posY, dim, dim, 0, p5.PI);
        }


    };
    return (<P5Wrapper sketch={sketch} />)
}
