import csv from 'neat-csv';

const words = []
const snippets = {}
const template = (w, i) => `---
id: ${w['Hisyëö']}
slug: ${w['Hisyëö']}
title: ${w['Hisyëö']}
sidebar_position: ${i}
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
records.forEach(async (data, idx) => {
    try {
        process.stdout.write(`.`)
        await fs.outputFile(`./docs/words/${data['Hisyëö'][0]}/${data['Hisyëö']}.md`, template(data, idx))
        snippets[data['Hisyëö']] = {
            scope: ["markdown", "mdx"],
            prefix: data['Hisyëö'],
            body: `%%${data['Hisyëö']}|${data['Hisyëö']}%%`,
            description: data['Meaning']
        }
        snippets[`${data['Hisyëö']}_onhukızgo`] = {
            scope: ["markdown", "mdx"],
            prefix: data['Hisyëö'],
            body: `%%${data['ɂ́ɟɀʇɽʃ']}|${data['Hisyëö']}%%`,
            description: data['Meaning']
        }
    } catch (err) {
        console.error(err)
    }

})
console.log('')

console.log(`Outputting snippets file...`)
try {
    await fs.outputFile(`./.vscode/words.code-snippets`, JSON.stringify(snippets))
} catch (err) {
    console.error(err)
}