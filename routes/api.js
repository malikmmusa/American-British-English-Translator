'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const text = req.body.text
      const locale = req.body.locale
      const validation = translator.vaildate(text, locale)
      if (validation != 'valid') return res.json(validation)

      const translatedText = translator.translate(text, locale)
      if (text == translatedText) return res.json({text: text, translation: "Everything looks good to me!"})
      return res.json({text: text, translation: translatedText})
      
    });
};
