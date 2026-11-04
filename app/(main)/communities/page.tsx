import type { Metadata } from 'next';
import Layout from '@components/Layout';
import Card from '@components/Card';
import LabelCommunity from '@components/LabelCommunity';
import { getCommunities } from '@libs/data';

export const revalidate = 60;
export const metadata: Metadata = {
  title: 'Re-Label | Communautés',
  description: "Le Re-Label vise à animer des communautés de bonnes pratiques localisées sur le territoire.",
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
            link={{ path: `/communities/${community.id}`, text: "Voir la communauté" }}
            id={community.id}
          >
            <LabelCommunity community={community} />
          </Card>
        )
      })}
      <Card
        title={"La vôtre ?"}
        description={"Vous faites partie d'une communauté qui oeuvre pour des pratiques plus reponsables et solidaires dans la fabrication et la production ?"}
        link={{ path: `/communities/add`, text: "Proposer une communauté" }}
      />
    </Layout>
  );
}
