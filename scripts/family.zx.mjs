import csv from 'neat-csv'

const wordsFile = await fs.readFile('./static/words.csv', 'utf8')

const syllableRegex = /(?<onset>[ꞌhkgtcxsdzbfmnlwy])?(?<nucleus>[oôeêiîuû])(?<coda>[tkscnl](?![oôeêiîuû]))?/gi

const records = await csv(wordsFile, {
    delimiter: ',',
    columns: true,
})

const sourceFile = await fs.readFile(argv._[0], 'utf8')

const tokens = [...sourceFile.matchAll(/[a-zôêîû]+/gi)]
    .filter(t => !(t == undefined || t == null || t == ' ' || t == '\n' || t == '\r'))
    .map(t => t[0])

const counts = {}
let wordCount = 0

for (let token of tokens) {
    try {
        const family = records.find(r => r['Hîsyêô'] == token).Family
        counts[family] = (counts[family] ?? 0) + 1
        wordCount++
    } catch {}
}

console.log('Word Count:', wordCount, '\n')

for (let family of Object.entries(counts).sort((a, b) => b[1] - a[1]) ) {
    console.log(
        family[0],
        '=',
        family[1],
        `(${ (family[1] / wordCount * 100).toFixed(2) }%)`
    )
}




