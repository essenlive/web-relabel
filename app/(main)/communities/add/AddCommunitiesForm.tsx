'use client';
import Link from 'next/link'
import { Formik } from 'formik';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { createClient } from '@libs/supabase/client'
import styles from "@styles/pages/Form.module.css";
import Layout from '@components/Layout'
import LabelCommunity from '@components/LabelCommunity';
import { Inputs } from '@components/Inputs';
import Tags from '@components/Tags';
import { communityForm } from '@libs/formsData';
import dynamic from 'next/dynamic'
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function AddCommunitiesForm(): React.JSX.Element | React.ReactElement {
    const router = useRouter()
    const [sending, setSending] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<boolean>(false)
    const supabase = createClient()

    useEffect(() => {
        supabase.from('communities').select('cities')
            .then(({ data, error }) => {
                if (error) { setLoadError(true); return; }
                const cities: { value: string; label: string }[] = Array.from(
                    new Set((data || []).map((el: any) => el.cities).flat().filter(Boolean))
                ).map((el: string) => ({ value: el, label: el }));
                communityForm.inputs.map((input) => {
                    if (['cities'].indexOf(input.name) >= 0) input.options = cities;
                    return input;
                });
            });
    }, []);

    if (loadError) return <div>Failed to load</div>

    const submit = async (fields: any): Promise<void> => {
        setSending(true)
        const data: any = { ...fields };
        data.cities = fields.cities.map((el: { value: string }) => el.value);
        data.is_draft = true;
        delete data.rgpd;
        const { error } = await supabase.from('communities').insert(data);
        if (error) { console.error('Submit error:', error); setSending(false); return; }
        router.push(`/`);
    }

    return (
        <Layout padded>
            <Formik
                initialValues={communityForm.initialValues}
                validationSchema={communityForm.schema}
                onSubmit={(values: any) => { submit(values) }}>
                {(props: any) => {
                    return (
                        <div className={styles.form}>
                            <Confetti
                                style={{ pointerEvents: 'none', zIndex: 20, position: "fixed", left: 0, right: 0, top: 0, bottom: 0, inset: 0, width: "100%", height: "100%" }}
                                colors={props.values.colors}
                                numberOfPieces={sending ? 500 : 0}
                            />
                            <form className={classNames(styles.values, { [`${styles.submitted}`]: props.isSubmitting })} onSubmit={props.handleSubmit}>
                                {props.isSubmitting && <div className={styles.sending}><h3>C'est envoy\u00e9</h3></div>}
                                <h2>Pr\u00e9sentation de la communaut\u00e9</h2>
                                <div>
                                    {communityForm.inputs.map((input, i: number) => (
                                        <Inputs key={i} input={input} name={input.name} />
                                    ))}
                                </div>
                                <button type={"submit"} className={classNames(styles.submit)} onSubmit={props.handleSubmit}>
                                    {props.isValidating ? "V\u00e9rification du formulaire" : "Envoyer"}
                                </button>
                            </form>
                            <div className={styles.visualisation}>
                                <div className={styles.label}>
                                    <LabelCommunity
                                        community={{
                                            "name": props.values.name, "year": props.values.year, "description": props.values.description,
                                            "cities": props.values.cities.map((el: { value: string }) => el.value), "website": props.values.website,
                                            "colors": props.values.colors, "contact": props.values.contact,
                                        }}
                                    />
                                </div>
                                <div className={styles.verso}>
                                    <h2 className={styles.name}>{props.values.name && props.values.name}</h2>
                                    {props.values.cities && <Tags className={styles.tags} tags={props.values.cities.map((el: { value: string }) => el.value)} />}
                                    <p className={styles.description}>{props.values.description && props.values.description}</p>
                                    {props.values.website && <p className={classNames("link", styles.link)}>
                                        <Link href={{ pathname: props.values.website }}> Voir le site</Link>
                                    </p>}
                                </div>
                                <div className={styles.explainer}>
                                    <h3>Comprendre ce label</h3>
                                    <p>Ce label repr\u00e9sente les membres de votre communaut\u00e9, il est dynamique et \u00e9voluera \u00e0 mesure que votre communaut\u00e9 grandira.</p>
                                    <p>Les noeuds repr\u00e9sentent chacun des membres de votre communaut\u00e9s, et leur formes refl\u00e8tes le types de membres.</p>
                                    <ul className={styles.legends}>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[0] }}></span>Repr\u00e9sente les structures de conception de votre r\u00e9seau, les designers, architectes, artisans, cr\u00e9ateurs...</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[1] }}></span>Repr\u00e9sente les ateliers de fabrication, partag\u00e9s et priv\u00e9s, menuiserie, c\u00e9ramique, m\u00e9tal...</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[2] }}></span>Repr\u00e9sente les structures apportant la mati\u00e8re, que ce soit des ressourcerie ou des fournisseurs traditionnels.</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[3] }}></span>Repr\u00e9sente les autres structures partenaires, que ce soit des soutiens institutionnels, incubateurs...</li>
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
