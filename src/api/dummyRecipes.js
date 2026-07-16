const baseUrl = 'https://dummyjson.com/recipes';

async function requestJson(path = '', { signal } = {}) {
  const response = await fetch(`${baseUrl}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`Dummy recipes request failed: ${response.status}`);
  }
  return response.json();
}

export function fetchRecipes(options = {}) {
  const params = new URLSearchParams();
  if (options.limit != null) params.set('limit', String(options.limit));
  if (options.skip != null) params.set('skip', String(options.skip));
  if (options.select) {
    params.set('select', Array.isArray(options.select) ? options.select.join(',') : options.select);
  }
  const query = params.toString();
  return requestJson(query ? `?${query}` : '', { signal: options.signal });
}

export function fetchRecipeById(id, options = {}) {
  return requestJson(`/${id}`, { signal: options.signal });
}

export function fetchRecipePreviews(options = {}) {
  return fetchRecipes({
    limit: options.limit ?? 10,
    skip: options.skip ?? 10,
    select: options.select ?? ['name', 'image'],
    signal: options.signal,
  });
}

export function searchRecipes(query, options = {}) {
  const params = new URLSearchParams({ q: query });
  if (options.limit != null) params.set('limit', String(options.limit));
  if (options.skip != null) params.set('skip', String(options.skip));
  if (options.select) {
    params.set('select', Array.isArray(options.select) ? options.select.join(',') : options.select);
  }
  return requestJson(`/search?${params.toString()}`, { signal: options.signal });
}
