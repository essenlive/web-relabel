import { getColors, seed } from '@libs/getColors';
import * as Yup from 'yup';
import type { FormInput, FormConfig } from '../types';

const projectInputs: FormInput[] = [
    {
        name: "name",
        schema: Yup.string().required('Requis'),
        type: "shortText",
        initial: "",
        placeholder: "Nom",
        prefix: "Nom",
        description: "Le nom de votre projet, objet, chantier...",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "typology",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Typologie",
        description: "La typologie de votre projet.",
        suffix: "",
        required: true,
        options: [
            {
                value: "objet",
                label: "Objet"
            },
            {
                value: "espace",
                label: "Espace"
            },
            {
                value: "mobilier",
                label: "Mobilier"
            }
        ],
        group: "meta"
    },
    {
        name: "description",
        schema: Yup.string().required('Requis'),
        type: "text",
        initial: "",
        placeholder: "Ce projet ...",
        prefix: "Description",
        description: "En une ou deux phrases, une présentation de votre projet.",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "team",
        schema: Yup.array().of(Yup.object().required('Requis')).required('Requis').nullable(),
        type: "creatableSelect",
        initial: [],
        placeholder: "",
        description: "Les noms des membres de l'équipe.",
        prefix: "Équipe",
        suffix: "",
        required: true,
        options: [],
        group: "meta"
    },
    {
        name: "date",
        schema: Yup.string().required('Requis'),
        type: "date",
        initial: "",
        placeholder: "",
        prefix: "Date",
        description: "Date de fabrication ou livraison.",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "duration",
        schema: Yup.number().required('Requis'),
        type: "number",
        initial: 0,
        placeholder: 0,
        prefix: "Durée",
        description: "Durée globale du projet.",
        suffix: "jours",
        required: true,
        group: "meta"
    },
    {
        name: "designers",
        schema: Yup.array().of(Yup.string()),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Designer.s",
        description: "Les structures qui ont porté la conception.",
        suffix: "",
        required: false,
        options: [],
        group: "meta"
    },
    {
        name: "workshops",
        schema: Yup.array().of(Yup.string()),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Ateliers/lieux de fabrication",
        description: "Les structures qui ont porté la fabrication.",
        suffix: "",
        required: false,
        options: [],
        group: "meta"
    },
    {
        name: "suppliers",
        schema: Yup.array().of(Yup.string()),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Ressourceries/fournisseurs",
        description: "Les structures qui ont fourni les matières premières.",
        suffix: "",
        required: false,
        options: [],
        group: "meta"
    },
    {
        name: "others",
        schema: Yup.array().of(Yup.string()),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Partenaires",
        description: "Les structures partenaires qui vous ont accompagnés, institutions, incubateurs...",
        suffix: "",
        required: false,
        options: [],
        group: "meta"
    },
    {
        name: "contact",
        schema: Yup.string().email('Email incorrect').required('Requis'),
        type: "mail",
        initial: "",
        placeholder: "contact@mail.org",
        prefix: "Contact",
        description: "L'adresse mail d'un référent pour avoir plus d'informations. (Ne sera pas visible sur le site.)",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "website",
        schema: Yup.string().url("Url incorrecte, pensez à ajouter : https://"),
        type: "url",
        initial: "",
        placeholder: "siteduprojet.org",
        prefix: "Documentation",
        description: "L'url de votre site internet ou de la documentation si elle existe.",
        suffix: "",
        group: "meta"
    },
    {
        name: "illustrations",
        schema: Yup.array().of(Yup.string().url()).nullable(),
        type: "images",
        initial: [],
        placeholder: "",
        prefix: "Illustrations",
        description: "Une ou plusieurs images pour illustrer votre structure.",
        suffix: "",
        group: "meta"
    },
    {
        name: "colors",
        schema: Yup.array().of(Yup.string()),
        type: "button",
        initial: getColors(seed()),
        placeholder: "",
        prefix: "Changer les couleurs",
        suffix: "",
        required: true,
        handler: [getColors, seed],
        group: "customize"
    },
    {
        name: "material_source",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Source des materiaux",
        description: "La source de votre principal materiau.",
        suffix: "",
        required: true,
        options: [
            {
                value: "fournisseur traditionnel",
                label: "Fournisseur Traditionnel"
            },
            {
                value: "fournisseur responsable",
                label: "Fournisseur Responsable"
            },
            {
                value: "ressourcerie",
                label: "Ressourcerie"
            },
            {
                value: "gisement local",
                label: "Gisement Local"
            }
        ],
        group: "material"
    },
    {
        name: "material_quality",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Qualité des materiaux",
        description: "La qualité de votre principal materiau.",
        suffix: "",
        required: true,
        options: [
            {
                value: "n/a",
                label: "n/a"
            },
            {
                value: "certifie",
                label: "Certifié"
            },
            {
                value: "naturel",
                label: "Naturel"
            },
            {
                value: "traitement responsable",
                label: "Traitement Responsable"
            }
        ],
        group: "material"
    },
    {
        name: "material_leftovers",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Gestion des chutes",
        description: "La manière dont les chutes du projet sont traitées.",
        suffix: "",
        required: true,
        options: [
            {
                value: "don",
                label: "Don"
            },
            {
                value: "recyclage",
                label: "Recyclage"
            },
            {
                value: "chutes minimales",
                label: "Chutes minimes"
            },
            {
                value: "referencement",
                label: "Référencement"
            },
            {
                value: "aucune",
                label: "Aucune gestion"
            }
        ],
        group: "material"
    },
    {
        name: "material_origin",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Origine des materiaux",
        description: "L'origine géographique de votre principal materiau.",
        suffix: "",
        required: true,
        options: [
            {
                value: "sur place",
                label: "Sur place"
            },
            {
                value: "commune",
                label: "Commune"
            },
            {
                value: "pays",
                label: "Pays"
            },
            {
                value: "monde",
                label: "Monde"
            }
        ],
        group: "material"
    },
    {
        name: "design_replicability",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Réplicabilité de la conception",
        description: "La capacité à réutiliser le design de votre production.",
        suffix: "",
        required: true,
        options: [
            {
                value: "piece unique",
                label: "Pièce Unique"
            },
            {
                value: "produit replicable",
                label: "Produit replicable"
            },
            {
                value: "modele parametrique",
                label: "Modèle paramètrique"
            }
        ],
        group: "design"
    },
    {
        name: "design_sharable",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Conception contributive",
        description: "La capacité de votre design à être contributif.",
        suffix: "",
        required: true,
        options: [
            {
                value: "proprietaire",
                label: "Design propriétaire"
            },
            {
                value: "partage",
                label: "Design partagé"
            },
            {
                value: "modifiable",
                label: "Design contributif"
            }
        ],
        group: "design"
    },
    {
        name: "design_reparable",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Design réparable",
        description: "La capacité de votre produit à être réparé.",
        suffix: "",
        required: true,
        options: [
            {
                value: "personnel",
                label: "Réparable par chacun"
            },
            {
                value: "expert",
                label: "Réparable par un expert"
            },
            {
                value: "createur",
                label: "Réparable par le créateur"
            }
        ],
        group: "design"
    },
    {
        name: "design_durability",
        schema: Yup.array().of(Yup.string().required('Requis')),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Durabilité du design",
        description: "La capacité du design a être durable.",
        suffix: "",
        required: true,
        options: [
            {
                value: "demontable",
                label: "Démontable"
            },
            {
                value: "stockable",
                label: "Stockable"
            },
            {
                value: "reutilisable",
                label: "Réutilisable"
            }
        ],
        group: "design"
    },
    {
        name: "fab_expertise",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Savoir-faire",
        description: "Les savoir-faire que le projet mets en valeur.",
        suffix: "",
        required: true,
        options: [
            {
                value: "plusieurs",
                label: "Plusieurs savoir-faire"
            },
            {
                value: "peu",
                label: "Peu de savoir-faire"
            },
            {
                value: "aucun",
                label: "Aucun savoir-faire"
            }
        ],
        group: "fab"
    },
    {
        name: "fab_local",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Proximité de la production",
        description: "La localisation de la production par rapport à l'utilisation.",
        suffix: "",
        required: true,
        options: [
            {
                value: "sur place",
                label: "Sur place"
            },
            {
                value: "commune",
                label: "Commune"
            },
            {
                value: "pays",
                label: "Pays"
            },
            {
                value: "monde",
                label: "Monde"
            }
        ],
        group: "fab"
    },
    {
        name: "fab_tools",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Spécificité des outils",
        description: "La complexité des outils nécéssaire à la production.",
        suffix: "",
        required: true,
        options: [
            {
                value: "outils standards",
                label: "Outils standards"
            },
            {
                value: "machines cnc",
                label: "Machines à commandes numériques"
            },
            {
                value: "outillage specifique",
                label: "Outillage spécifiques"
            }
        ],
        group: "fab"
    },
    {
        name: "fab_social",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Impact de la fabrication",
        description: "Impact social de la production.",
        suffix: "",
        required: true,
        options: [
            {
                value: "reinsertion",
                label: "Réinsertion sociale"
            },
            {
                value: "artisanat",
                label: "Soutien à l'artisanat"
            },
            {
                value: "aucun",
                label: "Aucun"
            }
        ],
        group: "fab"
    },
    {
        name: "rgpd",
        schema: Yup.boolean().oneOf([true], 'Vous devez accepter la clause RGPD').required('Requis'),
        type: "checkbox",
        initial: "",
        placeholder: "",
        prefix: "Avertissement données personnelles.",
        description: "Les informations demandées sont utilisées pour le fonctionnement du site et le réferencement des projets et peuvent donner lieu à exercice du droit individuel d'accès auprès des gestionnaire dans les conditions prévues par la loi. Elles ne seront ni cédées ni diffusées en dehors des données présentes sur la plateforme.",
        suffix: "J'accepte ces conditions",
        required: true,
        group: "rgpd"
    }
]
const projectSchema: Record<string, unknown> = {}; projectInputs.forEach((el) => { projectSchema[el.name] = el.schema })
const projectInitialValues: Record<string, unknown> = {}; projectInputs.forEach((el) => { projectInitialValues[el.name] = el.initial })
export const projectForm: FormConfig = {
    inputs: projectInputs,
    schema: Yup.object().shape(projectSchema as any),
    initialValues: projectInitialValues
}

const structureInputs: FormInput[] = [
    {
        name: "name",
        schema: Yup.string().required('Requis'),
        type: "shortText",
        initial: "",
        placeholder: "Nom",
        prefix: "Nom",
        description: "Le nom de votre structure.",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "communities",
        schema: Yup.array().of(Yup.object().nullable()).required('Requis'),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Communautée.s",
        description: "Les communautées dont votre structure fait partie.",
        suffix: "",
        required: true,
        options: [],
        group: "meta"
    },
    {
        name: "adress",
        schema: Yup.string().required('Requis'),
        type: "adress",
        initial: "",
        placeholder: "15 rue ...",
        prefix: "Adresse",
        description: "L'adresse de votre structure.",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "description",
        schema: Yup.string().required('Requis'),
        type: "text",
        initial: "",
        placeholder: "Notre structure propose ...",
        prefix: "Description",
        description: "Qui êtes vous et quelles sont vos valeurs ?",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "status",
        schema: Yup.string().required('Requis'),
        type: "select",
        initial: "",
        placeholder: "",
        prefix: "Statut",
        suffix: "",
        description: "Le statut juridique de votre structure.",
        required: true,
        options: [
            { value: "association", label: "Association" },
            { value: "entreprise", label: "Entreprise" },
            { value: "cooperative", label: "Coopérative" },
            { value: "institution", label: "Institution" },
            { value: "indépendant", label: "Indépendant" }
        ],
        group: "data"
    },
    {
        name: "typologies",
        schema: Yup.array().of(Yup.string().required('Requis')),
        type: "multiSelect",
        initial: [],
        placeholder: "",
        prefix: "Activités",
        description: "La ou les activités de votre structure.",
        suffix: "",
        required: true,
        options: [
            { value: "designer", label: "Designer" },
            { value: "atelier", label: "Atelier" },
            { value: "stockage", label: "Stockage" },
            { value: "autre", label: "Partenaire" }
        ],
        group: "data"
    },
    {
        name: "contact",
        schema: Yup.string().email('Email incorrect').required('Requis'),
        type: "mail",
        initial: "",
        placeholder: "contact@mail.org",
        description: "L'adresse mail d'un référent pour avoir plus d'informations. (Ne sera pas visible sur le site.)",
        prefix: "Contact",
        suffix: "",
        required: true,
        group: "meta"
    },
    {
        name: "website",
        schema: Yup.string().url("Url incorrecte, pensez à ajouter : https://"),
        type: "url",
        initial: "",
        placeholder: "sitedelacommunauté.org",
        prefix: "Site internet",
        description: "L'url de votre site internet si vous en avez un.",
        suffix: "",
        group: "meta"
    },
    {
        name: "illustrations",
        schema: Yup.array().of(Yup.string().url()).nullable(),
        type: "images",
        initial: [],
        placeholder: "",
        prefix: "Illustrations",
        description: "Une ou plusieurs images pour illustrer votre structure.",
        suffix: "",
        group: "meta"
    },
    {
        name: "colors",
        schema: Yup.array().of(Yup.string()),
        type: "button",
        initial: getColors(seed()),
        placeholder: "",
        prefix: "Changer les couleurs",
        suffix: "",
        required: true,
        handler: [getColors, seed],
        group: "meta"
    },
    {
        name: "rgpd",
        schema: Yup.boolean().oneOf([true], 'Vous devez accepter la clause RGPD').required('Requis'),
        type: "checkbox",
        initial: "",
        placeholder: "",
        prefix: "Avertissement données personnelles.",
        description: "Les informations demandées sont utilisées pour le fonctionnement du site et le réferencement des projets et peuvent donner lieu à exercice du droit individuel d'accès auprès des gestionnaire dans les conditions prévues par la loi. Elles ne seront ni cédées ni diffusées en dehors des données présentes sur la plateforme.",
        suffix: "J'accepte ces conditions",
        required: true,
        group: "rgpd"
    }
]
const structureSchema: Record<string, unknown> = {}; structureInputs.forEach((el) => { structureSchema[el.name] = el.schema })
const structureInitialValues: Record<string, unknown> = {}; structureInputs.forEach((el) => { structureInitialValues[el.name] = el.initial })
export const structureForm: FormConfig = {
    inputs: structureInputs,
    schema: Yup.object().shape(structureSchema as any),
    initialValues: structureInitialValues
}

const communityInputs: FormInput[] = [{
    name: "name",
    description: "Le nom de votre communauté.",
    schema: Yup.string().required('Requis'),
    type: "shortText",
    initial: "",
    placeholder: "Ma communauté",
    prefix: "Nom",
    suffix: "",
    required: true,
    group: "meta"
},
{
    name: "year",
    schema: Yup.number().default(function () { return new Date().getFullYear(); }),
    type: "number",
    initial: new Date().getFullYear(),
    placeholder: new Date().getFullYear(),
    prefix: "Année de création",
    description: "L'année durant laquelle vous avez monté votre communauté.",
    suffix: "",
    required: true,
    group: "meta"
},
{
    name: "description",
    schema: Yup.string().required('Requis'),
    type: "text",
    initial: "",
    placeholder: "Nous cherchons à ...",
    prefix: "Courte description",
    description: "En une ou deux phrases, ce qui rassemble votre communauté.",
    suffix: "",
    required: true,
    group: "meta"
},
{
    name: "cities",
    schema: Yup.array().of(Yup.object().required('Requis')).nullable(),
    type: "creatableSelect",
    initial: [],
    placeholder: "Paris, Lyon",
    prefix: "Villes dans la communauté",
    description: "La liste des villes qui composent votre communauté.",
    suffix: "",
    required: true,
    options: [],
    group: "meta"
},
{
    name: "contact",
    schema: Yup.string().email('Email incorrect').required('Requis'),
    type: "mail",
    initial: "",
    placeholder: "contact@mail.org",
    prefix: "Contact du référent",
    description: "L'adresse mail d'un référent pour avoir plus d'informations. (Ne sera pas visible sur le site.)",
    suffix: "",
    required: true,
    group: "meta"
},
{
    name: "website",
    schema: Yup.string().url("Url incorrecte, pensez à ajouter : https://"),
    type: "url",
    initial: "",
    placeholder: "https://sitedelacommunauté.org",
    description: "L'url de votre site internet si vous en avez un.",
    prefix: "Site internet",
    suffix: "",
    required: false,
    group: "meta"
},
{
    name: "colors",
    schema: Yup.array().of(Yup.string()),
    type: "button",
    initial: getColors(seed()),
    placeholder: "",
    prefix: "Changer les couleurs",
    suffix: "",
    required: true,
    handler: [getColors, seed],
    group: "meta"
},
{
    name: "rgpd",
    schema: Yup.boolean().oneOf([true], 'Vous devez accepter la clause RGPD').required('Requis'),
    type: "checkbox",
    initial: "",
    placeholder: "",
    prefix: "Avertissement données personnelles.",
    description: "Les informations demandées sont utilisées pour le fonctionnement du site et le réferencement des projets et peuvent donner lieu à exercice du droit individuel d'accès auprès des gestionnaire dans les conditions prévues par la loi. Elles ne seront ni cédées ni diffusées en dehors des données présentes sur la plateforme.",
    suffix: "J'accepte ces conditions",
    required: true,
    group: "rgpd"
}
]
const communitySchema: Record<string, unknown> = {}; communityInputs.forEach((el) => { communitySchema[el.name] = el.schema })
const communityInitialValues: Record<string, unknown> = {}; communityInputs.forEach((el) => { communityInitialValues[el.name] = el.initial })
export const communityForm: FormConfig = {
    inputs: communityInputs,
    schema: Yup.object().shape(communitySchema as any),
    initialValues: communityInitialValues
}
