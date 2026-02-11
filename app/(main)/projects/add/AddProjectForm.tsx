'use client';
import { Formik } from 'formik';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import classNames from 'classnames';
import useSWR from 'swr'
import dynamic from 'next/dynamic'
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

import styles from "@styles/pages/Form.module.css";
import LabelProject from '@components/LabelProject';
import { Inputs } from '@components/Inputs';
import Layout from '@components/Layout'
import Tags from '@components/Tags';
import { projectForm } from '@libs/formsData';
import type { FormInput } from '../../../../types';

const fetcher = (...args: any[]): Promise<any> => fetch(...(args as [RequestInfo, RequestInit?])).then((res) => res.json())

export default function AddProjectForm(): React.JSX.Element {
    const [sending, setSending] = useState<boolean>(false)
    const router = useRouter()
    const { data, error } = useSWR('/api/structures', fetcher)

    if (error) return <div>Failed to load</div>
    if (data) {
        let structures = data.map((el: any) => ({ value: el.id, label: el.name }));
        projectForm.inputs.map((input: FormInput) => {
            if (['designers', 'suppliers', 'workshops', 'others'].indexOf(input.name) >= 0) input.options = structures;
            return input
        })
    }

    const submit = async (fields: any): Promise<void> => {
        setSending(true)
        let data: any = new Object; Object.assign(data, fields)
        data.team = fields.team.map((el: any) => el.value)
        data.illustrations = data.illustrations.map((el: any) => ({ "url": el }))
        await fetch('/api/projects', { method: 'POST', body: JSON.stringify([data]), headers: { 'Content-Type': 'application/json' } })
        await fetch('/api/build', { method: 'GET' })
        router.push(`/`);
    }

    return (
        <Layout padded>
            <Formik
                initialValues={projectForm.initialValues}
                validationSchema={projectForm.schema}
                onSubmit={(values: any) => { submit(values) }}>
                {(props: any) => {
                    return (
                        <div className={styles.form}>
                            <Confetti
                                style={{ pointerEvents: 'none', zIndex: 20, position: "fixed", left: 0, right: 0, top: 0, bottom: 0, inset: 0, width: "100%", height: "100%" }}
                                colors={props.values.colors}
                                numberOfPieces={sending ? 500 : 0}
                            />
                            <form className={classNames(styles.values, { [`${styles.submitted}`]: sending })} onSubmit={props.handleSubmit}>
                                {sending && <div className={styles.sending}><h3>C'est envoyé</h3></div>}
                                <h2>Présentation du projet</h2>
                                <div>{projectForm.inputs.filter((el: FormInput) => el.group === "meta").map((input: FormInput, i: number) => (<Inputs key={i} input={input} name={input.name} />))}</div>
                                <h3>Les matériaux</h3>
                                <div>{projectForm.inputs.filter((el: FormInput) => el.group === "material").map((input: FormInput, i: number) => (<Inputs key={i} input={input} name={input.name} />))}</div>
                                <h3>La conception</h3>
                                <div>{projectForm.inputs.filter((el: FormInput) => el.group === "design").map((input: FormInput, i: number) => (<Inputs key={i} input={input} name={input.name} />))}</div>
                                <h3>La fabrication</h3>
                                <div>{projectForm.inputs.filter((el: FormInput) => el.group === "fab").map((input: FormInput, i: number) => (<Inputs key={i} input={input} name={input.name} />))}</div>
                                <div>{projectForm.inputs.filter((el: FormInput) => el.group === "customize").map((input: FormInput, i: number) => (<Inputs key={i} input={input} name={input.name} />))}</div>
                                <div>{projectForm.inputs.filter((el: FormInput) => el.group === "rgpd").map((input: FormInput, i: number) => (<Inputs key={i} input={input} name={input.name} />))}</div>
                                <button type={"submit"} className={classNames(styles.submit)} onSubmit={props.handleSubmit}>
                                    {props.isValidating ? "Vérification du formulaire" : "Envoyer"}
                                </button>
                            </form>
                            <div className={styles.visualisation}>
                                <div className={styles.label}>
                                    <LabelProject
                                        project={{
                                            name: props.values.name, date: props.values.date,
                                            team: props.values.team.map((el: any) => el.value),
                                            workshops: props.values.workshops.map((el: any) => el.value),
                                            designers: props.values.designers.map((el: any) => el.value),
                                            suppliers: props.values.suppliers.map((el: any) => el.value),
                                            others: props.values.others.map((el: any) => el.value),
                                            colors: props.values.colors,
                                            fab_expertise: props.values.fab_expertise, fab_local: props.values.fab_local,
                                            fab_social: props.values.fab_social, fab_tools: props.values.fab_tools,
                                            material_origin: props.values.material_origin, material_leftovers: props.values.material_leftovers,
                                            material_source: props.values.material_source, material_quality: props.values.material_quality,
                                            design_durability: props.values.design_durability, design_reparable: props.values.design_reparable,
                                            design_replicability: props.values.design_replicability, design_sharable: props.values.design_sharable
                                        }}
                                    />
                                </div>
                                <div className={styles.verso}>
                                    {props.values.illustrations.length > 0 && <img className={styles.illustration} src={props.values.illustrations[0]}/>}
                                    {props.values.name && <h2 className={styles.name}>{props.values.name}</h2>}
                                    {props.values.typology && <Tags className={styles.tags} tags={[props.values.typology]} />}
                                    {props.values.description && <p className={styles.description}>{props.values.description}</p>}
                                    {props.values.website && <p className={classNames("link", styles.link)}><Link href={{ pathname: props.values.website }}> Voir le site</Link></p>}
                                </div>
                                <div className={styles.explainer}>
                                    <h3>Comprendre ce label</h3>
                                    <p>Ce label illustre les initiatives eco-responsables du projet. En complément du certificat il permet de notifier votre démache et en donner un aperçu.</p>
                                    <p>Chacun des noeuds représente un partenaire du projet que vous avez réussi à impliquer.</p>
                                    <p>Les proportions des différentes couleurs représentent chacun de vos engagements :</p>
                                    <ul className={styles.legends}>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[1] }}></span>Représente votre engagement en terme de conception ouverte et perenne.</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[2] }}></span>Représente votre engagement d'un point de vue fabrication localisée, et circuits courts.</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[0] }}></span>Représente votre engament en terme de matériaux responsables.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                }}
            </Formik>
        </Layout>
    );
}
