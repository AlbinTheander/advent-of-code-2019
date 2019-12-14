import { readData } from '../util/file';

type Part = { amount: number; substance: string };
type Recipe = { target: Part; ingredients: Part[] };

function parseData(s: string): Recipe[] {
  return s.split('\n').map(line => {
    const parts = line
      .match(/\d+ [a-z]+/gi)
      .map(part => part.split(' '))
      .map(([a, substance]) => ({ amount: +a, substance }));
    const target = parts.pop();
    return { target, ingredients: parts };
  });
}

function oreNeededForFuel(recipes: Recipe[], fuelAmount = 1): number {
  const isIngredient = (substance: string, recipe: Recipe): boolean =>
    recipe.ingredients.some(part => part.substance === substance);

  const needed = [{ amount: fuelAmount, substance: 'FUEL' }];
  const remaining = recipes.slice();

  while (needed.length > 1 || needed[0].substance !== 'ORE') {
    // Find the needed substance that isn't used in any of the remaining recipies
    const neededIx = needed.findIndex(
      ({ substance }) => !remaining.some(r => isIngredient(substance, r))
    );
    const target = needed.splice(neededIx, 1)[0];

    // Find the recipe for the target and remove it from the remaining recipes
    const recipeIx = remaining.findIndex(rec => rec.target.substance === target.substance);
    const recipe = remaining.splice(recipeIx, 1)[0];

    // Add the recipes ingredients to the needed list.
    const batches = Math.ceil(target.amount / recipe.target.amount);
    recipe.ingredients.forEach(part => {
      const neededIx = needed.findIndex(p => p.substance === part.substance);
      if (neededIx === -1) {
        needed.push({ amount: part.amount * batches, substance: part.substance });
      } else {
        needed[neededIx].amount += part.amount * batches;
      }
    });
  }
  return needed[0].amount;
}

function maxFuelFromOre(recipes: Recipe[], ore: number): number {
  let low = 1;
  let high = ore;
  while (low < high - 1) {
    const attempt = Math.floor((low + high) / 2);
    const oreNeeded = oreNeededForFuel(recipes, attempt);
    if (oreNeeded > ore) high = attempt;
    else low = attempt;
  }
  return low;
}

export default function run(): void {
  const data = readData('day14.txt');
  const recipes = parseData(data);
  const answer1 = oreNeededForFuel(recipes);
  const answer2 = maxFuelFromOre(recipes, 1000000000000);

  console.log('--Day 14');
  console.log('The amount of ore needed for 1 fuel is', answer1);
  console.log('The amount of fuel gained from 1000000000000 ore is', answer2);
}
