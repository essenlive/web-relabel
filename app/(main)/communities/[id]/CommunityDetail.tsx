'use client';
import { SITE_HOST, SITE_URL, iframeCode, pageUrl } from '@libs/site';
import Layout from '@components/Layout'
import { detail } from "@libs/detailStyles";
import Link from 'next/link'
import LabelCommunity from '@components/LabelCommunity';
import Tags from '@components/Tags';
import ReactMap from '@components/ReactMap'
import { BiCopy } from "react-icons/bi";
import {mean} from 'mathjs';
import { createMap } from '@libs/getColors';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton, EmailIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { useState } from 'react';
import type { Community, Structure } from '../../../../types';

interface CommunityDetailProps {
    community: Community;
}

export default function CommunityDetail({community}: CommunityDetailProps): React.JSX.Element {
    let [copied, setCopied] = useState<boolean>(false)
    function addToClipboard(text: string): void {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => { setCopied(false) }, 1000)
    }
    const colorMap = createMap(community.colors)
    return (
        <Layout padded>
            <div className={detail.communityBanner}>
                <div className={detail.title}>
                    {community.name && (<h1> {community.id === "rec1PaAXbW2aQik2p" ? "25 juin Portes ouvertes des fabriques innovantes" : community.name} </h1>)}
                    {community.cities && (<h2>{community.cities.map((el: string, i: number) => (<span key={i}>{el}  </span>))}</h2>)}
                </div>
                <div className={detail.description}>
                    {community.description && (<p> {community.description} </p>)}
                    {community.website && (
                        <p className={"link"}>
                            <Link href={community.website}> Voir le site</Link>
                        </p>
                    )}
                {community.id === "rec1PaAXbW2aQik2p" && (
                   <div className={detail.sponsor}>
                            <a href='https://www.paris.fr/' target="_blank" rel="noopener noreferrer">
                                <img src='https://upload.wikimedia.org/wikipedia/fr/f/fd/Ville_de_Paris_logo_2019.svg' alt='Ville de Paris' loading='lazy' />
                            </a>
                            <a href='https://arcinnovation.fr/' target="_blank" rel="noopener noreferrer">
                                <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.4Snx6zcWTASBCXj7ZJSEnQHaDC%26pid%3DApi&f=1' alt='ARC Innovation' loading='lazy' />
                            </a>
                    </div>
                    )}
                </div>

                <div className={detail.structures}>
                    <div className={detail.structuresTitle}>
                        <span>{(community.structures as Structure[]).length}</span> membres
                    </div>
                    <div className={detail.structuresList}>
                        {community.structures && (community.structures as Structure[]).map((el: Structure, i: number) => (
                        <Link
                            key={i}
                            href={`/structures/${el.id}`}>
                            <div>
                                <div className={'link'}> {el.name} </div>
                                    <div className={detail.structuresListProject}> <Tags tags={el.typologies} colorMap={colorMap} /></div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={detail.map}>
                    {(community.structures as Structure[]).length > 0 && (
                        <ReactMap
                        structures={community.mapData}
                        initialViewport={{
                            latitude: mean((community.structures as Structure[]).map((el: Structure) => el.latitude)),
                            longitude: mean((community.structures as Structure[]).map((el: Structure) => el.longitude)),
                            zoom: 10
                        }}
                        colorMap={community.colors}
                        />
                    )}
                </div>

                <div className={detail.label}>
                    <LabelCommunity community={community} />
                </div>
                <div className={detail.explainer}>
                    <p><span className={detail.node}></span>Les noeuds représentent les membres de la communauté.</p>
                    <p><span className={detail.legend} style={{ backgroundColor: community.colors[0] }}></span>Designers, architectes, artisans, créateurs...</p>
                    <p><span className={detail.legend} style={{ backgroundColor: community.colors[1] }}></span>Ateliers de fabrication, menuiserie, céramique, métal...</p>
                    <p><span className={detail.legend} style={{ backgroundColor: community.colors[2] }}></span>Fournisseurs, ressourcerie ou espace de stockage...</p>
                    <p><span className={detail.legend} style={{ backgroundColor: community.colors[3] }}></span>Structures partenaires, institutions, incubateurs...</p>
                </div>

                <div className={detail.share}>
                    <h2>Partager</h2>
                    <div className={detail.sharing}>
                        <EmailShareButton url={pageUrl(`/communities/${community.id}`)} subject={'Mon Re-Label'} body={'Je viens de faire mon Re-Label sur : '}>
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                        <FacebookShareButton url={pageUrl(`/communities/${community.id}`)} hashtag={'relabel'}>
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <LinkedinShareButton url={pageUrl(`/communities/${community.id}`)} title={'Mon Re-Label'} summary={`Je viens de faire mon Re-Label sur ${SITE_HOST}`} source={SITE_URL}>
                            <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                        <TwitterShareButton url={pageUrl(`/communities/${community.id}`)} title={'Mon Re-Label'} hashtags={['relabel']}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                    </div>

                    <div className={detail.embed}>
                        <button type="button" onClick={() => { addToClipboard(iframeCode(`/communities/label/${community.id}`)) }}>
                            <BiCopy /> {copied ? "Copié dans le presse-papier !" : "Intégrer à votre site"}
                        </button>
                        <textarea readOnly aria-label="Code d'intégration" value={iframeCode(`/communities/label/${community.id}`)} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
