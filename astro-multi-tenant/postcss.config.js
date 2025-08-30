module.exports = {
  plugins: {
    tailwindcss: {
      // Dynamic config loading based on site
      config: process.env.SITE_CONFIG || './tailwind.config.cjs'
    },
    autoprefixer: {},
  },
}