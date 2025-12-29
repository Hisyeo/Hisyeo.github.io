const letterMap = {
    b: 'B',
    k: 'K',
    g: 'G',
    t: 'T',
    c: 'C',
    d: 'D',
    z: 'Z',
    s: 'S',
    x: 'X',
    f: 'F',
    h: 'H',
    m: 'M',
    n: 'N',
    w: 'W',
    l: 'L',
    y: 'Y',
    o: 'O',
    ô: 'Ô',
    e: 'E',
    ê: 'Ê',
    i: 'I',
    î: 'Î',
    u: 'U',
    û: 'Û',
}

export const capitalize = word => word.split('').map(l => letterMap[l]).join('')

const neuVowelsFull = {
    o: 'o', ô: 'o',
    e: 'e', ê: 'e',
    i: 'i', î: 'i',
    u: 'u', û: 'u',
}

const neuVowelsLimited = {
    o: 'a', ô: 'o',
    e: 'i', ê: 'e',
    i: 'i', î: 'i',
    u: 'a', û: 'u',
}

export const neutralize = (word, full) => (full ?
      word.split('').map((c) => neuVowelsFull[c] ?? c)
    : word.split('').map((c) => neuVowelsLimited[c] ?? c)
).join('')