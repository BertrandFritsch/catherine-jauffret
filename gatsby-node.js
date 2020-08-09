
exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const results = await graphql(`
    query {
      allContentfulCollage {
        nodes {
          slug
        }
      }
    }
  `);

  results.data.allContentfulCollage.nodes.forEach(collage => {
    createPage({
      path: `/collage/${ collage.slug }`,
      component: require.resolve('./src/templates/collage.tsx'),
      context: {
        slug: collage.slug
      }
    });
  });
}
