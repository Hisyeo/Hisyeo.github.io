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
await Promise.all(records.map(async (data, idx) => {
    try {
        process.stdout.write(`.`)
        await fs.outputFile(`./docs/words/${data['Hisyëö'][0]}/${data['Hisyëö']}.md`, template(data, idx))
        snippets[`${data['Hisyëö']} latin`] = {
            scope: "markdown,mdx",
            prefix: data['Hisyëö'],
            body: `%%${data['Hisyëö']}@${data['Hisyëö']}%%`,
            description: data['Meaning']
        }
        snippets[`${data['Hisyëö']} onhukızgo`] = {
            scope: "markdown,mdx",
            prefix: data['Hisyëö'],
            body: `%%${data['ɂ́ɟɀʇɽʃ']}@${data['Hisyëö']}%%`,
            description: data['Meaning']
        }
    } catch (err) {
        console.error(err)
    }

}))
console.log('')

console.log(`Outputting snippets file...`)
try {
    // console.log(snippets)
    snippets["Latin Opügido Tabs"] = {
        scope: "markdown,mdx",
        prefix: "lot",
        body: `<Tabs groupId="popöun-zıkto">
    <TabItem value="latin" label="Latin" default>
        $1
    </TabItem>
    <TabItem value="opügido" label="ɽʋʄꜿɟʌ">
        $2
    </TabItem>
</Tabs>$0`
    }
    await fs.outputFile(`./.vscode/words.code-snippets`, JSON.stringify(snippets))
} catch (err) {
    console.error(err)
}