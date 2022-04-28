const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  vaildate(text, locale){
    if (text == null || locale == null) return { error: 'Required field(s) missing' }
    if (!text) return { error: 'No text to translate' }
    
    if (locale == 'american-to-british' || locale == 'british-to-american') return 'valid'  
    else return { error: 'Invalid value for locale field' }
  }

  translate(text, locale){
    text = this.test(text, locale)
    var splitText = text.split(/([\s,?!\(\)]|(?<!^[d-xD-X]{2})(?<![\s][d-xD-X]{2})\.(?!\d))/)
    splitText = this.translator(splitText, locale)
    return splitText.join('')
  }

  upperCase(text){
    return text.slice(0, 24) + text.charAt(24).toUpperCase() + text.slice(25)
  }

  test(text, locale){
    console.log(text)
    if (locale == 'american-to-british'){
      Object.keys(americanOnly).map(key => {
        var isUpper; 
        const americanRegex = new RegExp(`${key}[\\s\\.,!?]`, 'i')
        const match = text.toLowerCase().match(americanRegex)
        const indexOfMatch = text.indexOf(key)
        if (match){
          if (text.charAt(indexOfMatch) == text.charAt(indexOfMatch).toUpperCase()) isUpper = true;
          if (isUpper) text = text.replace(new RegExp(key, 'i'), `<span class="highlight">${this.upperCase(americanOnly[key])}</span>`)
          else text = text.replace(key, `<span class="highlight">${americanOnly[key]}</span>`)
        }
      })
    }
    else {
      Object.keys(britishOnly).map(key => {
        var isUpper; 
        const britishRegex = new RegExp(`${key}[\\s\\.,!?]`, 'i')
        const match = text.toLowerCase().match(britishRegex)
        const indexOfMatch = text.indexOf(key)
        if (match){
          if (text.charAt(indexOfMatch) == text.charAt(indexOfMatch).toUpperCase()) isUpper = true;
          if (isUpper) text = text.replace(new RegExp(key, 'i'), `<span class="highlight">${this.upperCase(britishOnly[key])}</span>`)
          else text = text.replace(key, `<span class="highlight">${britishOnly[key]}</span>`)
        }
      })
    }
    return text
  }

  translator(text, locale){
    const britishTimeRegex = /[0-2]{0,1}[0-9]{1}\.{1}[0-5]{1}[0-9]{1}/
    const americanTimeRegex = /[0-2]{0,1}[0-9]{1}:{1}[0-5]{1}[0-9]{1}/
    
    if (locale == 'american-to-british'){
      for (let word in text){
        if (americanTimeRegex.test(text[word])){
          text[word] = `<span class="highlight">${text[word].replace(':', '.')}</span>`
        }
        Object.keys(americanToBritishTitles).map(key => {
          if (key == text[word].toLowerCase()){
            text[word] = `<span class="highlight">${text[word].replace('.', '')}</span>`
          }
        }) 
        Object.keys(americanToBritishSpelling).map(key => {
          var isUpper; 
          if (key == text[word].toLowerCase()){
            if (text[word][0] == text[word][0].toUpperCase()) isUpper = true;
            text[word] = `<span class="highlight">${americanToBritishSpelling[key]}</span>`
            if (isUpper) text[word] = this.upperCase(text[word])
          }
        })
      }     
    return text
    }
    else {
      for (let word in text){
        if (britishTimeRegex.test(text[word])){
          text[word] = `<span class="highlight">${text[word].replace('.', ':')}</span>`
        }
        Object.keys(americanToBritishTitles).map(key => {
          if (americanToBritishTitles[key] == text[word].toLowerCase()){
            text[word] = `<span class="highlight">${text[word]}.</span>`
          }
        }) 
        Object.keys(americanToBritishSpelling).map(key => {
          var isUpper; 
          if (americanToBritishSpelling[key] == text[word].toLowerCase()){
            if (text[word][0] == text[word][0].toUpperCase()) isUpper = true;
            text[word] = `<span class="highlight">${key}</span>`
            if (isUpper) text[word] = this.upperCase(text[word])
          }
        })
      }
      return text
    }
  }
}

module.exports = Translator;