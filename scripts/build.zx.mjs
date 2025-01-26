import csv from 'neat-csv';

import {capitalize} from './helpers.mjs';

let tags = "";
const words = {}
const snippets = {}
const docTmpl = (w, i) => `---
id: ${w['Hisyëö']}
slug: ${w['Hisyëö']}
title: ${capitalize(w['Hisyëö'])}
sidebar_position: ${i}
tags: [${w['Hisyëö']}, ${w['Type']}, ${w['Family']}]
description: ${w['Meaning']} § ${w['Type']}
---

### ${w['Hisyëö']}&emsp;<span kind="abugida">${w['ɂ́ɟɀʇɽʃ']}</span>

*${w['Meaning']}* **§** ${w['Type']}

**IPA**: ${w['Actual IPA']}

**Verb**: ${w['Verb']}

**Noun**: ${w['Noun']}

**Modifier**: ${w['Modifier']}

<details>
    <summary>Origin</summary>
    ${w['Origin']} ${w['Origin IPA']}<br/>
    <em>${w['Family']} Language Family</em>
</details>`

const tagTmpl = (w) => `${w['Hisyëö']}:
    label: ${w['Hisyëö']}
    description: ${w['Meaning']}
`

console.log('Clearing existing files...')
const existingFiles = await glob([
    './docs/words/**/*.md',
    './docs/words/**/*.mdx',
    './docs/tags.yaml',
])
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

process.stdout.write(`Outputting words to templates and JSON prep...`)
await Promise.all(records.map(async (data, idx) => {
    try {
        process.stdout.write(`.`)
        
        await fs.outputFile(`./docs/words/${data['Hisyëö'][0]}/${data['Hisyëö']}.md`, docTmpl(data, idx))

        tags = `${tags}${tagTmpl(data)}`

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
            origin_ipa: data["Origin IPA"],
            family: data["Family"],
            group: data["Group"],
            actual_ipa: data['Actual IPA'],
            length: data["Length"],
            rank: data["Rank"],
        }
    } catch (err) {
        console.error(err)
    }

}))
console.log('')

console.log(`Outputting tags file...`)
try {
    await fs.outputFile(`./docs/tags.yml`, tags)
} catch (err) {
    console.error(err)
}

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