import csv from 'neat-csv';

import {capitalize} from './helpers.mjs';

let tags = "";
const words = {}
const snippets = {}
const docTmpl = (w, i) => `---
id: ${w['Hîsyêô']}
slug: ${w['Hîsyêô']}
title: ${capitalize(w['Hîsyêô'])}
sidebar_position: ${i}
tags: [${w['Hîsyêô']}, ${w['Type']}, ${w['Family']}, ${w['Group'].split(':')[0].split(' ')[0]}, ${w['Group'].split(':')[0]}]
description: ${w['Meaning']} § ${w['Type']}
---

### ${w['Hîsyêô']}&emsp;<span kind="abugida">${w['ɂ́ɟɀʇɽʃ']}</span>

*${w['Meaning']}* **§** [${w['Type']}](../../tags/${w['Type']})

**IPA**: ${w['Actual IPA']}

**Verb**: ${w['Verb']}

**Noun**: ${w['Noun']}

**Modifier**: ${w['Modifier']}

<details>
    <summary>Origin</summary>
    ${w['Origin']} ${w['Origin IPA']}<br/>
    <em>${w['Family']} Language Family</em>
</details>`

const tagTmpl = (w) => `${w['Hîsyêô']}:
    label: ${w['Hîsyêô']}
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
        
        await fs.outputFile(`./docs/words/${data['Hîsyêô'][0]}/${data['Hîsyêô']}.md`, docTmpl(data, idx))

        tags = `${tags}${tagTmpl(data)}`

        snippets[`${data['Hîsyêô']}`] = {
            scope: "markdown,mdx,fountain",
            prefix: data['Hîsyêô'],
            body: `${data['Hîsyêô']}`,
            description: data['Meaning'],
        }
        words[data["Hîsyêô"]] = {
            index: idx,
            abugida: data["ɂ́ɟɀʇɽʃ"],
            latin: data["Hîsyêô"],
            syllabary: data["Syllabary"],
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