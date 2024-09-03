import csv from 'neat-csv'

const file = await fs.readFile('./static/words.csv', 'utf8')

const neuVowels = {
    o: 'a', ö: 'o',
    e: 'e', ë: 'i',
    ı: 'e', i: 'i',
    u: 'a', ü: 'u',
}

const minPairs = {
    p:   ['v', 't'],
    k:   ['h', 'g'],
    g:   ['k', 'd'],
    t:   ['d', 'c', 's', 'n', 'p'],
    c:   ['z', 't'],
    d:   ['t', 'g', 'z'],
    z:   ['c', 'd'],
    s:   ['c', 't'],
    x:   ['s', 'c'],
    v:   ['p', 'w'],
    h:   ['ꞌ', 'k'],
    m:   ['n'],
    n:   ['m'],
    'ꞌ': ['h', 'w', 'l', 'y'], // adding "l" for verb contractions
    w:   ['ꞌ', 'v', 'l'],
    l:   ['ꞌ', 'y', 'w'],
    y:   ['ꞌ', 'l'],
    // Vowels
    o:   ['u'],           ö:   ['ü', 'u'],
    e:   ['ı', 'u', 'ë'], ë:   ['ı', 'i', 'e'],
    ı:   ['o', 'i', 'ë'], i:   ['ë', 'ı'],
    u:   ['o', 'ö', 'e'], ü:   ['ö'],
}

// let badSyllablesIdentified = false
// const badSyllablesMessage = "Some words have improper syllable structure"
const syllableRegex = /(?<onset>[ꞌhkgtcxsdzpvmnlwy])?(?<nucleus>[oöeëıiuü])(?<coda>[tkscnl](?![oöeëıiuü]))?/gi

const records = await csv(file, {
    delimiter: ',',
    columns: true,
})

console.log('Grabbing words from records...')

const words = []
const neutrals = []
const monophthongs = []
const apocopes = []
const collisions = []

for (const record of records) {
    words.push(record["Hisyëö"])
    neutrals.push(neutralize(record["Hisyëö"]))
    monophthongs.push(monophthongize(record["Hisyëö"]))
    if (/[oöeëıiuü]/.test(record["Hisyëö"][0])) {
        apocopes.push(`l${record["Hisyëö"]}`);
        apocopes.push(`p${record["Hisyëö"]}`);
    }
}

console.log(monophthongs.filter(m => m));

console.log('Reviewing collisions...')
    
for (let word of words) {
    const matches = word.matchAll(syllableRegex)
    const sylSegments = []
    const sylValues = []
    Array.from(matches).forEach((m) => {
        sylSegments.push(m.groups); sylValues.push(m[0])
    })
    // if (sylValues.filter((s) => s.length < 2).length > 1) {
    //     if (!badSyllablesIdentified) {
    //         console.log(badSyllablesMessage)
    //         badSyllablesIdentified = true
    //     }
    //     console.log(`word:${word}\tmatches: ${sylValues}`)
    // }
    sylSegments.forEach((syllable, i) => {
        let {onset, nucleus, coda} = syllable
        if (!onset) onset = "'"
        if (minPairs[onset]) for (let collider of minPairs[onset]) {
            let collSyl = sylValues.slice()
            collSyl[i] = makeSyllable(collider, nucleus, coda)
            let wordOnsetChanged = collSyl.join('')
            if (words.includes(wordOnsetChanged)) {
                collisionFound('Consonant', word, wordOnsetChanged, hl(collSyl, i), hl(collSyl, i))
            } else if (monophthongs.includes(wordOnsetChanged)) {
                collisionFound('Smoothed', word, wordOnsetChanged, hl(collSyl, i), hl(collSyl, i))
            } else if (apocopes.includes(wordOnsetChanged)) {
                collisionFound('Apocopic', word, `${wordOnsetChanged[0]}'${wordOnsetChanged.slice(1)}`, hl(collSyl, i), hl(collSyl, i) + 1)
            } else if (neutrals.findIndex(w => w == neutralize(wordOnsetChanged)) != -1) {
                collisionFound('Neutralized', word, wordOnsetChanged, hl(collSyl, i), hl(collSyl, i))
            }
        }
        for (let collider of minPairs[nucleus]) {
            let collSyl = sylValues.slice()
            collSyl[i] = makeSyllable(onset, collider, coda)
            const nucleChange = collSyl.join('')
            if (words.includes(nucleChange)) collisionFound('Vowel', word, nucleChange, 0)
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
    for (const syllable of syllables) count = count + syllable.length
    return count
}

/** 
 * Find the location to highlight in the console.log message
 */
function hl(syl, i) {
    return priorLength(syl.slice(0, i))
}

function neutralize(word) {
    return word.split('').map((c) => neuVowels[c] ?? c).join('')
}

function monophthongize(word) {
    const letters = word.split('');
    for (let index = 0; index < letters.length; index++) {
        const [letterA, letterB] = [letters[index], letters[index + 1]];
        // console.log(`Letter A: ${letterA}\tLetter B: ${letterB}`);
        if (false) {
        
        } else if (letterA == 'o' && letterB == 'o') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'o' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'o' && letterB == 'e') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'o' && letterB == 'ë') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'o' && letterB == 'ı') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'o' && letterB == 'i') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'o' && letterB == 'u') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'o' && letterB == 'ü') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        
        } else if (letterA == 'ö' && letterB == 'o') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ö' && letterB == 'ö') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ö' && letterB == 'e') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ö' && letterB == 'ë') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ö' && letterB == 'ı') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ö' && letterB == 'i') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ö' && letterB == 'u') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ö' && letterB == 'ü') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        
        } else if (letterA == 'e' && letterB == 'o') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'e' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'e' && letterB == 'e') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'e' && letterB == 'ë') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'e' && letterB == 'ı') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'e' && letterB == 'i') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'e' && letterB == 'u') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'e' && letterB == 'ü') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`

        } else if (letterA == 'ë' && letterB == 'o') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ë' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ë' && letterB == 'e') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ë' && letterB == 'ë') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ë' && letterB == 'ı') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ë' && letterB == 'i') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ë' && letterB == 'u') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ë' && letterB == 'ü') {


        } else if (letterA == 'ı' && letterB == 'o') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ı' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ı' && letterB == 'e') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ı' && letterB == 'ë') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ı' && letterB == 'ı') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ı' && letterB == 'i') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ı' && letterB == 'u') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'ı' && letterB == 'ü') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`

        } else if (letterA == 'i' && letterB == 'o') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'i' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'i' && letterB == 'e') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'i' && letterB == 'ë') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'i' && letterB == 'ı') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'i' && letterB == 'i') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'i' && letterB == 'u') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'i' && letterB == 'ü') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`

        } else if (letterA == 'u' && letterB == 'o') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'u' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'u' && letterB == 'e') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'u' && letterB == 'ë') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'u' && letterB == 'ı') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'u' && letterB == 'i') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'u' && letterB == 'u') {
            console.error(`Illegal syllable in ${word}`)
        } else if (letterA == 'u' && letterB == 'ü') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        

        } else if (letterA == 'ü' && letterB == 'o') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'ö') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'e') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'ë') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'ı') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'i') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'u') {
            return `${letters.slice(0,index+1).join('')}${letters.slice(index+2).join('')}`
        } else if (letterA == 'ü' && letterB == 'ü') {
            console.error(`Illegal syllable in ${word}`)
        }
    }
}
