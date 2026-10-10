"""Build the public catalog from recipe backups committed to GitHub."""
import json
from pathlib import Path

recipes = {}
for path in sorted(Path('data/recipes').glob('*.json')):
    value = json.loads(path.read_text())
    items = value.get('recipes', [value]) if isinstance(value, dict) else value
    if not isinstance(items, list):
        raise ValueError(f'{path}: expected recipe list')
    for recipe in items:
        if not isinstance(recipe, dict) or not all(key in recipe for key in ['id', 'title', 'description', 'minutes', 'portions', 'ingredients', 'steps']):
            raise ValueError(f'{path}: invalid recipe')
        if not isinstance(recipe['id'], str) or not isinstance(recipe['title'], str) or not isinstance(recipe['description'], str):
            raise ValueError(f'{path}: invalid text fields')
        if not isinstance(recipe['minutes'], (int,float)) or recipe['minutes'] <= 0 or not isinstance(recipe['portions'], (int,float)) or recipe['portions'] <= 0:
            raise ValueError(f'{path}: invalid time or servings')
        if not isinstance(recipe['ingredients'], list) or not recipe['ingredients'] or not isinstance(recipe['steps'], list) or not recipe['steps']:
            raise ValueError(f'{path}: invalid ingredients or steps')
        for ingredient in recipe['ingredients']:
            if not isinstance(ingredient, list) or len(ingredient) < 3 or not isinstance(ingredient[0], str) or not isinstance(ingredient[2], str) or (ingredient[1] is not None and (not isinstance(ingredient[1], (int,float)) or ingredient[1] <= 0)):
                raise ValueError(f'{path}: invalid ingredient')
        for step in recipe['steps']:
            if not isinstance(step, list) or len(step) < 2 or not all(isinstance(text, str) for text in step):
                raise ValueError(f'{path}: invalid step')
        recipes[recipe['id']] = recipe
target = Path('_site/data/recipes/index.json')
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(list(recipes.values()), ensure_ascii=False, separators=(',', ':')))
print(f'Published {len(recipes)} recipes')
