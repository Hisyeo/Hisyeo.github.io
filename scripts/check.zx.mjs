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
const monophthongs = {}
const apocopes = []
const collisions = []

for (const record of records) {
    words.push(record["Hisyëö"])
    neutrals.push(neutralize(record["Hisyëö"]))
    monophthongs[monophthongize(record["Hisyëö"])] = record["Hisyëö"]
    if (/[oöeëıiuü]/.test(record["Hisyëö"][0])) {
        apocopes.push(`l${record["Hisyëö"]}`);
        apocopes.push(`p${record["Hisyëö"]}`);
    }
}

console.log('Reviewing collisions...')
    
for (let word of words) {


    // Syllable comparisons
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
            } else if (monophthongs[wordOnsetChanged]) {
                collisionFound('Smoothed', word, monophthongs[wordOnsetChanged], hl(collSyl, i), hl(collSyl, i))
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
    const smoothL = (ls, i) => `${ls.slice(0,i).join('')}${ls.slice(i+1).join('')}`;
    const smoothR = (ls, i) => `${ls.slice(0,i+1).join('')}${ls.slice(i+2).join('')}`;
    const letters = word.split('');
    for (let index = 0; index < letters.length; index++) {
        switch(`${letters[index]}${letters[index + 1]}`) {
        case 'oo': console.error(`Illegal syllable in ${word}`)
        case 'oö': return smoothR(letters, index)
        case 'oe': console.error(`Illegal syllable in ${word}`)
        case 'oë': return smoothR(letters, index)
        case 'oı': return smoothR(letters, index)
        case 'oi': return smoothR(letters, index)
        case 'ou': console.error(`Illegal syllable in ${word}`)
        case 'oü': return smoothR(letters, index)
        
        case 'öo': return smoothR(letters, index)
        case 'öö': console.error(`Illegal syllable in ${word}`)
        case 'öe': return smoothR(letters, index)
        case 'öë': return smoothR(letters, index)
        case 'öı': return smoothR(letters, index)
        case 'öi': return smoothR(letters, index)
        case 'öu': return smoothR(letters, index)
        case 'öü': return smoothR(letters, index)
        
        case 'eo': console.error(`Illegal syllable in ${word}`)
        case 'eö': return smoothR(letters, index)
        case 'ee': console.error(`Illegal syllable in ${word}`)
        case 'eë': console.error(`Illegal syllable in ${word}`)
        case 'eı': return smoothR(letters, index)
        case 'ei': return smoothR(letters, index)
        case 'eu': console.error(`Illegal syllable in ${word}`)
        case 'eü': return smoothR(letters, index)

        case 'ëo': return smoothR(letters, index)
        case 'ëö': return smoothR(letters, index)
        case 'ëe': console.error(`Illegal syllable in ${word}`)
        case 'ëë': console.error(`Illegal syllable in ${word}`)
        case 'ëı': return smoothR(letters, index)
        case 'ëi': return smoothR(letters, index)
        case 'ëu': return smoothR(letters, index)
        case 'ëü': return smoothR(letters, index)
        
        case 'ıo': console.error(`Illegal syllable in ${word}`)
        case 'ıö': return smoothL(letters, index)
        case 'ıe': console.error(`Illegal syllable in ${word}`)
        case 'ıë': console.error(`Illegal syllable in ${word}`)
        case 'ıı': console.error(`Illegal syllable in ${word}`)
        case 'ıi': console.error(`Illegal syllable in ${word}`)
        case 'ıu': console.error(`Illegal syllable in ${word}`)
        case 'ıü': return smoothL(letters, index)

        case 'io': return smoothL(letters, index)
        case 'iö': return smoothL(letters, index)
        case 'ie': return smoothL(letters, index)
        case 'ië': return smoothL(letters, index)
        case 'iı': return smoothL(letters, index)
        case 'ii': console.error(`Illegal syllable in ${word}`)
        case 'iu': return smoothL(letters, index)
        case 'iü': return smoothL(letters, index)

        case 'uo': console.error(`Illegal syllable in ${word}`)
        case 'uö': return smoothR(letters, index)
        case 'ue': console.error(`Illegal syllable in ${word}`)
        case 'uë': return smoothR(letters, index)
        case 'uı': console.error(`Illegal syllable in ${word}`)
        case 'ui': return smoothR(letters, index)
        case 'uu': console.error(`Illegal syllable in ${word}`)
        case 'uü': return smoothR(letters, index)
        
        case 'üo': return smoothL(letters, index)
        case 'üö': return smoothL(letters, index)
        case 'üe': return smoothL(letters, index)
        case 'üë': return smoothL(letters, index)
        case 'üı': return smoothL(letters, index)
        case 'üi': return smoothL(letters, index)
        case 'üu': return smoothL(letters, index)
        case 'üü': console.error(`Illegal syllable in ${word}`)
        }
    }
}
