'use client';
import Layout from '@components/Layout'
import LabelProject from '@components/LabelProject';
import styles from "@styles/pages/SinglePage.module.css";
import Carousel from "@components/Carousel";
import Link from 'next/link'
import ReactMap from '@components/ReactMap'
import { prepareData } from '@libs/mapUtils'
import { BiCopy } from "react-icons/bi";
import { mean } from 'mathjs';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton, EmailIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { useRef, useState, useEffect, useCallback } from "react";
import ReactToPrint from "react-to-print";
import classNames from 'classnames';
import { projectForm } from '@libs/formsData';
import Certificate from "@components/Certificate";
import Tags from '@components/Tags';
import type { Project, Structure, FormInput } from '../../../../types';

interface ProjectAttributesProps {
    name: string;
    options: string[];
    selection: string | string[];
    baseColor: string;
    accentColor: string;
}

const ProjectAttributes = ({ name, options, selection, baseColor, accentColor }: ProjectAttributesProps): React.JSX.Element => {
    const selectionArray: string[] = [selection].flat();
    let indexes: number[] = [];
    selectionArray.forEach((sel: string) => {
        indexes.push(options.indexOf(sel))
    })
    let colorMap: string[] = new Array(options.length).fill(baseColor);
    indexes.forEach((index: number) => { if (index < options.length && index >= 0) { colorMap[index] = accentColor } })
    return(
        <div>
            <p><b>{name}</b></p>
            <Tags tags={options} colorMap={colorMap} dark/>
        </div>
    )
}

interface ProjectDetailProps {
    project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps): React.JSX.Element {
    let [copied, setCopied] = useState<boolean>(false)
    function addToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => { setCopied(false) }, 1000)
    }
    const componentRef = useRef<HTMLDivElement | null>(null);
    const onBeforeGetContentResolve = useRef<((value?: any) => void) | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const handleAfterPrint = useCallback(() => { setVisible(false); }, []);
    const handleBeforePrint = useCallback(() => { setVisible(true); }, []);
    const handleOnBeforeGetContent = useCallback(() => {
        setVisible(true);
        return new Promise<void>((resolve) => {
            onBeforeGetContentResolve.current = resolve;
            setTimeout(() => {
                setVisible(false);
                resolve();
            }, 500);
        });
    }, [setVisible]);

    useEffect(() => {
        if (typeof onBeforeGetContentResolve.current === "function") { onBeforeGetContentResolve.current(); }
    }, [onBeforeGetContentResolve.current]);

    const reactToPrintContent = useCallback(() => { return componentRef.current; }, [componentRef.current]);
    const reactToPrintTrigger = useCallback(() => {
        return (<button className={classNames(styles.print,"button")}> Imprimer le certificat </button>);
    }, []);

    return (
        <Layout padded>
            <div className={styles.projectBanner}>
                <div className={styles.carousel}>
                    {project.illustrations && (<Carousel images={project.illustrations} />)}
                </div>
                <div className={styles.title}>
                    {project.name && (<h1> {project.name}</h1>)}
                    {project.typology && (<h2>{project.typology}</h2>)}
                </div>
                <div className={styles.description}>
                    {project.description && (<p> {project.description} </p>)}
                    {project.website && (<p className={"link"}> <Link href={project.website}> Voir le site</Link></p>)}
                </div>
                <div className={styles.detail}>
                    <div className={styles.materials}>
                        <h3>Materiaux</h3>
                        <div>
                            <b>Fournisseurs</b>
                            {(project.structures as Structure[]).filter((el: Structure) => el.typologies.indexOf("stockage") >= 0).map((el: Structure) => (<span className='link' key={el.id}><Link href={`/structures/${el.id}`}>{el.name}</Link></span>))}
                        </div>
                        {projectForm.inputs.filter((el: FormInput) => el.group === "material").map((input: FormInput, i: number) => (
                            <ProjectAttributes key={i} name={input.prefix} options={(input.options ?? []).map((el) => el.value)} selection={(project as any)[input.name]} baseColor={"--gray-100"} accentColor={project.colors[0]} />
                        ))}
                    </div>
                    <div className={styles.design}>
                        <h3>Conception</h3>
                        <div>
                            <b>Designers</b>
                            {(project.structures as Structure[]).filter((el: Structure) => el.typologies.indexOf("designer") >= 0).map((el: Structure) => (<span className='link' key={el.id}><Link href={`/structures/${el.id}`}>{el.name}</Link></span>))}
                        </div>
                        {projectForm.inputs.filter((el: FormInput) => el.group === "design").map((input: FormInput, i: number) => (
                            <ProjectAttributes key={i} name={input.prefix} options={(input.options ?? []).map((el) => el.value)} selection={(project as any)[input.name]} baseColor={"--gray-100"} accentColor={project.colors[1]} />
                        ))}
                    </div>
                    <div className={styles.fab}>
                        <h3>Fabrication</h3>
                        <div>
                            <b>Ateliers</b>
                            {(project.structures as Structure[]).filter((el: Structure) => el.typologies.indexOf("atelier") >= 0).map((el: Structure) => (<span className='link' key={el.id}><Link href={`/structures/${el.id}`}>{el.name}</Link></span>))}
                        </div>
                        {projectForm.inputs.filter((el: FormInput) => el.group === "fab").map((input: FormInput, i: number) => (
                            <ProjectAttributes key={i} name={input.prefix} options={(input.options ?? []).map((el) => el.value)} selection={(project as any)[input.name]} baseColor={"--gray-100"} accentColor={project.colors[2]} />
                        ))}
                    </div>
                    <div className={styles.partners}>
                        <h3>Soutien</h3>
                        <div>
                            <b>Partenaires</b>
                            {(project.structures as Structure[]).filter((el: Structure) => el.typologies.indexOf("autre") >= 0).map((el: Structure) => (<span className='link' key={el.id}><Link href={`/structures/${el.id}`}>{el.name}</Link></span>))}
                        </div>
                    </div>
                </div>
                <div className={styles.map}>
                    {(project.structures as Structure[]).length > 0 && (
                    <ReactMap
                        structures={prepareData(project.structures as Structure[])}
                        colorMap={project.colors}
                        initialViewport={{
                            latitude: mean((project.structures as Structure[]).map((el: Structure) => el.latitude)),
                            longitude: mean((project.structures as Structure[]).map((el: Structure) => el.longitude)),
                            zoom: 12
                        }} />
                    )}
                </div>
                <div className={styles.label}> <LabelProject project={project}/></div>
                <div className={styles.explainer}>
                    <p><span className={styles.node}></span>Les noeuds représentent le nombre de partenaires.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: project.colors[0] }}></span>Matériaux sourcés et responsables.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: project.colors[1] }}></span>Conception ouverte et perenne.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: project.colors[2] }}></span>Fabrication locale et sociale.</p>
                </div>
                <div className={styles.share}>
                    <h2>Share</h2>
                    <div className={styles.sharing}>
                        <EmailShareButton url={`https://re-label.eu/projects/${project.id}`} subject={'Re-Label'} body={'Je viens de faire le Re-label de mon projet : '}>
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                        <FacebookShareButton url={`https://re-label.eu/projects/${project.id}`} hashtag={'relabel'}>
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <LinkedinShareButton url={`https://re-label.eu/projects/${project.id}`} title={'Re-Label'} summary={`Je viens de faire Re-labeliser mon projet ${project.name}`} source={'https://re-label.eu'}>
                            <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                        <TwitterShareButton url={`https://re-label.eu/projects/${project.id}`} title={'Mon Re-Label'} hashtags={['relabel']}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                    </div>
                    <div className={styles.embed}>
                        <span onClick={() => { addToClipboard(`<iframe src="https://re-label.eu/projects/label/${project.id}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`) }}>
                            <BiCopy /> {copied ? "Ajouté au clipboard !" : "Integrer à votre site"}
                        </span>
                        <textarea readOnly value={`<iframe src="https://re-label.eu/projects/label/${project.id}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`} />
                    </div>
                    <ReactToPrint
                        content={reactToPrintContent}
                        documentTitle={`re-label | ${project.name}`}
                        onAfterPrint={handleAfterPrint}
                        onBeforeGetContent={handleOnBeforeGetContent}
                        onBeforePrint={handleBeforePrint}
                        removeAfterPrint
                        trigger={reactToPrintTrigger}
                    />
                </div>
            </div>

            <div className={classNames({ [`${styles.visible}`]: visible }, styles.certif)}>
                <Certificate ref={componentRef} project={project}/>
            </div>
        </Layout>
    );
}
