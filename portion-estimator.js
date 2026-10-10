// Approximate household weights and serving sizes, not nutritional standards.
(function(root){
  const servingGrams={'Основные блюда':400,'Супы':400,'Салаты':250,'Закуски':150,'Гарниры':200,'Завтраки':350,'Выпечка':100,'Десерты':150,'Соусы':50,'Напитки':250,'Заготовки':250};
  const pieces=[[/яйц|яйко/,50],[/карто/,150],[/морков/,100],[/св[её]кл/,200],[/лук/,100],[/помидор|томат(?!.*паст)/,120],[/перец/,150],[/чеснок|зубчик/,5],[/яблок/,150],[/банан/,120],[/лимон/,120],[/хлеб/,30]];
  function density(name){if(/сахар/.test(name))return 0.83;if(/соль/.test(name))return 1.2;if(/мук/.test(name))return 0.5;if(/манк|манная круп/.test(name))return 0.7;if(/м[её]д/.test(name))return 1.42;if(/масл/.test(name))return 0.92;if(/молок|сливк/.test(name))return 1.03;return 1;}
  function ingredientGrams([name,amount,unit]){
    if(!Number.isFinite(amount)||amount<=0)return null;
    name=name.toLocaleLowerCase('ru');
    if(unit==='г')return amount;if(unit==='кг')return amount*1000;
    if(['мл','л','ч.л.','ст.л.'].includes(unit))return amount*({'мл':1,'л':1000,'ч.л.':5,'ст.л.':15}[unit])*density(name);
    if(unit==='шт.'){const match=pieces.find(([pattern])=>pattern.test(name));return match?amount*match[1]:null;}
    return null;
  }
  function estimate(ingredients,dishType,fallback=4,totalWeight=null){
    let ingredientWeight=0,cookedWeight=0;const unmeasured=[];
    for(const i of ingredients){const grams=ingredientGrams(i),name=String(i[0]||'').toLocaleLowerCase('ru');if(grams===null){if(i[0]&&!/соль|перец|специ|зелень|укроп|петрушк|сахар|томат.*паст/.test(name))unmeasured.push(i[0]);continue;}ingredientWeight+=grams;
      const pasta=/спагетти|макарон|паста|лапшиц|лапш[аи]/.test(name)&&! /паст[аы].*томат|томат.*паст|вар[её]н|готов/.test(name);
      cookedWeight+=grams*(pasta?2.5:1);
    }
    if(Number.isFinite(totalWeight)&&totalWeight>0){cookedWeight=totalWeight;unmeasured.length=0;}
    const gramsPerPortion=servingGrams[dishType]||350,complete=cookedWeight>0&&unmeasured.length===0;
    return {ingredientWeightGrams:Math.round(ingredientWeight),estimatedWeightGrams:Math.round(cookedWeight),gramsPerPortion,portions:complete?Math.max(1,Math.min(100000,Math.round(cookedWeight/gramsPerPortion))):fallback,complete,unmeasured};
  }
  root.PortionEstimator={estimate,ingredientGrams,servingGrams};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.PortionEstimator;
})(globalThis);
