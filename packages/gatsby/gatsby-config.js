module.exports = {
  siteMetadata: {
    title: `Catherine Jauffret`,
    description: `Collages de Catherine Jauffret`,
    siteUrl: `https://catherinejauffret.fr`,
    author: `Bertrand Fritsch`,
    socialMedias: {
      facebook: `https://www.facebook.com/catherine.jauffret1`
    }
  },
  plugins: [
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/layout.tsx`)
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://catherinejauffret.fr`
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${ __dirname }/src/images`
      }
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://catherinejauffret.fr",
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }]
          },
          production: {
            policy: [{ userAgent: "*", allow: "/" }]
          }
        }
      }
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        downloadLocal: true,
        pageLimit: 50,
        assetDownloadWorkers: 10
      }
    },
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        fileName: `./graphqlTypes.ts`,
        documentPaths: [
          './src/**/*.{ts,tsx}'
        ],
        codegenConfig: {
          avoidOptionals: true,
          skipTypename: true,
          maybeValue: 'T | undefined',
          namingConvention: {
            enumValues: 'keep'
          }
        }
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    `gatsby-plugin-remove-fingerprints`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Collages de Catherine Jauffret`,
        short_name: `Catherine Jauffret`,
        description: `Collages de Catherine Jauffret`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/images/Red-dingue.jpg`
      }
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`
  ]
}
