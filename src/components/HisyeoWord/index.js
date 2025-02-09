import React, { cloneElement, useCallback, Children } from 'react'
import {useHistory} from '@docusaurus/router';
import {useQueryStringValue} from '@docusaurus/theme-common/internal';
import words from '@site/static/words.json'

function getQueryStringKey({
  queryString = false,
  groupId,
}) {
  if (typeof queryString === 'string') {
    return queryString;
  }
  if (queryString === false) {
    return null;
  }
  if (queryString === true && !groupId) {
    throw new Error(
      `Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".`,
    );
  }
  return groupId ?? null;
}

function useTabQueryString({
  queryString = false,
  groupId,
}) {
  const history = useHistory();
  const key = getQueryStringKey({queryString, groupId});
  const value = useQueryStringValue(key);

  const setValue = useCallback(
    (newValue) => {
      if (!key) return; /* no-op */
      const searchParams = new URLSearchParams(history.location.search);
      searchParams.set(key, newValue);
      history.replace({...history.location, search: searchParams.toString()});
    },
    [key, history],
  );

  return [value, setValue];
}

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
    ) } else { return (
      <a data-tooltip-id='hisyeo' data-tooltip-content={is} data-tooltip-kind='latin'>{words[is]['latin']}</a>
    ) }
  } else { return (
    <span>{is}</span>
  ) }
}
