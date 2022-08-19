const forms = require('@tailwindcss/forms');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*/*.{html,js}'],
  theme: {
    extend: {}
  },
  plugins: [forms]
};
