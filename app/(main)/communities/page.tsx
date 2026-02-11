import type { Metadata } from 'next';
import Layout from '@components/Layout';
import Card from '@components/Card';
import LabelCommunity from '@components/LabelCommunity';
import { getCommunities } from '@libs/data';

export const revalidate = 60;
export const metadata: Metadata = {
  title: 'Re-label | Communaut\u00e9s',
  description: "Le Re-Label vise animer des communaut\u00e9s de bonnes pratiques localis\u00e9es sur le territoire.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default async function CommunitiesPage(): Promise<React.JSX.Element> {
  const communities = await getCommunities({ status: true });

  return (
    <Layout padded grid>
      {communities.map((community, i) => {
        return (
          <Card
            key={i}
            title={community.name}
            tags={community.cities}
            description={community.description}
            colorMap={community.colors}
            link={{ path: `/communities/${community.id}`, text: "Voir la communaut\u00e9" }}
            id={community.id}
          >
            <LabelCommunity community={community} />
          </Card>
        )
      })}
      <Card
        title={"La v\u00f4tre ?"}
        description={"Vous faites partie d'une communaut\u00e9 qui oeuvre pour des pratiques plus reponsables et solidaires dans la fabrication et la production ?"}
        link={{ path: `/communities/add`, text: "Proposer une communaut\u00e9" }}
      />
    </Layout>
  );
}
