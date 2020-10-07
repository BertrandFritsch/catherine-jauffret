require("dotenv").config({
  path: `.env.${ process.env.NODE_ENV }`
});

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
    {
      resolve: `gatsby-plugin-google-fonts-v2`,
      options: {
        fonts: [
          {
            family: `Quicksand`,
            variable: true,
            weights: ["300..700"]
          },
          {
            family: `Lora`,
            variable: true,
            weights: ["400..500", "400..500"]
          },
          {
            family: `Raleway`,
            variable: true,
            weights: ["300..400", "300..400"]
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass')
      }
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        downloadLocal: true
      }
    },
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        fileName: `./graphqlTypes.ts`,
        documentPaths: [
          '../../.yarn/unplugged/gatsby-transformer-sharp*/**/*.js',
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
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
