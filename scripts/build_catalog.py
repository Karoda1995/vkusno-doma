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
        if not isinstance(recipe['ingredients'], list) or not isinstance(recipe['steps'], list):
            raise ValueError(f'{path}: invalid ingredients or steps')
        recipes[recipe['id']] = recipe
target = Path('_site/data/recipes/index.json')
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(list(recipes.values()), ensure_ascii=False, separators=(',', ':')))
print(f'Published {len(recipes)} recipes')