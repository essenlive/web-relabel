'use client';
import { Formik } from 'formik';
import Link from 'next/link'
import { cn } from '@libs/utils';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { createClient } from '@libs/supabase/client'
import { structureForm } from '@libs/formsData';
import Layout from '@components/Layout'
import LabelStructure from '@components/LabelStructure';
import { Inputs } from '@components/Inputs';
import Tags from '@components/Tags';
import { formStyles } from '@libs/formStyles';
import dynamic from 'next/dynamic'
const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function AddStructureForm() {
    const router = useRouter()
    const [sending, setSending] = useState<boolean>(false)
    const [loadError, setLoadError] = useState<boolean>(false)
    const [submitError, setSubmitError] = useState<boolean>(false)
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

    if (loadError) return <Layout padded><p role="alert">Impossible de charger le formulaire. Veuillez réessayer plus tard.</p></Layout>

    const submit = async (fields: any) => {
        setSending(true)
        setSubmitError(false)
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

        const structureId = crypto.randomUUID();
        data.id = structureId;
        const { error } = await supabase.from('structures').insert(data);
        if (error) { console.error('Submit error:', error); setSending(false); setSubmitError(true); return; }

        // Insert community_structures relationships
        if (communityIds.length > 0) {
            const links = communityIds.map((communityId: string) => ({
                community_id: communityId,
                structure_id: structureId,
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
                        <div className={formStyles.form}>

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
                            <form className={formStyles.values} onSubmit={props.handleSubmit}>
                                {props.isSubmitting && <div className={formStyles.sending}><h3>C'est envoyé</h3>
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
                                {submitError && <p role="alert" className={formStyles.alert}>L'envoi a échoué. Vérifiez votre connexion et réessayez.</p>}
                                <button
                                    type={"submit"}
                                    className={formStyles.submit}
                                    onSubmit={props.handleSubmit}
                                >{props.isValidating ? "Vérification du formulaire" : "Envoyer"}</button>
                            </form>
                            <div className={formStyles.visualisation}>

                                <div className={formStyles.label}>
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
                                <div className={formStyles.verso}>
                                    {props.values.illustrations.length > 0 && <img className={formStyles.illustration} src={props.values.illustrations[0]} alt="Aperçu de l'illustration" />}
                                    {props.values.name && <h2 className={formStyles.name}>{props.values.name}</h2>}
                                    {props.values.typologies && <Tags className={formStyles.tags} tags={props.values.typologies} /> }
                                    {props.values.description && <p className={formStyles.description}>{props.values.description}</p>}
                                    {props.values.website && <p className={cn("link", formStyles.link)}>
                                        <Link href={{ pathname: props.values.website }}> Voir le site</Link>
                                    </p>}
                                </div>
                                <div className={formStyles.explainer}>
                                    <h3>Comprendre ce label</h3>
                                    <p>Ce label représente les projets portés par votre structure. À mesure que des projets dont vous êtes partenaires sont référencés, votre label évoluera.</p>
                                    <p>Chaque arc représente le nombre de projets que vous avez porté, et votre rôle dans chacun d'entre eux.</p>
                                    <ul className={formStyles.legends}>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[0] }}></span>Représente les projets que vous avez designés.</li>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[3] }}></span>Représente les projets qui ont été produits chez vous.</li>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[2] }}></span>Représente les projets dont vous avez fourni la matière première.</li>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[1] }}></span>Représente les projets que vous avez soutenus, en tant que partenaire.</li>
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
