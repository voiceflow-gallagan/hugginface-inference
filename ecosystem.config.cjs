module.exports = {
  apps: [
    {
      name: 'hf-text2image',
      script: 'app.js',
      env_production: {
        PORT: 3909,
        NODE_ENV: 'production',
      },
      watch: false,
    },
  ],
}
