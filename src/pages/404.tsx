import * as React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title='404' />
      <h1>La page demandée n'a pas été trouvée</h1>
      <p>Vous avez essayé d'atteindre une page qui n'existe pas.</p>
    </Layout>
  );
}
