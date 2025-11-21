import React from 'react'
import words from '@site/static/words.json'
import useTabQueryString from '../../utilities/tab-query-string';

/**
 * 
 * @param {Object} props
 * @param {ReactNode[]} props.children
 * @returns {import('react').ReactElement}
 */
export default function HisyeoWord({is}) {
  const [queryString, _] = useTabQueryString({
    queryString: true,
    groupId: "bobôun-kon-cukto",
  })
  if (words[is] != undefined) { 
    if (queryString == "obûgîdo") { return (
      <a data-tooltip-id='hisyeo' data-tooltip-content={is} data-tooltip-kind='abugida'>{words[is]['abugida']}</a>
    ) } else if (queryString == 'ostok-ûlonfû') { return (
      <a data-tooltip-id='hisyeo' data-tooltip-content={is} data-tooltip-kind='syllabary'>{words[is]['syllabary']}</a>
    ) } else { return (
      <a data-tooltip-id='hisyeo' data-tooltip-content={is} data-tooltip-kind='latin'>{words[is]['latin']}</a>
    ) }
  } else { return (
    <span>{is}</span>
  ) }
}
