import csv from 'neat-csv';

import {capitalize} from './helpers.mjs';

const words = {}
const snippets = {}
const template = (w, i) => `---
id: ${w['Hisyëö']}
slug: ${w['Hisyëö']}
title: ${capitalize(w['Hisyëö'])}
sidebar_position: ${i}
hoverText: ${w['Meaning']} § ${w['Type']}
---

### ${w['Hisyëö']}&emsp;<span kind="abugida">${w['ɂ́ɟɀʇɽʃ']}</span>

*${w['Meaning']}* **§** ${w['Type']}

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
await Promise.all(records.map(async (data, idx) => {
    try {
        process.stdout.write(`.`)
        await fs.outputFile(`./docs/words/${data['Hisyëö'][0]}/${data['Hisyëö']}.md`, template(data, idx))
        snippets[`${data['Hisyëö']}`] = {
            scope: "markdown,mdx,fountain",
            prefix: data['Hisyëö'],
            body: `${data['Hisyëö']}`,
            description: data['Meaning'],
        }
        words[data["Hisyëö"]] = {
            index: idx,
            abugida: data["ɂ́ɟɀʇɽʃ"],
            latin: data["Hisyëö"],
            meaning: data["Meaning"],
            verb: data["Verb"],
            noun: data["Noun"],
            modifier: data["Modifier"],
            frequentative: data["Frequentative"],
            type: data["Type"],
            kokanu: data["Kokanu"],
            origin: data["Origin"],
            ipa: data["IPA"],
            family: data["Family"],
            group: data["Group"],
            length: data["Length"],
            rank: data["Rank"],
        }
    } catch (err) {
        console.error(err)
    }

}))
console.log('')

console.log(`Outputting snippets file...`)
try {
    await fs.outputFile(`./.vscode/words.code-snippets`, JSON.stringify(snippets, null, " "))
} catch (err) {
    console.error(err)
}

console.log(`Outputting static json file...`)
try {
    await fs.outputFile(`./static/words.json`, JSON.stringify(words, null, " "))
} catch (err) {
    console.error(err)
}