'use client';
import { forwardRef } from "react";
import type { Project, Structure } from '../types';
import LabelProject from '@components/LabelProject';
import styles from "@styles/components/Certificate.module.css";
import { useQRCode } from 'next-qrcode';

interface CertificateProps {
    project: Project;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({project}, ref) => {
    const { Canvas: QRCanvas } = useQRCode();

    return (
        <div ref={ref} className={styles.certificate}>
            <div className={styles.recto}>
                <div className={styles.signature}>
                    <h1>Remis le : </h1>
                    <div className={styles.signArea}></div>
                    <h1>À : </h1>
                    <div className={styles.signArea}></div>
                    <h1>Par : </h1>
                    <div className={styles.signArea}></div>
                </div>
                <div>
                    <LabelProject project={project} />
                </div>
            </div>
            <div className={styles.verso}>
                <div className={styles.description}>
                    {project.illustrations && (
                        <img className={styles.illustration} src={project.illustrations[0]}/>
                    )}
                    <div className={styles.project}>
                        <h1>Le projet </h1>
                        {project.description && (<p> {project.description} </p>)}
                        <p>Retrouver toute l'histoire du projet sur <span className="link">re-label.eu</span></p>
                    </div>
                    <div className={styles.share}>
                        <QRCanvas
                            text={`https://re-label.eu/projects/${project.id}`}
                            options={{
                                errorCorrectionLevel: 'L',
                                margin: 2,
                                scale: 1,
                                width: 100,
                                color: { dark: '#355c7d', light: '#FFF' },
                            }}
                        />
                    </div>
                </div>
                <div className={styles.specifications}>
                    <div className={styles.materials}>
                        <span className={styles.legend} style={{ backgroundColor: project.colors[0] }}></span>
                        <h1>Matériaux </h1>
                        <p><b>Fournisseurs</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("stockage") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>
                        <p><b>Source</b> : {project.material_source}</p>
                        <p><b>Qualité</b> : {project.material_quality}</p>
                        <p><b>Origine</b> : {project.material_origin}</p>
                        <p><b>Chutes</b> : {project.material_leftovers}</p>
                    </div>
                    <div className={styles.design}>
                        <span className={styles.legend} style={{ backgroundColor: project.colors[1] }}></span>
                        <h1>Conception</h1>
                        <p><b>Designers</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("designer") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>
                        <p><b>Réplicabilité</b> : {project.design_replicability}</p>
                        <p><b>Collaboratif</b> : {project.design_sharable}</p>
                        <p><b>Réparable</b> : {project.design_reparable}</p>
                        <p><b>Durable</b> : {(project as any).design_durabtility}</p>

                    </div>
                    <div className={styles.fab}>
                        <span className={styles.legend} style={{ backgroundColor: project.colors[2] }}></span>
                        <h1>Fabrication</h1>
                        <p><b>Ateliers</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("atelier") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>
                        <p><b>Expertises</b> : {project.fab_expertise}</p>
                        <p><b>Fabrication locale</b> : {project.fab_local}</p>
                        <p><b>Outils</b> : {project.fab_tools}</p>
                        <p><b>Social</b> : {project.fab_social}</p>

                    </div>
                    <div className={styles.partners}>
                        <span className={styles.node} ></span>
                        <h1>Soutiens</h1>
                        <p><b>Partenaires</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("autre") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>

                    </div>

                </div>
            </div>
        </div>
    );
});

Certificate.displayName = 'Certificate';

export default Certificate