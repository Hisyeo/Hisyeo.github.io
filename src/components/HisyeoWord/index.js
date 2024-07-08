import React, { cloneElement, Children } from 'react'

import words from '@site/static/words.json'

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoWord({ is }) {
  if (words[is] != undefined) { return (
    <>
      <a data-tooltip-id='hisyeo' data-tooltip-content={is}>{words[is]['latin']}</a> / <a data-tooltip-id='hisyeo' data-tooltip-content={is}>{words[is]['abugida']}</a>
    </>
  ) } else { return (
    <span>{is}</span>
  ) }
}
