import csv from 'neat-csv'

const file = await fs.readFile(
    './static/words.csv',
    'utf8'
)

const records = await csv(file, {
    delimiter: ',',
    columns: true,
})

const re = /(?<=@)[\wëıöü]+(?=%%)/g

/**
 * Parse the line and return an array of words
 */
function parse(line) {
    const matches = line.match(re)
    return matches
}

/** 
 * Find the word and return the respell value
 */
function respell(word) {
    const r = records.find(({"Hisyëö": w}) => w == word)
    return r['Hisyëö IPA']
}

/** 
 * Find each word and respell it
 */
function replace(words) {
    return words.map(w => respell(w))
}

$.quote = t => t
$`echo "(${replace(parse(argv._[0])).join(' ')})" | xclip`

