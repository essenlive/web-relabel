import type { Score } from '../types';

interface CriteriaEntry {
    coef: number;
    scores: Record<string, number>;
}

type Bareme = Record<string, Record<string, CriteriaEntry>>;

export default function scoring(projectData: Record<string, unknown>): Score {

    const bareme: Bareme = {
        fab : {
            fab_expertise: {
                coef: 2,
                scores: {
                    "plusieurs": 10,
                    "peu": 5,
                    "aucune": 0
                }
            },
            fab_local: {
                coef: 1,
                scores: {
                    "sur place": 10,
                    "commune": 8,
                    "pays": 3,
                    "monde": 0
                }
            },
            fab_social: {
                coef: 1,
                scores: {
                    "reinsertion": 10,
                    "artisanat": 6,
                    "aucun": 0
                }
            },
            fab_tools: {
                coef: 1,
                scores: {
                    "outils standards": 10,
                    "machines cnc": 6,
                    "outillage specifique": 0
                }
            },
        },
        design : {
            design_durability: {
                coef: 1,
                scores: {
                    "demontable": 10/3,
                    "stockable": 10 / 3,
                    "reutilisable": 10 / 3,
                }
            },
            design_reparable: {
                coef: 1,
                scores: {
                    "personnel": 10,
                    "expert": 5,
                    "createur": 0
                }
            },
            design_replicability: {
                coef: 1,
                scores: {
                    "modele parametrique": 10,
                    "produit replicable": 7,
                    "piece unique": 0
                }
            },
            design_sharable : {
                coef: 1,
                scores: {
                    "proprietaire": 0,
                    "partage": 5,
                    "modifiable": 10
                }
            }
        },
        material : {
            material_origin: {
                coef: 1,
                scores: {
                    "sur place": 10,
                    "commune": 8,
                    "pays": 3,
                    "monde": 0
                }
            },
            material_leftovers: {
                coef: 1,
                scores: {
                    "don": 5,
                    "recyclage": 3,
                    "chutes minimes": 10,
                    "referencement": 8,
                    "aucune": 0,
                },
            },
            material_source: {
                coef: 2,
                scores: {
                    "fournisseur traditionnel": 0,
                    "fournisseur responsable": 3,
                    "ressourcerie": 7,
                    "gisement local": 10,
                },
            },
            material_quality: {
                coef: 1,
                scores: {
                    "n/a": 0,
                    "certifie": 10,
                    "naturel": 8,
                    "traitement responsable": 3,
                }
            }
        }
    }

    const score: Score = {
        fab : 0,
        material : 0,
        design : 0,
    };


    (Object.keys(bareme) as Array<keyof Score>).forEach((theme) => {
        const criterias = Object.keys(bareme[theme])
        let themeCoefs = 0;
        criterias.forEach((criteria) => {
            themeCoefs += bareme[theme][criteria].coef;
            new Array(projectData[criteria]).flat().forEach((el) => {
                if (!el || typeof (bareme[theme][criteria].scores[el as string]) === "undefined") {
                    return
                }
                score[theme] += bareme[theme][criteria].scores[el as string] * bareme[theme][criteria].coef;
            })
        })
        score[theme] = score[theme] / (themeCoefs * 10);
    })
    return score
}
