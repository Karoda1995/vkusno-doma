// Server-only module. GitHub credentials never reach the browser.
const MAX_BODY = 2 * 1024 * 1024;
const enc = new TextEncoder();
const image = value => value === '' || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
export function validRecipe(r) {
  return r && /^recipe-[a-f0-9-]{36}$/.test(r.id) && text(r.title, 100) && text(r.description, 1500)
    && Number.isFinite(r.minutes) && r.minutes >= 1 && r.minutes <= 1440 && r.portions === 4
    && text(r.cuisine, 100) && text(r.dishType, 100) && typeof r.photo === 'string' && r.photo.length <= 1400000 && image(r.photo)
    && Array.isArray(r.tags) && r.tags.length <= 5 && r.tags.every(t => text(t, 150))
    && Array.isArray(r.ingredients) && r.ingredients.length >= 1 && r.ingredients.length <= 100
    && r.ingredients.every(i => Array.isArray(i) && i.length === 4 && text(i[0], 100)
      && (i[1] === null ? i[2] === 'по вкусу' : Number.isFinite(i[1]) && i[1] > 0 && i[1] <= 100000 && ['шт.', 'г', 'мл', 'кг', 'л'].includes(i[2]))
      && typeof i[3] === 'string' && i[3].length <= 50000 && (image(i[3]) || /^[a-z]+$/.test(i[3])))
    && Array.isArray(r.steps) && r.steps.length >= 1 && r.steps.length <= 100
    && r.steps.every(s => Array.isArray(s) && s.length === 2 && text(s[0], 150) && text(s[1], 3000));
}
function base64(bytes) { const chunks=[]; for(let offset=0;offset<bytes.length;offset+=8192)chunks.push(String.fromCharCode(...bytes.subarray(offset,offset+8192)));return btoa(chunks.join('')); }
const encode = value => base64(enc.encode(value));
const decode = value => new TextDecoder().decode(Uint8Array.from(atob(value), c => c.charCodeAt(0)));
const sessionSecret=env=>env.AUTH_SECRET||`${env.GITHUB_TOKEN}:vkusno-author-session-v1`;
async function key(secret) { return crypto.subtle.importKey('raw', enc.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']); }
async function issueSession(env) {
  const payload = encode(JSON.stringify({expires:Date.now()+24*60*60*1000,scope:'recipe:create',nonce:crypto.randomUUID()}));
  const signature = base64(new Uint8Array(await crypto.subtle.sign('HMAC',await key(sessionSecret(env)),enc.encode(payload))));
  return `${payload}.${signature}`;
}
async function sessionValid(request, env) {
  try {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /,'') || '';
    if (token.length > 1000) return false;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return false;
    const verified = await crypto.subtle.verify('HMAC',await key(sessionSecret(env)),Uint8Array.from(atob(signature),c=>c.charCodeAt(0)),enc.encode(payload));
    const data = JSON.parse(decode(payload));
    return verified && data.scope === 'recipe:create' && data.expires > Date.now();
  } catch { return false; }
}
async function samePassword(a,b) {
  const [x,y] = await Promise.all([a,b].map(p=>crypto.subtle.digest('SHA-256',enc.encode(p))));
  let different=0;new Uint8Array(x).forEach((byte,i)=>{different|=byte^new Uint8Array(y)[i]});return different===0;
}
async function readBody(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw {status:415,message:'Ожидается JSON.'};
  if (Number(request.headers.get('Content-Length')) > MAX_BODY) throw {status:413,message:'Рецепт слишком большой.'};
  const reader = request.body?.getReader();if (!reader) throw {status:400,message:'Пустой запрос.'};
  let length=0;const parts=[];
  while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>MAX_BODY){await reader.cancel();throw {status:413,message:'Рецепт слишком большой.'}}parts.push(value)}
  const bytes=new Uint8Array(length);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length}
  try{return JSON.parse(new TextDecoder().decode(bytes))}catch{throw {status:400,message:'Некорректный JSON.'}}
}
export async function handleRequest(request, env, githubFetch=fetch) {
  const origin=request.headers.get('Origin');
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
  const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  if(origin!==env.ALLOWED_ORIGIN)return reply(403,{error:'Этот сайт не имеет доступа.'});
  headers['Access-Control-Allow-Origin']=origin;
  headers['Access-Control-Allow-Methods']='POST, OPTIONS';
  headers['Access-Control-Allow-Headers']='Authorization, Content-Type';
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST')return reply(405,{error:'Метод не поддерживается.'});
  if(!env.GITHUB_TOKEN||!env.AUTHOR_PASSWORD)return reply(503,{error:'Сохранение временно недоступно.'});
  try{
    const path=new URL(request.url).pathname.replace(/^\/api/,'');
    if(path==='/auth'){
      const body=await readBody(request);
      if(typeof body.password!=='string'||body.password.length>200||!await samePassword(body.password,env.AUTHOR_PASSWORD))return reply(401,{error:'Неверный пароль.'});
      return reply(200,{token:await issueSession(env)});
    }
    if(path!=='/recipes')return reply(404,{error:'Страница не найдена.'});
    if(!await sessionValid(request,env))return reply(401,{error:'Войдите для добавления рецепта.'});
    const recipe=await readBody(request);
    if(!validRecipe(recipe))return reply(400,{error:'Проверьте поля рецепта.'});
    // Only the configured repository, branch and recipe folder are writable.
    const repo=env.GITHUB_REPOSITORY || 'Karoda1995/vkusno-doma';
    if(!/^[\w.-]+\/[\w.-]+$/.test(repo))return reply(503,{error:'Сохранение временно недоступно.'});
    const branch=env.GITHUB_BRANCH || 'main';
    const url=`https://api.github.com/repos/${repo}/contents/data/recipes/${recipe.id}.json`;
    const githubHeaders={'Authorization':`Bearer ${env.GITHUB_TOKEN}`,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'VkusnoDoma','Content-Type':'application/json'};
    const content=encode(JSON.stringify({schemaVersion:1,recipes:[recipe]},null,2));
    const lookup=await githubFetch(`${url}?ref=${encodeURIComponent(branch)}`,{headers:githubHeaders});
    if(lookup.ok){
      const existing=await lookup.json();
      if(existing.content?.replace(/\s/g,'')===content)return reply(200,{saved:true,id:recipe.id});
      return reply(409,{error:'Этот рецепт уже сохранён. Обновите каталог.'});
    }
    if(lookup.status!==404)return reply(502,{error:'Не удалось проверить сохранение. Попробуйте ещё раз.'});
    const result=await githubFetch(url,{method:'PUT',headers:githubHeaders,body:JSON.stringify({message:`Add recipe: ${recipe.title}`,branch,content})});
    if(!result.ok){
      // A repeated submission can race with the original after a timeout.
      if([409,422].includes(result.status)){
        const check=await githubFetch(`${url}?ref=${encodeURIComponent(branch)}`,{headers:githubHeaders});
        if(check.ok&&(await check.json()).content?.replace(/\s/g,'')===content)return reply(200,{saved:true,id:recipe.id});
      }
      return reply(502,{error:'Не удалось сохранить рецепт. Ваши поля остались в форме.'});
    }
    const saved=await result.json();
    return reply(201,{saved:true,id:recipe.id,commit:saved.commit?.sha});
  }catch(error){return reply(error.status||502,{error:error.message&&error.status?error.message:'Не удалось сохранить рецепт. Попробуйте ещё раз.'})}
}
