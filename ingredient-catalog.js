// Shared ingredient library. Patterns are ordered by specificity when matching.
window.INGREDIENT_CATALOG = [
  {
    "id": "carrot",
    "name": "Морковь",
    "group": "Овощи и зелень",
    "pattern": "морков"
  },
  {
    "id": "beet",
    "name": "Свёкла",
    "group": "Овощи и зелень",
    "pattern": "св[её]кл"
  },
  {
    "id": "potato",
    "name": "Картофель",
    "group": "Овощи и зелень",
    "pattern": "карто"
  },
  {
    "id": "cabbage",
    "name": "Капуста",
    "group": "Овощи и зелень",
    "pattern": "капуст"
  },
  {
    "id": "herbs",
    "name": "Зелень",
    "group": "Овощи и зелень",
    "pattern": "зелень|укроп|петрушк"
  },
  {
    "id": "onion",
    "name": "Лук",
    "group": "Овощи и зелень",
    "pattern": "лук"
  },
  {
    "id": "garlic",
    "name": "Чеснок",
    "group": "Овощи и зелень",
    "pattern": "чеснок|зубчик"
  },
  {
    "id": "tomatoes",
    "name": "Помидоры",
    "group": "Овощи и зелень",
    "pattern": "помидор|томат(?!.*паст)"
  },
  {
    "id": "cucumber",
    "name": "Огурцы",
    "group": "Овощи и зелень",
    "pattern": "огур"
  },
  {
    "id": "bellpepper",
    "name": "Болгарский перец",
    "group": "Овощи и зелень",
    "pattern": "болгар.*перец|сладк.*перец"
  },
  {
    "id": "broccoli",
    "name": "Брокколи",
    "group": "Овощи и зелень",
    "pattern": "брокколи"
  },
  {
    "id": "cauliflower",
    "name": "Цветная капуста",
    "group": "Овощи и зелень",
    "pattern": "цветн.*капуст"
  },
  {
    "id": "zucchini",
    "name": "Кабачок",
    "group": "Овощи и зелень",
    "pattern": "кабач|цукини"
  },
  {
    "id": "eggplant",
    "name": "Баклажан",
    "group": "Овощи и зелень",
    "pattern": "баклаж"
  },
  {
    "id": "pumpkin",
    "name": "Тыква",
    "group": "Овощи и зелень",
    "pattern": "тыкв"
  },
  {
    "id": "mushrooms",
    "name": "Шампиньоны",
    "group": "Овощи и зелень",
    "pattern": "шампин|гриб"
  },
  {
    "id": "spaghetti",
    "name": "Спагетти",
    "group": "Крупы, мука и хлеб",
    "pattern": "спагетти|макарон|лапш"
  },
  {
    "id": "semolina",
    "name": "Манка",
    "group": "Крупы, мука и хлеб",
    "pattern": "манк|манная круп"
  },
  {
    "id": "rice",
    "name": "Рис",
    "group": "Крупы, мука и хлеб",
    "pattern": "рис"
  },
  {
    "id": "buckwheat",
    "name": "Гречка",
    "group": "Крупы, мука и хлеб",
    "pattern": "греч"
  },
  {
    "id": "oats",
    "name": "Овсяные хлопья",
    "group": "Крупы, мука и хлеб",
    "pattern": "овсян|ов[её]с|геркулес"
  },
  {
    "id": "flour",
    "name": "Мука",
    "group": "Крупы, мука и хлеб",
    "pattern": "мук"
  },
  {
    "id": "lentils",
    "name": "Чечевица",
    "group": "Крупы, мука и хлеб",
    "pattern": "чечевиц"
  },
  {
    "id": "beans",
    "name": "Фасоль",
    "group": "Крупы, мука и хлеб",
    "pattern": "фасол"
  },
  {
    "id": "peas",
    "name": "Горох",
    "group": "Крупы, мука и хлеб",
    "pattern": "горох"
  },
  {
    "id": "bread",
    "name": "Хлеб",
    "group": "Крупы, мука и хлеб",
    "pattern": "хлеб|батон"
  },
  {
    "id": "mince",
    "name": "Фарш",
    "group": "Мясо и птица",
    "pattern": "фарш"
  },
  {
    "id": "bacon",
    "name": "Бекон",
    "group": "Мясо и птица",
    "pattern": "бекон|гуанчале"
  },
  {
    "id": "chicken",
    "name": "Курица",
    "group": "Мясо и птица",
    "pattern": "куриц|курин"
  },
  {
    "id": "beef",
    "name": "Говядина",
    "group": "Мясо и птица",
    "pattern": "говяд"
  },
  {
    "id": "pork",
    "name": "Свинина",
    "group": "Мясо и птица",
    "pattern": "свин"
  },
  {
    "id": "turkey",
    "name": "Индейка",
    "group": "Мясо и птица",
    "pattern": "индей|индюш"
  },
  {
    "id": "fish",
    "name": "Белая рыба",
    "group": "Рыба и морепродукты",
    "pattern": "рыб|треск|минтай|хек"
  },
  {
    "id": "salmon",
    "name": "Лосось",
    "group": "Рыба и морепродукты",
    "pattern": "лосос|с[её]мг|форел"
  },
  {
    "id": "shrimp",
    "name": "Креветки",
    "group": "Рыба и морепродукты",
    "pattern": "кревет"
  },
  {
    "id": "milk",
    "name": "Молоко",
    "group": "Молочные продукты и яйца",
    "pattern": "молок"
  },
  {
    "id": "cream",
    "name": "Сливки",
    "group": "Молочные продукты и яйца",
    "pattern": "сливк"
  },
  {
    "id": "butter",
    "name": "Сливочное масло",
    "group": "Молочные продукты и яйца",
    "pattern": "сливочн.*масл|масл.*сливочн"
  },
  {
    "id": "parmesan",
    "name": "Пармезан",
    "group": "Молочные продукты и яйца",
    "pattern": "пармезан|сыр"
  },
  {
    "id": "eggs",
    "name": "Яйца",
    "group": "Молочные продукты и яйца",
    "pattern": "яйц|яйко"
  },
  {
    "id": "sourcream",
    "name": "Сметана",
    "group": "Молочные продукты и яйца",
    "pattern": "сметан"
  },
  {
    "id": "cottagecheese",
    "name": "Творог",
    "group": "Молочные продукты и яйца",
    "pattern": "творог"
  },
  {
    "id": "yogurt",
    "name": "Йогурт",
    "group": "Молочные продукты и яйца",
    "pattern": "йогур"
  },
  {
    "id": "kefir",
    "name": "Кефир",
    "group": "Молочные продукты и яйца",
    "pattern": "кефир"
  },
  {
    "id": "apple",
    "name": "Яблоки",
    "group": "Фрукты и ягоды",
    "pattern": "яблок"
  },
  {
    "id": "banana",
    "name": "Бананы",
    "group": "Фрукты и ягоды",
    "pattern": "банан"
  },
  {
    "id": "lemon",
    "name": "Лимон",
    "group": "Фрукты и ягоды",
    "pattern": "лимон"
  },
  {
    "id": "orange",
    "name": "Апельсины",
    "group": "Фрукты и ягоды",
    "pattern": "апельсин"
  },
  {
    "id": "strawberry",
    "name": "Клубника",
    "group": "Фрукты и ягоды",
    "pattern": "клубник|земляник"
  },
  {
    "id": "pepper",
    "name": "Чёрный перец",
    "group": "Приправы и добавки",
    "pattern": "ч[её]рн.*перец"
  },
  {
    "id": "salt",
    "name": "Соль",
    "group": "Приправы и добавки",
    "pattern": "соль"
  },
  {
    "id": "sugar",
    "name": "Сахар",
    "group": "Приправы и добавки",
    "pattern": "сахар"
  },
  {
    "id": "spices",
    "name": "Специи",
    "group": "Приправы и добавки",
    "pattern": "специ"
  },
  {
    "id": "tomato",
    "name": "Томатная паста",
    "group": "Приправы и добавки",
    "pattern": "томат.*паст"
  },
  {
    "id": "sunflower",
    "name": "Подсолнечное масло",
    "group": "Приправы и добавки",
    "pattern": "подсолнеч.*масл|растительн.*масл"
  },
  {
    "id": "olive",
    "name": "Оливковое масло",
    "group": "Приправы и добавки",
    "pattern": "оливк.*масл"
  },
  {
    "id": "honey",
    "name": "Мёд",
    "group": "Приправы и добавки",
    "pattern": "м[её]д"
  },
  {
    "id": "soy",
    "name": "Соевый соус",
    "group": "Приправы и добавки",
    "pattern": "соев.*соус"
  },
  {
    "id": "vinegar",
    "name": "Уксус",
    "group": "Приправы и добавки",
    "pattern": "уксус"
  },
  {
    "id": "bakingpowder",
    "name": "Разрыхлитель",
    "group": "Приправы и добавки",
    "pattern": "разрыхлит"
  },
  {
    "id": "water",
    "name": "Вода",
    "group": "Приправы и добавки",
    "pattern": "вода|воды"
  }
];
