'use client';
import { Formik } from 'formik';
import Link from 'next/link'
import classNames from 'classnames';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { createClient } from '@libs/supabase/client'
import { structureForm } from '@libs/formsData';
import Layout from '@components/Layout'
import LabelStructure from '@components/LabelStructure';
import { Inputs } from '@components/Inputs';
import Tags from '@components/Tags';
import styles from "@styles/pages/Form.module.css";
import dynamic from 'next/dynamic'
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function AddStructureForm() {
    const router = useRouter()
    const [sending, setSending] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<boolean>(false)
    const supabase = createClient()

    useEffect(() => {
        supabase.from('communities').select('id, name')
            .then(({ data, error }) => {
                if (error) { setLoadError(true); return; }
                const communities = (data || []).map((el: any) => ({ value: el.id, label: el.name }));
                structureForm.inputs.map((input) => {
                    if (['communities'].indexOf(input.name) >= 0) input.options = communities;
                    return input;
                });
            });
    }, []);

    if (loadError) return <div>Failed to load</div>

    const submit = async (fields: any) => {
        setSending(true)
        const data: any = { ...fields };

        // Extract community selections for junction table
        const communityIds = (data.communities || []).map((el: any) => typeof el === 'string' ? el : el.value);
        delete data.communities;

        data.is_draft = true;
        delete data.rgpd;

        // Geocode the address
        if (data.adress) {
            try {
                const res = await fetch(`/api/geocode?q=${encodeURIComponent(data.adress)}`);
                const coords = await res.json();
                if (coords.longitude && coords.latitude) {
                    data.longitude = coords.longitude;
                    data.latitude = coords.latitude;
                }
            } catch (e) {
                console.error('Geocoding failed:', e);
            }
        }

        const { data: structure, error } = await supabase.from('structures').insert(data).select('id').single();
        if (error) { console.error('Submit error:', error); setSending(false); return; }

        // Insert community_structures relationships
        if (communityIds.length > 0) {
            const links = communityIds.map((communityId: string) => ({
                community_id: communityId,
                structure_id: structure.id,
            }));
            await supabase.from('community_structures').insert(links);
        }

        router.push(`/`);
    }

    return (
        <Layout padded>
            <Formik
                initialValues={structureForm.initialValues}
                validationSchema={structureForm.schema}
                onSubmit={(values) => { submit(values) }}>
                {(props: any) => {
                    return (
                        <div className={styles.form}>

                            <Confetti
                                style={{
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    position: "fixed",
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    inset: 0,
                                    width: "100%",
                                    height: "100%"
                                }}
                                colors={props.values.colors}
                                numberOfPieces={sending ? 500 : 0}
                            />
                            <form className={classNames(styles.values, { [`${styles.submitted}`]: props.isSubmitting })} onSubmit={props.handleSubmit}>
                                {props.isSubmitting && <div className={styles.sending}><h3>C'est envoyé</h3>
                                </div>}
                                <h2>Référencer une structure</h2>
                                <div>
                                    {structureForm.inputs.map((input, i: number) => (
                                        <Inputs
                                            key={i}
                                            input={input}
                                            name={input.name}
                                        />
                                    ))}
                                </div>
                                <button
                                    type={"submit"}
                                    className={classNames(styles.submit)}
                                    onSubmit={props.handleSubmit}
                                >{props.isValidating ? "Vérification du formulaire" : "Envoyer"}</button>
                            </form>
                            <div className={styles.visualisation}>

                                <div className={styles.label}>
                                    <LabelStructure
                                        structure={{
                                            name : props.values.name,
                                            adress : props.values.adress,
                                            communities : props.values.communities.map((el: any) => ({name: el.label})),
                                            data: [3, 2, 1, 3],
                                            colors: props.values.colors
                                        }}
                                    />
                                </div>
                                <div className={styles.verso}>
                                    {props.values.illustrations.length > 0 && <img className={styles.illustration} src={props.values.illustrations[0]} />}
                                    {props.values.name && <h2 className={styles.name}>{props.values.name}</h2>}
                                    {props.values.typologies && <Tags className={styles.tags} tags={props.values.typologies} /> }
                                    {props.values.description && <p className={styles.description}>{props.values.description}</p>}
                                    {props.values.website && <p className={classNames("link", styles.link)}>
                                        <Link href={{ pathname: props.values.website }}> Voir le site</Link>
                                    </p>}
                                </div>
                                <div className={styles.explainer}>
                                    <h3>Comprendre ce label</h3>
                                    <p>Ce label représente les projets portés par votre structureà mesure que des projets dont vous êtes aprtenaires sont référencés, votre label évoluera.</p>
                                    <p>Chaque arc repésente le nombre de projets que vous avez porté, et votre rôle dans chacun d'entre eux.</p>
                                    <ul className={styles.legends}>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[0] }}></span>Représente les projets que vous avez designés.</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[3] }}></span>Représente les projets quiont été produits chez vous.</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[2] }}></span>Représente les projets dont vous avez fournis la matière première.</li>
                                        <li><span className={styles.legend} style={{ backgroundColor: props.values.colors[1] }}></span>Représente les projets que vous avez soutenus, en tant que partenaire.</li>
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
