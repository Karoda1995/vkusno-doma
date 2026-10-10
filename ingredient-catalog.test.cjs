const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('ingredient-catalog.js','utf8'),ctx);
const entries=ctx.window.INGREDIENT_CATALOG;
const ordered=[...entries].sort((a,b)=>b.pattern.length-a.pattern.length);
const match=name=>ordered.find(i=>new RegExp(i.pattern,'i').test(name))?.id;
test('catalog has unique server-compatible keys and seven groups',()=>{assert.equal(entries.length,61);assert.equal(new Set(entries.map(i=>i.id)).size,61);assert.equal(new Set(entries.map(i=>i.group)).size,7);assert.ok(entries.every(i=>/^[a-z]+$/.test(i.id)))});
test('each canonical product name selects its own image',()=>{for(const i of entries)assert.equal(match(i.name),i.id,i.name)});
test('specific names beat generic ingredient matches',()=>{for(const [name,id] of [['Цветная капуста','cauliflower'],['Томатная паста','tomato'],['Свежие помидоры','tomatoes'],['Болгарский перец','bellpepper'],['Чёрный перец','pepper'],['Растительное масло','sunflower'],['Филе лосося','salmon'],['Куриное филе','chicken'],['Масло сливочное','butter']])assert.equal(match(name),id,name)});
