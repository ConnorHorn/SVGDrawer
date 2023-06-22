module.exports = {
  daisyui: {
    themes: [
      "business"
    ],
    theme: {
      extend: {
        width: {
        },
      },
    },
  },
  content: ['./public/index.html', './src/**/*.svelte'],
  plugins: [require('daisyui')],
};
