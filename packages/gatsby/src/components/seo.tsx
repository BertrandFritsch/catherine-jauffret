import * as React from 'react';
import { Helmet, HelmetProps } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

interface Props {
  description?: string;
  lang: string;
  meta: Exclude<HelmetProps['meta'], undefined>;
  title?: string;
  keywords?: string[];
  author?: string;
  url?: string;
  image?: string;
}

const defaultProps: Partial<Props> = {
  lang: 'fr',
  meta: []
};

interface SeoSiteQuery {
  site: {
    siteMetadata: {
      author: string;
      title: string;
      siteUrl: string;
      description: string;
    }
  }
}

export default function SEO({ description, lang, meta, title, author, image, url }: Props) {
  const { site } = useStaticQuery<SeoSiteQuery>(
    graphql`
      query SEOSite {
        site {
          siteMetadata {
            author
            title
            siteUrl
            description
          }
        }
      }
    `
  );

  const metaTitle = title ? `${ title } | ${ site.siteMetadata.title }` : site.siteMetadata.title;
  const metaDescription = description || site.siteMetadata.description;
  const metaAuthor = author || site.siteMetadata.author;
  const metaUrl = url || site.siteMetadata.siteUrl;
  const metaKeywords = [ 'Collages', 'Dé-collages' ];

  return (
    <Helmet
      htmlAttributes={ {
        lang
      } }
      title={ title ? `${ title } | ${ site.siteMetadata.title }` : site.siteMetadata.title }
      meta={ [
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: metaTitle
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          property: `og:url`,
          content: metaUrl
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`
        },
        {
          name: `twitter:creator`,
          content: metaAuthor
        },
        {
          name: `twitter:title`,
          content: metaTitle
        },
        {
          name: `twitter:description`,
          content: metaDescription
        },
        {
          name: `twitter:image`,
          content: image
        },
        ...meta
      ].concat(
        metaKeywords && metaKeywords.length > 0
        ? {
            name: `keywords`,
            content: metaKeywords.join(', ')
          }
        : []
      ) }
    />
  );
}

SEO.defaultProps = defaultProps;
