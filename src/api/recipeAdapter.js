function recipeCategory(recipe) {
  const mealTypes = (recipe.mealType || []).map((entry) => entry.toLowerCase());
  const tags = (recipe.tags || []).map((entry) => entry.toLowerCase());
  if (mealTypes.includes('dessert') || tags.includes('dessert')) return 'dessert';
  if (mealTypes.includes('beverage') || tags.includes('drink')) return 'drink';
  if (mealTypes.includes('snack') || mealTypes.includes('appetizer')) return 'start';
  return 'main';
}

function recipePrice(recipe) {
  const calories = Number(recipe.caloriesPerServing || 0);
  if (!calories) return 18;
  return Math.max(10, Math.min(42, Math.round(calories / 18)));
}

function recipeTime(recipe) {
  const total = Number(recipe.prepTimeMinutes || 0) + Number(recipe.cookTimeMinutes || 0);
  return total > 0 ? total : 12;
}

export function recipeToMenuItem(recipe) {
  const cat = recipeCategory(recipe);
  const rating = Number(recipe.rating || 0);
  return {
    id: `recipe-${recipe.id}`,
    recipeId: recipe.id,
    source: 'dummyjson',
    cat,
    name: recipe.name,
    desc: (recipe.ingredients || []).slice(0, 3).join(', ') || `${recipe.cuisine || 'House'} recipe`,
    price: recipePrice(recipe),
    time: recipeTime(recipe),
    veg: (recipe.tags || []).some((tag) => tag.toLowerCase() === 'vegetarian'),
    model: false,
    tags: rating >= 4.7 ? ['popular'] : [],
    image: recipe.image,
  };
}

export function recipeToItemDetail(recipe) {
  return {
    more: recipe.instructions?.length
      ? recipe.instructions.slice(0, 3).join(' ')
      : `${recipe.cuisine || 'House'} recipe from DummyJSON.`,
    ing: recipe.ingredients || [],
    alg: '',
  };
}

export function recipesToMenuState(recipes = []) {
  const menuItems = recipes.map(recipeToMenuItem);
  const itemDetails = Object.fromEntries(
    recipes.map((recipe) => [`recipe-${recipe.id}`, recipeToItemDetail(recipe)]),
  );
  return { menuItems, itemDetails };
}
