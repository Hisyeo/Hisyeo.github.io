---
sidebar_position: 1
---

# Phonology

Docusaurus can manage multiple versions of your docs.


### Consonants

Hisyëö has 16 consonants and 1 null consonant which is necessary for the
alphasyllabary but you can optionally include a ⟨ ꞌ ⟩ character in Latin
representations too.

| Hisyëö  | Latin | IPA | Transliteration Sources                                        |
|:-------:|:-----:|:------------:|----------------------------------------------------------------|
|   ⟨ɽ⟩   | ⟨ ꞌ ⟩ |      / . /    | glottal stops & hiatus: ʔ .                                 |
|   ⟨ɂ⟩   |  ⟨h⟩  |     / x /    | back fricatives: x χ ʁ ʀ ħ ʕ h ɦ ʢ ʜ                        |
|   ⟨ɔ⟩   |  ⟨k⟩  |     / k /    | voiceless back plosives: k q c                              |
|   ⟨ꜿ⟩   |  ⟨g⟩  |     / g /    | voiced back plosives: g ɢ ʡ ɣ                               |
|   ⟨c⟩   | ⟨ t ⟩ |     / t /    | voiceless front plosives: t ʈ                               |
|   ⟨ꞇ⟩   |  ⟨z⟩  |    / t͡ɕ /    | voiceless affricates: t͡s  t͡ʃ  t͡ɕ  ʈ͡ʂ ɧ                      |
|   ⟨ɐ⟩   |  ⟨s⟩  |     / s /    | alveolar sibilants: s z                                     |
|   ⟨ɋ⟩   |  ⟨x⟩  |     / ʃ /    | palatal fricatives: ʃ ʒ ʂ ʐ ç ɕ ʑ                           |
|   ⟨ʌ⟩   |  ⟨d⟩  |     / d /    | voiced alveolar plosives: d ɖ                               |
|   ⟨ⱴ⟩   | ⟨ ȷ ⟩ |    / d͡ʑ /    | voiced affricates: d͡z d͡ʒ d͡ʑ ɖ͡ʐ ɟ                            |
|   ⟨ʋ⟩   |  ⟨p⟩  |     / p /    | labial plosives:  b p                                       |
|   ⟨ɤ⟩   |  ⟨v⟩  |     / v /    | labio-dental fricatives: ɸ β f v θ ð                        |
|   ⟨ƶ⟩   |  ⟨m⟩  |     / m /    | labial nasals: m ɱ                                          |
|   ⟨ƨ⟩   |  ⟨n⟩  |     / n /    | other nasals:  n ɳ ɲ ŋ ɴ                                    |
|   ⟨ʒ⟩   |  ⟨w⟩  |     / w /    | labial approximants: w ɥ ʋ                                  |
|   ⟨ʓ⟩   | ⟨ l ⟩ |     / l /    | alve./retro approx./taps/trills: ɹ  ɻ  l  ɭ  ɺ ɬ ɮ  r  ɾ ɽ  |
|   ⟨ɀ⟩   |  ⟨y⟩  |     / j /    | patalal/velar approximants: j ʝ ʎ ɰ ʟ                       |

### Vowels

| Hisyëö | Latin | IPA | Transliteration Sources |
|:---:|:---:|-----|----------------------------------------------|
|      | ⟨o⟩ | /ɑ/ | unrounded open vowels: a ɑ ɐ                   |
| ⟨ ı ⟩ | ⟨ö⟩ | /o/ | rounded open/back vowels: ɶ ɒ ɞ ɔ o ɵ         |
| ⟨ ʃ ⟩ | ⟨u⟩ | /ə/ | unrounded central/back open-mid vowels: ə ʌ ɤ |
| ⟨ ʄ ⟩ | ⟨ü⟩ | /u/ | close back vowels: u ʉ ʊ ɯ                   |
| ⟨ ȷ ⟩ | ⟨ı⟩ | /ɪ/ | front/central close/close-mid vowels: ɪ ʏ ɨ   |
| ⟨ ɟ ⟩ | ⟨i⟩ | /i/ | front/central close vowels: i y              |
| ⟨ ɿ ⟩ | ⟨e⟩ | /ɛ/ | unrounded open-mid vowels: ɛ ɜ æ               |
| ⟨ ʇ ⟩ | ⟨ë⟩ | /e/ | front/central close-mid vowels: e ɘ ø         |

## Create a docs version

Release a version 1.0 of your project:

```bash
npm run docusaurus docs:version 1.0
```

The `docs` folder is copied into `versioned_docs/version-1.0` and `versions.json` is created.

Your docs now have 2 versions:

- `1.0` at `http://localhost:3000/docs/` for the version 1.0 docs
- `current` at `http://localhost:3000/docs/next/` for the **upcoming, unreleased docs**

## Add a Version Dropdown

To navigate seamlessly across versions, add a version dropdown.

Modify the `docusaurus.config.js` file:

```js title="docusaurus.config.js"
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersionDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```

The docs version dropdown appears in your navbar:

![Docs Version Dropdown](./img/docsVersionDropdown.png)

## Update an existing version

It is possible to edit versioned docs in their respective folder:

- `versioned_docs/version-1.0/hello.md` updates `http://localhost:3000/docs/hello`
- `docs/hello.md` updates `http://localhost:3000/docs/next/hello`
