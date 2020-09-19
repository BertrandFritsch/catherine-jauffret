
exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const results = await graphql(`
    query {
      allContentfulCollage {
        nodes {
          slug
          title
        }
      }
    }
  `);

  results.data.allContentfulCollage.nodes.forEach(collage => {
    const pathname = `/collage/${ collage.slug }`;
    createPage({
      path: pathname,
      component: require.resolve('./src/templates/collage.tsx'),
      context: {
        slug: collage.slug,
        layoutOverlay: {
          pathname,
          title: collage.title
        }
      }
    });
  });
}
