'use client';
import { SITE_HOST, pageUrl } from '@libs/site';
import { forwardRef } from "react";
import type { Project, Structure } from '../types';
import LabelProject from '@components/LabelProject';
import { useQRCode } from 'next-qrcode';

interface CertificateProps {
    project: Project;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({project}, ref) => {
    const { Canvas: QRCanvas } = useQRCode();

    return (
        <div ref={ref} className="absolute -z-10 h-[200%] w-full overflow-hidden bg-white text-sm leading-normal [&>div]:flex [&>div]:h-screen [&>div]:w-screen [&>div]:items-center [&>div]:justify-center [&>div]:overflow-hidden [&>div>div]:aspect-square [&>div>div]:size-[400px] [&>div>div]:border-4 [&>div>div]:border-primary [&>div>div]:bg-white">
            <div>
                <div className="flex flex-col justify-evenly p-4 [&_h1]:mb-2 [&_p]:mb-1">
                    <h1>Remis le : </h1>
                    <div className="size-full bg-[url('/assets/memphis-mini.png')] bg-repeat not-last:mb-4"></div>
                    <h1>À : </h1>
                    <div className="size-full bg-[url('/assets/memphis-mini.png')] bg-repeat not-last:mb-4"></div>
                    <h1>Par : </h1>
                    <div className="size-full bg-[url('/assets/memphis-mini.png')] bg-repeat not-last:mb-4"></div>
                </div>
                <div>
                    <LabelProject project={project} />
                </div>
            </div>
            <div>
                <div className="grid grid-cols-[3fr_1fr] grid-rows-2 [&_h1]:mb-2 [&_p]:mb-1">
                    {project.illustrations && (
                        <img className="col-[1/3] row-1 size-full border-b-4 border-primary object-cover" src={project.illustrations[0]} alt={project.name}/>
                    )}
                    <div className="col-1 row-2 flex flex-col justify-between p-4">
                        <h1>Le projet </h1>
                        {project.description && (<p> {project.description} </p>)}
                        <p>Retrouver toute l'histoire du projet sur <span className="link">{SITE_HOST}</span></p>
                    </div>
                    <div className="col-2 row-2 flex flex-col justify-end">
                        <QRCanvas
                            text={pageUrl(`/projects/${project.id}`)}
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
                <div className="grid grid-cols-2 grid-rows-2 [&>div]:relative [&>div]:p-4 [&_h1]:relative [&_h1]:mt-6 [&_h1]:mb-2 [&_p]:mb-1 [&_p_span]:ml-2">
                    <div className="border-r-4 border-b-4 border-primary">
                        <span className="absolute top-0 left-0 m-4 block size-[1.3rem] rounded-full" style={{ backgroundColor: project.colors[0] }}></span>
                        <h1>Matériaux </h1>
                        <p><b>Fournisseurs</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("stockage") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>
                        <p><b>Source</b> : {project.material_source}</p>
                        <p><b>Qualité</b> : {project.material_quality}</p>
                        <p><b>Origine</b> : {project.material_origin}</p>
                        <p><b>Chutes</b> : {project.material_leftovers}</p>
                    </div>
                    <div className="border-b-4 border-primary">
                        <span className="absolute top-0 left-0 m-4 block size-[1.3rem] rounded-full" style={{ backgroundColor: project.colors[1] }}></span>
                        <h1>Conception</h1>
                        <p><b>Designers</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("designer") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>
                        <p><b>Réplicabilité</b> : {project.design_replicability}</p>
                        <p><b>Collaboratif</b> : {project.design_sharable}</p>
                        <p><b>Réparable</b> : {project.design_reparable}</p>
                        <p><b>Durable</b> : {(project as any).design_durabtility}</p>

                    </div>
                    <div className="border-r-4 border-primary">
                        <span className="absolute top-0 left-0 m-4 block size-[1.3rem] rounded-full" style={{ backgroundColor: project.colors[2] }}></span>
                        <h1>Fabrication</h1>
                        <p><b>Ateliers</b> : {project.structures.filter((el: Structure) => el.typologies.indexOf("atelier") >= 0).map((el: Structure) => (<span className='link' key={el.id}>{el.name}</span>))}</p>
                        <p><b>Expertises</b> : {project.fab_expertise}</p>
                        <p><b>Fabrication locale</b> : {project.fab_local}</p>
                        <p><b>Outils</b> : {project.fab_tools}</p>
                        <p><b>Social</b> : {project.fab_social}</p>

                    </div>
                    <div >
                        <span className="absolute top-0 left-0 m-4 block size-[1.3rem] rounded-full border-8 border-[#e1e1e1]" ></span>
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