import csv from 'neat-csv';

const words = []
const snippets = {}
const template = (w) => `---
id: ${w['Hisyëö']}
slug: ${w['Hisyëö']}
title: ${w['Hisyëö']}
hoverText: ${w['Meaning']} § ${w['Type']}
---

### ${w['Meaning']} § ${w['Type']}

**Verb**: ${w['Verb']}

**Noun**: ${w['Noun']}

**Modifier**: ${w['Modifier']}

${w['Origin']} ${w['IPA']}

*${w['Family']} Language Family*`

console.log('Clearing existing files...')
const existingFiles = await glob(['./docs/words/**/*.md', './docs/words/**/*.mdx'])
try {
    await $`rm ${existingFiles}`
    console.log('Cleared existing files!')
} catch (err) {
    console.error(err)
}

console.log('Parsing csv...')
const file = await fs.readFile('./static/words.csv', 'utf8')
const records = await csv(file, {
    delimiter: ',',
    columns: true,
})

process.stdout.write(`Outputting word files...`)
for (let data of records) {
    try {
        process.stdout.write(`.`)
        await fs.outputFile(`./docs/words/${data['Hisyëö'][0]}/${data['Hisyëö']}.md`, template(data))
        snippets[data['Hisyëö']] = {
            scope: "markdown",
            prefix: data['Hisyëö'],
            body: `%%${data['Hisyëö']}|${data['Hisyëö']}%%`,
            description: data['Meaning']
        }
    } catch (err) {
        console.error(err)
    }
}
console.log('')

console.log(`Outputting snippets file...`)
try {
    await fs.outputFile(`./.vscode/words.code-snippets`, JSON.stringify(snippets))
} catch (err) {
    console.error(err)
}