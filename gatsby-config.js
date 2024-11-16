const APP_CONFIG = {
  name: "Saber DAO",
  colors: {
    theme: "#1a1a1a" // O el color que prefieras
  }
};

module.exports = {
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    FAST_DEV: true,
    DEV_SSR: false
  },
  plugins: [
    // Soporte para TypeScript
    'gatsby-plugin-typescript',
    
    // Soporte para Tailwind CSS
    'gatsby-plugin-postcss',
    
    // Soporte para React
    'gatsby-plugin-react-helmet',
    
    // Optimización de imágenes
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    
    // Para manejar archivos estáticos
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    
    // Para soporte de PWA (opcional)
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: APP_CONFIG.name,
        short_name: APP_CONFIG.name,
        start_url: '/',
        background_color: '#ffffff',
        theme_color: APP_CONFIG.colors.theme,
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
      options: {
        devMode: false,
      },
    },
  ],
}; 