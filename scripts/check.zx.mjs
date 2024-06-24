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
const collisions = []

for (const record of records) {
    words.push(record["Hisyëö"])
    neutrals.push(neutralize(record["Hisyëö"]))   
}

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
            let onsetChange = collSyl.join('')
            if (words.includes(onsetChange)) {
                collisionFound('Consonant', word, onsetChange, hl(collSyl, i))
            } else {
                let collID = neutrals.findIndex(w => w == neutralize(onsetChange))
                if (collID != -1) collisionFound('Neutralized', word, words[collID], hl(collSyl, i))
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

function collisionFound(type, word, collision, location) {
    
    if (!(collisions.includes(`${word}::${collision}`) || collisions.includes(`${collision}::${word}`))) {
        collisions.push(`${word}::${collision}`)
        
        // console.debug(
        //     `Collision between "${word}" and "${collision}" ${chalk.grey(`(priorLength: ${location})`)}`
        // )
    
        const fst1 = word.slice(0, location)
        const loc1 = chalk.red(word.slice(location, location + 1))
        const rst1 = word.slice(location + 1)
    
        const fst2 = collision.slice(0, location)
        const loc2 = chalk.yellow(collision.slice(location, location + 1))
        const rst2 = collision.slice(location + 1)
    
        console.log(`${type} Collision: "${fst1}${loc1}${rst1}" and "${fst2}${loc2}${rst2}"`)

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
    return word.split('').map((c) => neuVowels[c] ?? c).join("")
}
