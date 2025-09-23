import React, { cloneElement, Children } from 'react'

import reactStringReplace from 'react-string-replace'

import words from '@site/static/words.json'
import abugida from './abugida';
import syllabary from './syllabary';

const lc = 'oôeêiîuûhkgtcsxdzbfmnlwy'
const uc = 'OÔEÊIÎUÛHKGTCSXDZBFMNLWY'

const punc = {
  '\\,': {latin: ',', abugida: '､', syllabary: ','},
  '\\:': {latin: ':', abugida: '–', syllabary: ':'},
  '\\;': {latin: ';', abugida: 'ʭ', syllabary: ';'},
  '\\.': {latin: '.', abugida: ':', syllabary: '.'},
  '\\?': {latin: '?', abugida: '≈', syllabary: '?'},
  '\\«': {latin: '«', abugida: "\uFF62", syllabary: '《'},
  '\\»': {latin: '»', abugida: "\uFF63", syllabary: '》'},
}

const re = new RegExp(`((?:[${Object.keys(punc).join('')}])|(?:[${lc}]+|[${uc}][${uc}${lc}]*(?: [${uc}][${uc}${lc}]*)*))`,'g')

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoText({ kind, children: ch }) {
  let word = undefined; return (
    <p>{
      reactStringReplace(ch, re, (match, i) => {
        if (word = words[match]) {
          return (
            <a key={`word-${i}`} data-tooltip-id='hisyeo' data-tooltip-kind={`${kind}`} data-tooltip-content={match}>
              &#8239;{word[kind]}
            </a>
          )
        } else if (word = punc[`\\${match}`]) {
          return (
            <span key={`{punc-${i}}`} kind={kind}>{word[kind]}</span>
          )
        } else {
          // console.log(`Word not found: ${match}`);
          if (kind == 'abugida') {
            const [result, isProper] = abugida(match);
            if (isProper) {
              return (
                <span key={`custom-${i}`} kind="abugida">{result}</span>
              )  
            } else {
              return (
                <u key={`custom-${i}`} kind="abugida">{result}</u>
              )
            }
          } else if (kind == 'syllabary') {
            const [result, isProper] = syllabary(match);
            if (isProper) {
              return (
                <span key={`custom-${i}`} kind="syllabary">{result}</span>
              )  
            } else {
              return (
                <u key={`custom-${i}`} kind="syllabary">{result}</u>
              )
            }
          } else {
            return (
              <span key={`custom-${i}`}>{match}</span>
            )
          }
        }
      })
    }</p>
  )
}
