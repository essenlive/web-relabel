'use client';
import Layout from '@components/Layout'
import classNames from 'classnames';
import styles from "@styles/pages/SinglePage.module.css";
import Carousel from "@components/Carousel";
import Link from 'next/link'
import LabelStructure from '@components/LabelStructure';
import { BiCopy } from "react-icons/bi";
import {EmailShareButton,FacebookShareButton,LinkedinShareButton,TwitterShareButton,EmailIcon,FacebookIcon,LinkedinIcon,TwitterIcon} from "react-share";
import { useState } from 'react';
import type { Structure } from '../../../../types';

interface StructureDetailProps {
  structure: Structure;
}

export default function StructureDetail({ structure }: StructureDetailProps) {

    let [copied, setCopied] = useState<boolean>(false)
    function addToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(()=>{setCopied(false)}, 1000)
    }

    return (
    <Layout padded>

            <div className={classNames(styles.structureBanner)}>

                <div className={styles.carousel}>
                    {structure.illustrations && (
                        <Carousel images={structure.illustrations} />
                    )}
                </div>

                <div className={styles.title}>
                    {structure.name && (<h1> {structure.name} </h1>)}
                    {structure.typologies && (<h2>{structure.typologies.map((el: string, i: number) => (<span key={i}>{el}  </span>))}</h2>)}
                </div>
                <div className={styles.description}>
                    {structure.description && (<p> {structure.description} </p>)}
                    {structure.website && ( <p className={"link"}>
                        <Link href={structure.website}> Voir le site </Link>
                    </p> )}
                </div>

                <div className={styles.productions}>
                    <div className={styles.productionsTitle}>
                        <span>{structure.projects!.length}</span> production.s
                    </div>
                    <div className={styles.productionsList}>
                        {structure.projects && structure.projects.map((el) => (
                        <Link
                            key={el.id}
                            href={`/projects/${el.id}`}>
                            <div>
                                <div className={classNames(styles.productionsListName, 'link')}> {el.name} </div>
                                <div className={styles.productionsListProject}> {el.team[0]} </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={styles.label}>
                    <LabelStructure
                        structure={structure}
                        bordered
                    />
                </div>

                <div className={styles.explainer}>
                    <p>Chaque arc repésente les projets portés.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: structure.colors[0] }}></span>Les projets designés.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: structure.colors[3] }}></span>Les projets produits chez vous.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: structure.colors[2] }}></span>Les projets dont vous avez fournis la matière.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: structure.colors[1] }}></span>Les projets soutenus.</p>
                </div>

                <div className={styles.share}>
                    <h2>Share</h2>
                    <div className={styles.sharing}>

                        <EmailShareButton
                            url={`https://re-label.eu/structures/${structure.id}`}
                            subject={'Mon Re-Label'}
                            body={'Je viens de faire mon Re-label sur : '}
                        >
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                        <FacebookShareButton
                            url={`https://re-label.eu/structures/${structure.id}`}
                            hashtag={'#relabel'}
                        >
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <LinkedinShareButton
                            url={`https://re-label.eu/structures/${structure.id}`}
                            title={'Mon Re-Label'}
                            summary={'Je viens de faire mon Re-label sur re-label.eu'}
                            source={'https://re-label.eu'}
                        >
                            <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                        <TwitterShareButton
                            url={`https://re-label.eu/structures/${structure.id}`}
                            title={'Mon Re-Label'}
                            hashtags={['relabel']}
                        >
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                    </div>

                    <div className={styles.embed}>
                        <span onClick={() => { addToClipboard(`<iframe src="https://re-label.eu/structures/label/${structure.id}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`) }}>
                            <BiCopy/> {copied ? "Ajouté au clipboard !" : "Integrer à votre site"}
                        </span>
                        <textarea readOnly value={`<iframe src="https://re-label.eu/structures/label/${structure.id}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`} />
                    </div>
                </div>

            </div>
        </Layout>
    );
}
