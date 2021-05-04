function getFilteredQuery(query) {
  return Object.fromEntries(
    Object.entries(query)
      .filter(([_key, value]) => Boolean(value))
      .sort((a, b) => b[0].localeCompare(a[0]))
  );
}

function objToQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

export { getFilteredQuery, objToQueryString };
