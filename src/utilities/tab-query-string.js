import { useHistory } from "@docusaurus/router";
import { useQueryStringValue } from "@docusaurus/theme-common/internal";
import { useCallback } from "react";

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

export default function useTabQueryString({
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