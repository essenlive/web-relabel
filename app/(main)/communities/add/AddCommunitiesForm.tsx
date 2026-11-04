'use client';
import Link from 'next/link'
import { Formik } from 'formik';
import { cn } from '@libs/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { createClient } from '@libs/supabase/client'
import { formStyles } from '@libs/formStyles';
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
    const [submitError, setSubmitError] = useState<boolean>(false)
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

    if (loadError) return <Layout padded><p role="alert">Impossible de charger le formulaire. Veuillez réessayer plus tard.</p></Layout>

    const submit = async (fields: any): Promise<void> => {
        setSending(true)
        setSubmitError(false)
        const data: any = { ...fields };
        data.cities = fields.cities.map((el: { value: string }) => el.value);
        data.is_draft = true;
        delete data.rgpd;
        const { error } = await supabase.from('communities').insert(data);
        if (error) { console.error('Submit error:', error); setSending(false); setSubmitError(true); return; }
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
                        <div className={formStyles.form}>
                            <Confetti
                                style={{ pointerEvents: 'none', zIndex: 20, position: "fixed", left: 0, right: 0, top: 0, bottom: 0, inset: 0, width: "100%", height: "100%" }}
                                colors={props.values.colors}
                                numberOfPieces={sending ? 500 : 0}
                            />
                            <form className={formStyles.values} onSubmit={props.handleSubmit}>
                                {props.isSubmitting && <div className={formStyles.sending}><h3>C'est envoyé</h3></div>}
                                <h2>Présentation de la communauté</h2>
                                <div>
                                    {communityForm.inputs.map((input, i: number) => (
                                        <Inputs key={i} input={input} name={input.name} />
                                    ))}
                                </div>
                                {submitError && <p role="alert" className={formStyles.alert}>L'envoi a échoué. Vérifiez votre connexion et réessayez.</p>}
                                <button type={"submit"} className={formStyles.submit} onSubmit={props.handleSubmit}>
                                    {props.isValidating ? "Vérification du formulaire" : "Envoyer"}
                                </button>
                            </form>
                            <div className={formStyles.visualisation}>
                                <div className={formStyles.label}>
                                    <LabelCommunity
                                        community={{
                                            "name": props.values.name, "year": props.values.year, "description": props.values.description,
                                            "cities": props.values.cities.map((el: { value: string }) => el.value), "website": props.values.website,
                                            "colors": props.values.colors, "contact": props.values.contact,
                                        }}
                                    />
                                </div>
                                <div className={formStyles.verso}>
                                    <h2 className={formStyles.name}>{props.values.name && props.values.name}</h2>
                                    {props.values.cities && <Tags className={formStyles.tags} tags={props.values.cities.map((el: { value: string }) => el.value)} />}
                                    <p className={formStyles.description}>{props.values.description && props.values.description}</p>
                                    {props.values.website && <p className={cn("link", formStyles.link)}>
                                        <Link href={{ pathname: props.values.website }}> Voir le site</Link>
                                    </p>}
                                </div>
                                <div className={formStyles.explainer}>
                                    <h3>Comprendre ce label</h3>
                                    <p>Ce label représente les membres de votre communauté, il est dynamique et évoluera à mesure que votre communauté grandira.</p>
                                    <p>Les noeuds représentent chacun des membres de votre communautés, et leur formes reflètes le types de membres.</p>
                                    <ul className={formStyles.legends}>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[0] }}></span>Représente les structures de conception de votre réseau, les designers, architectes, artisans, créateurs...</li>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[1] }}></span>Représente les ateliers de fabrication, partagés et privés, menuiserie, céramique, métal...</li>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[2] }}></span>Représente les structures apportant la matière, que ce soit des ressourcerie ou des fournisseurs traditionnels.</li>
                                        <li><span className={formStyles.legend} style={{ backgroundColor: props.values.colors[3] }}></span>Représente les autres structures partenaires, que ce soit des soutiens institutionnels, incubateurs...</li>
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
