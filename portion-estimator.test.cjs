const test=require('node:test'),assert=require('node:assert/strict');
const {estimate}=require('./portion-estimator.js');
test('one litre of semolina porridge is approximately three portions',()=>{const e=estimate([['Молоко',1,'л'],['Манка',80,'г'],['Сахар',3,'ст.л.'],['Соль',0.5,'ч.л.'],['Сливочное масло',30,'г']],'Завтраки');assert.equal(e.portions,3);assert.equal(e.estimatedWeightGrams,1180);assert.equal(e.complete,true)});
test('grams and kilograms produce equal results',()=>assert.deepEqual(estimate([['Каша',1,'кг']],'Завтраки'),estimate([['Каша',1000,'г']],'Завтраки')));
test('pasta hydration and eggs are counted',()=>{const e=estimate([['Спагетти',400,'г'],['Яйца',4,'шт.'],['Бекон',150,'г'],['Пармезан',100,'г'],['Сливки',100,'мл']],'Основные блюда');assert.equal(e.portions,4);assert.equal(e.estimatedWeightGrams,1553)});
test('unmeasured main ingredients do not produce a confident estimate',()=>{const e=estimate([['Фарш',null,'на глаз'],['Картофель',4,'шт.']],'Супы',4);assert.equal(e.complete,false);assert.deepEqual(e.unmeasured,['Фарш']);assert.equal(e.portions,4)});
test('known final dish weight resolves missing quantities',()=>{const e=estimate([['Фарш',null,'на глаз']],'Супы',4,2400);assert.equal(e.complete,true);assert.equal(e.portions,6)});
test('seasoning to taste does not block estimation',()=>assert.equal(estimate([['Каша',1050,'г'],['Соль',null,'по вкусу']],'Завтраки').portions,3));
test('dish type determines typical portion size',()=>{assert.equal(estimate([['Блюдо',1000,'г']],'Супы').portions,3);assert.equal(estimate([['Блюдо',1000,'г']],'Соусы').portions,20)});
