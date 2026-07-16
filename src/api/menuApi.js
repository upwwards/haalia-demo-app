import { fetchRecipeById, fetchRecipePreviews, fetchRecipes, searchRecipes } from './dummyRecipes.js';
import { recipeToItemDetail, recipeToMenuItem, recipesToMenuState } from './recipeAdapter.js';

export async function fetchMenu({ limit = 20, skip = 0, signal } = {}) {
  const data = await fetchRecipes({ limit, skip, signal });
  return recipesToMenuState(data.recipes || []);
}

export async function fetchMenuItem(id, { signal } = {}) {
  const recipeId = String(id).replace(/^recipe-/, '');
  const recipe = await fetchRecipeById(recipeId, { signal });
  return {
    item: recipeToMenuItem(recipe),
    detail: recipeToItemDetail(recipe),
  };
}

export async function fetchMenuPreviews({ limit = 10, skip = 10, signal } = {}) {
  const data = await fetchRecipePreviews({ limit, skip, signal });
  return (data.recipes || []).map((recipe) => ({
    id: `recipe-${recipe.id}`,
    name: recipe.name,
    image: recipe.image,
  }));
}

export async function searchMenu(query, { limit, skip, signal } = {}) {
  const data = await searchRecipes(query, { limit, skip, signal });
  return recipesToMenuState(data.recipes || []);
}
