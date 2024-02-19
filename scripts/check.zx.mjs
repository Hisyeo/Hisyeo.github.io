import csv from 'neat-csv';

const file = await fs.readFile('./static/words.csv', 'utf8')

const words = []

const minPairs = {
    p:   ['v', 'm'],
    k:   ['h', 'g'],
    g:   ['h', 'k', 'd'],
    t:   ['d', 'z', 's', 'n'],
    z:   ['ȷ', 't'],
    d:   ['t', 'g'],
    ȷ:   ['z'],
    s:   ['v', 'z', 't'],
    x:   ['s', 'v'],
    v:   ['s', 'x', 'p', 'w'],
    h:   ['ꞌ', 'k', 'g'],
    m:   ['n', 'p'],
    n:   ['m', 't'],
    'ꞌ': ['h'],
    w:   ['ꞌ', 'v'],
    l:   ['y'],
    y:   ['ꞌ', 'l'],
    // Vowels
    o:   ['u'],           ö:   ['ü', 'u'],
    e:   ['ı', 'u'],      ë:   ['ı', 'i'],
    ı:   ['o', 'i', 'ë'], i:   ['ë', 'ı'],
    u:   ['o', 'ö', 'e'], ü:   ['ö'],
}

// let badSyllablesIdentified = false
// const badSyllablesMessage = "Some words have improper syllable structure"
const syllableRegex = /(?<onset>[ꞌhkgtzxsdȷpvmnlwy])?(?<nucleus>[oöeëıiuü])(?<coda>[tksznl](?![oöeëıiuü]))?/gi

const records = await csv(file, {
    delimiter: ',',
    columns: true,
})

console.log('Grabbing words from records...')

for (const record of records) {
    words.push(record["Hisyëö"])
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
            if (onsetChange[0] == 'q') onsetChange = onsetChange.slice(1)
            if (words.includes(onsetChange)) collisionFound(word, onsetChange)
        }
        for (let collider of minPairs[nucleus]) {
            let collSyl = sylValues.slice()
            collSyl[i] = makeSyllable(onset, collider, coda)
            const nucleChange = collSyl.join('')
            if (words.includes(nucleChange)) collisionFound(word, nucleChange)
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
        if (['z',].includes(priorCoda) && ['s',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        // coda-/s/ cannot be followed by onset-/ʃ/
        if (['s',].includes(priorCoda) && ['x',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        // onset-/h/ cannot exist after any coda
        if (['k','t','s','z','l'].includes(priorCoda) && ['h',].includes(onset)) {
            console.log(`Bad syllable boundary: ${word}`)
        }
        priorCoda = coda
    }
}

function makeSyllable(collider, nucleus, coda) {
    return `${collider ?? ''}${nucleus ?? ''}${coda ?? ''}`
}

function collisionFound(word, collision) {
    console.log(`Collision between "${word}" and "${collision}"`)
}

