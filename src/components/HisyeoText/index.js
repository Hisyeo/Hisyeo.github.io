import React, { cloneElement, Children } from 'react'

import reactStringReplace from 'react-string-replace'

import words from '@site/static/words.json'

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoText({ kind, children }) {
  let word = undefined; return (
    <p>{
      reactStringReplace(children, /([hkgtcxsdzpvmnlwyoöeëıiuü]+)/gi, (match, i) => {
        if (word = words[match]) {
          return (
            <a key={`word-${i}`} data-tooltip-id='hisyeo' data-tooltip-content={match}>
              {word[kind]}
            </a>
          )
        } else {
          console.error(`Word not found: ${match}`)
          return (
            <span key={`custom-${i}`}>{match}</span>
          )
        }
      })
    }</p>
  )
}
