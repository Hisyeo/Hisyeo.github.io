import React, { cloneElement, Children } from 'react'

import reactStringReplace from 'react-string-replace'

import words from '@site/static/words.json'
import { transcribe } from './abugida';

const lc = 'oôeêiîuûhkgtcsxdzbfmnlwy'
const uc = 'OÔEÊIÎUÛHKGTCSXDZBFMNLWY'

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoText({ kind, children: ch }) {
  let word = undefined; return (
    <p>{
      reactStringReplace(ch, new RegExp(`([${lc}]+|[${uc}][${uc}${lc}]*(?: [${uc}][${uc}${lc}]*)*)`,'g'), (match, i) => {
        if (word = words[match]) {
          return (
            <a key={`word-${i}`} data-tooltip-id='hisyeo' data-tooltip-kind={`${kind}`} data-tooltip-content={match}>
              {word[kind]}
            </a>
          )
        } else {
          // console.log(`Word not found: ${match}`);
          if (kind == 'abugida') {
            const [result, isProper] = transcribe(match);
            if (isProper) {
              return (
                <span key={`custom-${i}`} kind="abugida">{result}</span>
              )  
            } else {
              return (
                <u key={`custom-${i}`} kind="abugida">{result}</u>
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
