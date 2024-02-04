import { parse } from 'csv-parse';

const file = await fs.readFile('./static/words.csv', 'utf8')

const words = []

const parser = parse({
    delimiter: ',',
    columns: true,
})

const template = (w) => `---
id: ${w['Hisyëö']}
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

const snippets = {}

parser.on('readable', async () => {
    console.log('Saturating markdown templates...')
    let record; while ((record = parser.read()) !== null) {
        try {
            await fs.outputFile(`./docs/words/${record['Hisyëö'][0]}/${record['Hisyëö']}.md`, template(record))
            snippets[record['Hisyëö']] = {
                scope: "markdown",
                prefix: record['Hisyëö'],
                body: `%%${record['Hisyëö']}|${record['Hisyëö']}%%`,
                description: record['Meaning']
            }
        } catch (err) {
            console.error(err)
        }
    }
})
parser.on('error', err => { console.error(err.message) })
parser.on('end', async () => {
    try {
        await fs.outputFile(`./.vscode/words.code-snippets`, JSON.stringify(snippets))
    } catch (err) {
        console.error(err)
    }
    console.log('Done!')
})

try {
    await $`rm ${existingFiles}`
    console.log('Cleared existing files!')
} catch (err) {
    console.error(err)
}

parser.write(file)
parser.end()