import csv from 'neat-csv'
import { neutralize } from './helpers.mjs'

const file = await fs.readFile('./static/words.csv', 'utf8')

const minPairs = {
    b:   ['f', 't', 'd'],
    k:   ['h', 'g'],
    g:   ['k', 'd'],
    t:   ['d', 'c', 's', 'n', 'b'],
    c:   ['z', 't'],
    d:   ['t', 'g', 'z', 'b'],
    z:   ['c', 'd'],
    s:   ['c', 't'],
    x:   ['s', 'c'],
    f:   ['b', 'w'],
    h:   ['ꞌ', 'k'],
    m:   ['n'],
    n:   ['m'],
    'ꞌ': ['h', 'w', 'l', 'y'], // adding "l" for verb contractions
    w:   ['ꞌ', 'f', 'l'],
    l:   ['ꞌ', 'y', 'w'],
    y:   ['ꞌ', 'l'],
    // Vowels
    o:   ['e', 'i', 'u'],      ô:   ['o', 'û'],
    e:   ['o', 'ê', 'i', 'u'], ê:   ['e', 'i', 'î'],
    i:   ['o', 'î', 'ê', 'u'], î:   ['e', 'ê', 'i'],
    u:   ['o', 'e', 'i'],      û:   ['u', 'ô'],
}

// let badSyllablesIdentified = false
// const badSyllablesMessage = "Some words have improper syllable structure"
const syllableRegex = /(?<onset>[ꞌhkgtcxsdzbfmnlwy])?(?<nucleus>[oôeêiîuû])(?<coda>[tkscnl](?![oôeêiîuû]))?/gi


const records = await csv(file, {
    delimiter: ',',
    columns: true,
})

console.log('Grabbing words from records...')

const words = []
const neutrals = {}
const monophthongs = {}
const apocopes = []
const collisions = []

for (const record of records) {
    words.push(record["Hîsyêô"])
    neutrals[neutralize(record["Hîsyêô"])] = record["Hîsyêô"]
    const smoothed = monophthongize(record["Hîsyêô"])
    if (smoothed != undefined)
        monophthongs[smoothed] = [...monophthongs[smoothed] ?? [], record["Hîsyêô"]];
    if (![ 'Preposition',
           'Conjunction',
           'Postposition',
           'Interjection'
        ].includes(record["Type"]) &&
        /[oôeêiiuû]/.test(record["Hîsyêô"][0])) {
        apocopes.push(`l${record["Hîsyêô"]}`, `p${record["Hîsyêô"]}`, `e${record["Hîsyêô"]}`);
    }
}

console.log('Reviewing collisions...')
 
for (const smooth in monophthongs) {
    if (words.includes(smooth)) {
        collisionFound('Smoothed', smooth, monophthongs[smooth][0], 0, 0);
    } else if (monophthongs[smooth].length > 1) {
        collisionFound('Smoothed', monophthongs[smooth][0], monophthongs[smooth][1], 0, 0);
    }
}

for (const apocope of apocopes) {
    const wordIndex = words.indexOf(apocope);
    if (wordIndex >= 0) {
        collisionFound('Apocopic', words[wordIndex], `${apocope[0]}'${apocope.slice(1)}`, 0, 0)
    }
}

for (let word of words) {

    // Syllable comparisons
    const matches = word.matchAll(syllableRegex)
    const sylSegments = []
    const sylValues = []
    Array.from(matches).forEach((m) => {
        sylSegments.push(m.groups); sylValues.push(m[0])
    })

    sylSegments.forEach((syllable, i) => {
        let {onset, nucleus, coda} = syllable
        if (!onset) onset = "'"
        if (minPairs[onset]) for (let collider of minPairs[onset]) {
            let collSyl = sylValues.slice()
            collSyl[i] = makeSyllable(collider, nucleus, coda)
            let wordOnsetChanged = collSyl.join('')
            let foundApocope = apocopes.indexOf(wordOnsetChanged)
            if (words.includes(wordOnsetChanged)) {
                collisionFound('Forbidden Pair', word, wordOnsetChanged, hl(collSyl, i), hl(collSyl, i))
            } else if (monophthongs[wordOnsetChanged]?.length > 0) {
                collisionFound('Smoothed Forbidden Pair', word, monophthongs[wordOnsetChanged][0], hl(collSyl, i), hl(collSyl, i))
            } else if (foundApocope != -1) {
                collisionFound('Apocopic Forbidden Pair', word, apocopes[foundApocope], hl(collSyl, i), hl(collSyl, i) + 1)
            } else if (neutralize(wordOnsetChanged) in neutrals) {
                collisionFound('Neutralized Forbidden Pair', word, neutrals[neutralize(wordOnsetChanged)], hl(collSyl, i), hl(collSyl, i))
            }
        }
        for (let collider of minPairs[nucleus]) {
            let collSyl = sylValues.slice()
            collSyl[i] = makeSyllable(onset, collider, coda)
            const nucleChange = collSyl.join('')
            if (words.includes(nucleChange)) collisionFound('Vowel Forbidden Pair', word, nucleChange, 0, 0)
        }
    })

    let priorCoda = undefined
    for (let {onset, _, coda} of sylSegments) {
        // coda-/k/ cannot be followed by onset-/g/
        if (['k',].includes(priorCoda) && ['g',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        // coda-/t/ cannot be followed by onset-/d/ or onset-/ʃ/
        if (['t',].includes(priorCoda) && ['d', 'x',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        // coda-/ t͡ɕ/ cannot be followed by onset-/s/
        if (['c',].includes(priorCoda) && ['s',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        // coda-/s/ cannot be followed by onset-/ʃ/
        if (['s',].includes(priorCoda) && ['x',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        // onset-/h/ cannot exist after any coda
        if (['k','t','s','c','l'].includes(priorCoda) && ['h',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        priorCoda = coda
    }
}

function makeSyllable(collider, nucleus, coda) {
    return `${collider ?? ''}${nucleus ?? ''}${coda ?? ''}`
}

function collisionFound(type, word, collision, locationA, locationB) {
    
    if (!(collisions.includes(`${word}::${collision}`) || collisions.includes(`${collision}::${word}`))) {
        collisions.push(`${word}::${collision}`)
        
        // console.debug(
        //     `Collision between "${word}" and "${collision}" ${chalk.grey(`(priorLength: ${location})`)}`
        // )
    
        const fstA = word.slice(0, locationA)
        const locA = chalk.red(word.slice(locationA, locationA + 1))
        const rstA = word.slice(locationA + 1)
    
        const fstB = collision.slice(0, locationB)
        const locB = chalk.yellow(collision.slice(locationB, locationB + 1))
        const rstB = collision.slice(locationB + 1)
    
        console.log(`${type} Collision: "${fstA}${locA}${rstA}" and "${fstB}${locB}${rstB}"`)

    }

}

function priorLength(syllables, i) {
    let count = 0
    for (const syllable of syllables) count = count + syllable.length;
    return count
}

/** 
 * Find the location to highlight in the console.log message
 */
function hl(syl, i) {
    return priorLength(syl.slice(0, i))
}



function monophthongize(word) {
    const smoothL = (ls, i) => {
        let result = `${ls.slice(0,i+1).join('')}${ls.slice(i+2).join('')}`;
        // console.log(`word: ${word}\tresult: ${result}`);
        return result
    }
    const smoothR = (ls, i) => {
        let result = `${ls.slice(0,i).join('')}${ls.slice(i+1).join('')}`;
        // console.log(`word: ${word}\tresult: ${result}`);
        return result
    }
    const letters = word.split('');
    for (let index = 0; index < letters.length; index++) {
        switch(`${letters[index]}${letters[index + 1]}`) {
        case 'oo': console.error(`Illegal syllable in ${word}`)
        case 'oô': return smoothL(letters, index)
        case 'oe': console.error(`Illegal syllable in ${word}`)
        case 'oê': return smoothL(letters, index)
        case 'oi': return smoothL(letters, index)
        case 'oî': return smoothL(letters, index)
        case 'ou': console.error(`Illegal syllable in ${word}`)
        case 'oû': return smoothL(letters, index)
        
        case 'ôo': return smoothL(letters, index)
        case 'ôô': console.error(`Illegal syllable in ${word}`)
        case 'ôe': return smoothL(letters, index)
        case 'ôê': return smoothL(letters, index)
        case 'ôi': return smoothL(letters, index)
        case 'ôî': return smoothL(letters, index)
        case 'ôu': return smoothL(letters, index)
        case 'ôû': return smoothL(letters, index)
        
        case 'eo': console.error(`Illegal syllable in ${word}`)
        case 'eô': return smoothL(letters, index)
        case 'ee': console.error(`Illegal syllable in ${word}`)
        case 'eê': console.error(`Illegal syllable in ${word}`)
        case 'ei': return smoothL(letters, index)
        case 'eî': return smoothL(letters, index)
        case 'eu': console.error(`Illegal syllable in ${word}`)
        case 'eû': return smoothL(letters, index)

        case 'êo': return smoothR(letters, index)
        case 'êô': return smoothR(letters, index)
        case 'êe': console.error(`Illegal syllable in ${word}`)
        case 'êê': console.error(`Illegal syllable in ${word}`)
        case 'êi': return smoothL(letters, index)
        case 'êî': return smoothL(letters, index)
        case 'êu': return smoothR(letters, index)
        case 'êû': return smoothR(letters, index)
        
        case 'io': console.error(`Illegal syllable in ${word}`)
        case 'iô': return smoothR(letters, index)
        case 'ie': console.error(`Illegal syllable in ${word}`)
        case 'iê': console.error(`Illegal syllable in ${word}`)
        case 'ii': console.error(`Illegal syllable in ${word}`)
        case 'iî': console.error(`Illegal syllable in ${word}`)
        case 'iu': console.error(`Illegal syllable in ${word}`)
        case 'iû': return smoothR(letters, index)

        case 'îo': return smoothR(letters, index)
        case 'îô': return smoothR(letters, index)
        case 'îe': return smoothR(letters, index)
        case 'îê': return smoothR(letters, index)
        case 'îi': return smoothR(letters, index)
        case 'îî': console.error(`Illegal syllable in ${word}`)
        case 'îu': return smoothR(letters, index)
        case 'îû': return smoothR(letters, index)

        case 'uo': console.error(`Illegal syllable in ${word}`)
        case 'uô': return smoothR(letters, index)
        case 'ue': console.error(`Illegal syllable in ${word}`)
        case 'uê': return smoothL(letters, index)
        case 'ui': console.error(`Illegal syllable in ${word}`)
        case 'uî': return smoothL(letters, index)
        case 'uu': console.error(`Illegal syllable in ${word}`)
        case 'uû': return smoothL(letters, index)
        
        case 'ûo': return smoothR(letters, index)
        case 'ûô': return smoothR(letters, index)
        case 'ûe': return smoothR(letters, index)
        case 'ûê': return smoothR(letters, index)
        case 'ûi': return smoothR(letters, index)
        case 'ûî': return smoothR(letters, index)
        case 'ûu': return smoothR(letters, index)
        case 'ûû': console.error(`Illegal syllable in ${word}`)
        }
    }
}
