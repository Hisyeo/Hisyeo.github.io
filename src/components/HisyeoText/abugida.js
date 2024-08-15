const latinConsonants  = ["'", "ꞌ", 'h', 'k', 'g', 't', 'c', 's', 'x', 'd', 'z', 'p', 'v', 'm', 'n', 'w', 'l', 'y'],
	  hisyeoConsonants = [ 'ɽ', 'ɽ', 'ɂ', 'ɔ', 'ꜿ', 'c', 'ꞇ', 'ɐ', 'ɋ', 'ʌ', 'ⱴ', 'ʋ', 'ɤ', 'ƶ', 'ƨ', 'ʒ', 'ʓ', 'ɀ'],

      latinVowels      = ['o', 'ö', 'u', 'ü', 'ı', 'i', 'e', 'ë'],
      hisyeoVowels     = ['',  'ı', 'ʃ', 'ʄ', 'ȷ', 'ɟ', 'ɿ', 'ʇ'],

      latinDiacritics  = ['t',/* ◌̑ */'k',/* ◌͒ */ 's',/* ◌̀ */'c',/* ◌̄ */'n',/* ◌̉ */'l',/* ◌̉ */],
      hisyeoDiacritics = ['\u0306',  '\u0311',   '\u0301',  '\u0304',  '\u0303',  '\u034a',];

const index = (loc, val) => loc.indexOf(val.toLowerCase());

const transcribeInner = text => text.replace(
    /([ꞌhkgtcsxdzpvmnlwy])?([oöuüıieë])((?:[kntscl])(?![oöuüıieë]))?|([ꞌhkgtcsxdzpvmnlwy])(?![oöuüıieë])/gi, // RegEx: cons?+vowel+n? | const
    (p0, p1, p2, p3, p4) => {
        // console.log(p0);
        return p4 // If no vowel found
            ? hisyeoConsonants[index(latinConsonants, p4)] // Null consonant
            : hisyeoConsonants[(p1 ? index(latinConsonants, p1) : 0)]  + // Leading consonant
            (p3 ? hisyeoDiacritics[index(latinDiacritics, p3)] : '') +
            (hisyeoVowels[index(latinVowels, p2)] || '')
    })

/**
 * 
 * @param {string} text 
 * @returns {[string, boolean]}
 */
export const transcribe = text => {
    if (text.match(/\b[OÖEËIİUÜHKGTCSXDZPVMNLWY][OÖEËIİUÜHKGTCSXDZPVMNLWYoöeëıiuühkgtcsxdzpvmnlwy]*(?: [OÖEËIİUÜHKGTCSXDZPVMNLWY][OÖEËIİUÜHKGTCSXDZPVMNLWYoöeëıiuühkgtcsxdzpvmnlwy]*)*/)) {
        return [`‹${transcribeInner(text)}›`, true]
    } else {
        return [transcribeInner(text),        false]
    }
}