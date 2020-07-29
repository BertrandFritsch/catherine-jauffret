module.exports = {
  siteMetadata: {
    title: `Catherine Jauffret`,
    description: `Collages de Catherine Jauffret.`,
    siteUrl: `https://catherinejauffret.com`,
    author: `Bertrand Fritsch`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://catherinejauffret.com`
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
        host: "https://catherinejauffret.com",
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
          }
        ]
      }
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Collages de Catherine Jauffret`,
        short_name: `Catherine Jauffret`,
        description: `Collages de Catherine Jauffret.`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#fff`,
        display: `standalone`,
        icons: [
          {
            src: `/favicon.ico`
          }
        ]
      }
    },
    `gatsby-plugin-offline`
  ]
}
