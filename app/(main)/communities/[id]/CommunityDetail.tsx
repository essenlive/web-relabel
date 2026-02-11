'use client';
import Layout from '@components/Layout'
import classNames from "classnames"
import styles from "@styles/pages/SinglePage.module.css";
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
            <div className={styles.communityBanner}>
                {community.id === "rec1PaAXbW2aQik2p" && (
                    <div className={styles.illu}>
                        <img src='/assets/JPO.jpg' />
                    </div>
                )}

                <div className={styles.title}>
                    {community.name && (<h1> {community.id === "rec1PaAXbW2aQik2p" ? "25 juin Portes ouvertes des fabriques innovantes" : community.name} </h1>)}
                    {community.cities && (<h2>{community.cities.map((el: string, i: number) => (<span key={i}>{el}  </span>))}</h2>)}
                </div>
                <div className={styles.description}>
                    {community.description && (<p> {community.description} </p>)}
                    {community.website && (
                        <p className={"link"}>
                            <Link href={community.website}> Voir le site</Link>
                        </p>
                    )}
                {community.id === "rec1PaAXbW2aQik2p" && (
                   <div className={styles.sponsor}>
                            <a href='https://www.paris.fr/' target="_blank">
                                <img src='https://upload.wikimedia.org/wikipedia/fr/f/fd/Ville_de_Paris_logo_2019.svg' />
                            </a>
                            <a href='https://arcinnovation.fr/' target="_blank">
                                <img src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.4Snx6zcWTASBCXj7ZJSEnQHaDC%26pid%3DApi&f=1'/>
                            </a>
                    </div>
                    )}
                </div>

                <div className={styles.structures}>
                    <div className={styles.structuresTitle}>
                        <span>{(community.structures as Structure[]).length}</span> membres
                    </div>
                    <div className={styles.structuresList}>
                        {community.structures && (community.structures as Structure[]).map((el: Structure, i: number) => (
                        <Link
                            key={i}
                            href={`/structures/${el.id}`}>
                            <div>
                                <div className={classNames(styles.structure, 'link')}> {el.name} </div>
                                    <div className={styles.structuresListProject}> <Tags tags={el.typologies} colorMap={colorMap} /></div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={styles.map}>
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

                <div className={styles.label}>
                    <LabelCommunity community={community} />
                </div>
                <div className={styles.explainer}>
                    <p><span className={styles.node}></span>Les noeuds repr\u00e9sentent les membres de la communaut\u00e9.</p>
                    <p><span className={styles.legend} style={{ backgroundColor: community.colors[0] }}></span>Designers, architectes, artisans, cr\u00e9ateurs...</p>
                    <p><span className={styles.legend} style={{ backgroundColor: community.colors[1] }}></span>Ateliers de fabrication, menuiserie, c\u00e9ramique, m\u00e9tal...</p>
                    <p><span className={styles.legend} style={{ backgroundColor: community.colors[2] }}></span>Fournisseurs, ressourcerie ou espace de stockage...</p>
                    <p><span className={styles.legend} style={{ backgroundColor: community.colors[3] }}></span>Structures partenaires, institutions, incubateurs...</p>
                </div>

                <div className={styles.share}>
                    <h2>Share</h2>
                    <div className={styles.sharing}>
                        <EmailShareButton url={`https://re-label.eu/communities/${community.id}`} subject={'Mon Re-Label'} body={'Je viens de faire mon Re-label sur : '}>
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                        <FacebookShareButton url={`https://re-label.eu/communities/${community.id}`} hashtag={'relabel'}>
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <LinkedinShareButton url={`https://re-label.eu/communities/${community.id}`} title={'Mon Re-Label'} summary={'Je viens de faire mon Re-label sur re-label.eu'} source={'https://re-label.eu'}>
                            <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                        <TwitterShareButton url={`https://re-label.eu/communities/${community.id}`} title={'Mon Re-Label'} hashtags={['relabel']}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                    </div>

                    <div className={styles.embed}>
                        <span onClick={() => { addToClipboard(`<iframe src="https://re-label.eu/communities/label/${community.id}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`) }}>
                            <BiCopy /> {copied ? "Ajout\u00e9 au clipboard !" : "Integrer \u00e0 votre site"}
                        </span>
                        <textarea readOnly value={`<iframe src="https://re-label.eu/communities/label/${community.id}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
