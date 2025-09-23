const lCons =  ' hkgtcsxdzbfmnwly', sCons = ' hkgtcsxdzbfmnwly',
      lVowels = 'ôuûiîeê',          sVowels = 'orujiqe',
      lDiacritics = 'ktlnsc',       sDiacritics = 'KTLNSC';

const index = (loc, val) => loc.indexOf(val.toLowerCase());

const transcribe = text => text.replace(
    /([hkgtcsxdzbfmnwly])o(?=[oôuûiîeê])|([hkgtcsxdzbfmnwly])?([oôuûiîeê])([ktlnsc](?![oôuûiîeê]))?|([hkgtcsxdzbfmnwly])(?![oôuûiîeê])/gi, // RegEx: cons?+vowel+n? | const
    (_, p0, p1, p2, p3, p4) => {
        // console.log(`p0: ${p0}\tp1: ${p1}\tp2: ${p2}\tp3: ${p3}\tp4: ${p4}`)
        return p0 ? sCons[index(lCons, p0)] + 'A' :             // default vowel saver
            p4 ? sCons[index(lCons, p4)] :                      // null onset
            (sCons[(p1 ? index(lCons, p1) : -1)] ?? '') +       // onset
            (sVowels[index(lVowels, p2)] ?? (!p1 ? 'a' : '')) + // vowel
            (p3 ? sDiacritics[index(lDiacritics, p3)] : '')     // coda
})

/**
 * 
 * @param {string} text 
 * @returns {[string, boolean]}
 */
export default text => {
    if (text.match(/\b[OÔEÊIÎUÛHKGTCSXDZBFMNLWY][OÔEÊIÎUÛHKGTCSXDZBFMNLWYoôeêiîuûhkgtcsxdzbfmnlwy]*(?: [OÔEÊIÎUÛHKGTCSXDZBFMNLWY][OÔEÊIÎUÛHKGTCSXDZBFMNLWYoôeêiîuûhkgtcsxdzbfmnlwy]*)*/)) {
        return [`〈 ${transcribe(text)} 〉`, true]
    } else {
        return [transcribe(text),        false]
    }
}
