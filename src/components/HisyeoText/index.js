import React, { cloneElement, Children } from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

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
          return (
            <span key={`custom-${i}`}>{match}</span>
          )
        }
      })
    }</p>
  )
}
