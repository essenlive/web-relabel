import Layout from '@components/Layout';
import dynamic from 'next/dynamic';
import Card from '@components/Card';
import prisma, {serialize} from '@libs/prisma'

const LabelCommunity = dynamic(() => import('@components/LabelCommunity'), { ssr: false });


export default function Communities({ communities }) {
  return (
    <Layout
      meta={{
        title: "Communautés",
        description: "Le Re-Label vise animer des communautés de bonnes pratiques localisées sur le territoire.",
        image: "/assets/logo.png"
      }} 
    padded
    grid
    >

        {communities.map((community, i) => {
          return (
            <Card
              key={i}
              title={community.name}
              tags={community.cities}
              description={community.description}
              colorMap={community.colors }
              link={{ path: `/communities/${community.id}`, text: "Voir la communauté" }}
              id={community.id}
            >
              <LabelCommunity
                community={community}
              />
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


export async function getStaticProps() {
  let communities = await prisma.community.findMany({where : {status : true}});
  let structures = await prisma.structure.findMany();

  communities = communities.map((community) => {
    community.structures = community.structures.map((structureId) => {
      let structure = structures.filter((el) => el.id === structureId);
      return structure[0]
    })
    return community
  })
  
  return {
    props: { communities: serialize(communities) },
    revalidate: 1
  }
}