import React, { cloneElement, Children } from 'react'
import {useColorMode} from '@docusaurus/theme-common';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

import words from '@site/static/words.json'

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoTooltip() {
  const {colorMode, setColorMode} = useColorMode()
  return (
    <div style={{height: '1em'}}>
      <Tooltip clickable id='hisyeo' variant={colorMode == 'dark' ? 'light' : 'dark'} render={({ content }) => {
        const word = words[content]
        return (
          <div>
            <h3>{word?.meaning}</h3>
            <i>{word?.type}</i>
          </div>
        )
      }}/>
    </div> 
  )
}
