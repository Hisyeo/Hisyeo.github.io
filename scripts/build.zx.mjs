import csv from 'neat-csv';

import {capitalize, neutralize} from './helpers.mjs';

import { quotePowerShell } from 'zx'

$.quote = quotePowerShell

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

const titleCase = w => `${capitalize(w[0])}${w.slice(1)}`

const lexerTmpl = (words) => `// This file is generated via the Hîsyêô words.csv
lexer grammar HisyeoWordLexer;

${
    words.map(w =>
        `${titleCase(neutralize(w.latin, true))}:\t'${w.latin}';`
    ).join("\n")
}`

const spacer = "\n    | "

const parserTmpl = (words) => `// This file is generated via the Hîsyêô words.csv
parser grammar HisyeoWordParser;

options {
    tokenVocab=HisyeoLexer;
}

postposition
    : ${
        words.filter(w => w.type == 'Postposition').map(w =>
            titleCase(neutralize(w.latin, true))
        ).join(spacer)
    }
    ;

pronoun
    : ${
        words.filter(w => w.type == 'Pronoun').map(w =>
            titleCase(neutralize(w.latin, true))
        ).join(spacer)
    }
    ;

rawVerbs
    : ${
        words.filter(w => w.type == 'Verb').map(w =>
            titleCase(neutralize(w.latin, true))
        ).join(spacer)
    }
    ;

rawNouns
    : ${
        words.filter(w => w.type == 'Noun').map(w =>
            titleCase(neutralize(w.latin, true))
        ).join(spacer)
    }
    ;

rawModifiers
    : ${
        words.filter(w => w.type == 'Adjective').map(w =>
            titleCase(neutralize(w.latin, true))
        ).join(spacer)
    }
    ;

connector
    : ${
        words.filter(w => w.type == 'Conjunction').map(w =>
            titleCase(neutralize(w.latin, true))
        ).join(spacer)
    }
    ;

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

console.log(`Outputting grammar files...`)
try {
    await fs.outputFile(`./static/grammar/HisyeoWordLexer.g4`, lexerTmpl(Object.values(words)))
    await fs.outputFile(`./static/grammar/HisyeoWordParser.g4`, parserTmpl(Object.values(words)))
} catch (err) {
    console.error(err)
}