'use client';
import { SITE_HOST, SITE_URL, iframeCode, pageUrl } from '@libs/site';
import Layout from '@components/Layout'
import { cn } from '@libs/utils';
import { detail } from "@libs/detailStyles";
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

            <div className={detail.structureBanner}>

                <div className={detail.carousel}>
                    {structure.illustrations && (
                        <Carousel images={structure.illustrations} />
                    )}
                </div>

                <div className={detail.title}>
                    {structure.name && (<h1> {structure.name} </h1>)}
                    {structure.typologies && (<h2>{structure.typologies.map((el: string, i: number) => (<span key={i}>{el}  </span>))}</h2>)}
                </div>
                <div className={detail.description}>
                    {structure.description && (<p> {structure.description} </p>)}
                    {structure.website && ( <p className={"link"}>
                        <Link href={structure.website}> Voir le site </Link>
                    </p> )}
                </div>

                <div className={detail.productions}>
                    <div className={detail.productionsTitle}>
                        <span>{structure.projects!.length}</span> production.s
                    </div>
                    <div className={detail.productionsList}>
                        {structure.projects && structure.projects.map((el) => (
                        <Link
                            key={el.id}
                            href={`/projects/${el.id}`}>
                            <div>
                                <div className={cn(detail.productionsListName, 'link')}> {el.name} </div>
                                <div className={detail.productionsListProject}> {el.team[0]} </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={detail.label}>
                    <LabelStructure
                        structure={structure}
                        bordered
                    />
                </div>

                <div className={detail.explainer}>
                    <p>Chaque arc représente les projets portés.</p>
                    <p><span className={detail.legend} style={{ backgroundColor: structure.colors[0] }}></span>Les projets designés.</p>
                    <p><span className={detail.legend} style={{ backgroundColor: structure.colors[3] }}></span>Les projets produits chez vous.</p>
                    <p><span className={detail.legend} style={{ backgroundColor: structure.colors[2] }}></span>Les projets dont vous avez fourni la matière.</p>
                    <p><span className={detail.legend} style={{ backgroundColor: structure.colors[1] }}></span>Les projets soutenus.</p>
                </div>

                <div className={detail.share}>
                    <h2>Partager</h2>
                    <div className={detail.sharing}>

                        <EmailShareButton
                            url={pageUrl(`/structures/${structure.id}`)}
                            subject={'Mon Re-Label'}
                            body={'Je viens de faire mon Re-Label sur : '}
                        >
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                        <FacebookShareButton
                            url={pageUrl(`/structures/${structure.id}`)}
                            hashtag={'#relabel'}
                        >
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <LinkedinShareButton
                            url={pageUrl(`/structures/${structure.id}`)}
                            title={'Mon Re-Label'}
                            summary={`Je viens de faire mon Re-Label sur ${SITE_HOST}`}
                            source={SITE_URL}
                        >
                            <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                        <TwitterShareButton
                            url={pageUrl(`/structures/${structure.id}`)}
                            title={'Mon Re-Label'}
                            hashtags={['relabel']}
                        >
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                    </div>

                    <div className={detail.embed}>
                        <button type="button" onClick={() => { addToClipboard(iframeCode(`/structures/label/${structure.id}`)) }}>
                            <BiCopy/> {copied ? "Copié dans le presse-papier !" : "Intégrer à votre site"}
                        </button>
                        <textarea readOnly aria-label="Code d'intégration" value={iframeCode(`/structures/label/${structure.id}`)} />
                    </div>
                </div>

            </div>
        </Layout>
    );
}
