import React, { cloneElement, Children } from 'react'
import {useColorMode} from '@docusaurus/theme-common';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

import words from '@site/static/words.json'

const emoji = {
  verb: "⭕",
  noun: "🔺",
  adjective: "🔷",
  determiner: "🟧",
  preposition: "🟢",
  pronoun: "🔼",
  particle: "⚡",
  numeral: "🔢",
  conjunction: "❌",
  postposition: "⭐",
  interjection: "❗",
}

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoTooltip() {
  const {colorMode} = useColorMode()
  return (
    <div style={{height: '1em'}}>
      <Tooltip clickable
               id='hisyeo'
               variant={colorMode == 'dark' ? 'light' : 'dark'}
               render={({ content /*, activeAnchor */ }) => {
        const word = words[content];
        // const kind = activeAnchor?.getAttribute('data-tooltip-kind');
        if (!content) return <div></div>
        return (
          <div>
            <h3>{word?.meaning}</h3>
            <p><i>{word?.type}</i> <span>{emoji[word?.type?.toLowerCase()]}</span></p>
            <p><small>from {word?.origin}, <i>{word?.family}</i></small></p>
            <form
              action={"/docs/words/" + (content[0] ?? '') + "/" + (content ?? '')}
              method="get" target="_blank">
              <button type="submit">More info 📖</button>
            </form>
          </div>
        )
      }}/>
    </div> 
  )
}
