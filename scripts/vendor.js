// يحمّل المكتبات الخارجية (Lucide, FontAwesome, Three.js) داخل www/vendor ليعمل التطبيق بدون إنترنت
// الاستخدام: node scripts/vendor.js   (يحتاج اتصال إنترنت مرة واحدة)
const fs=require('fs'),path=require('path');
const W=path.join(__dirname,'..','www'),V=path.join(W,'vendor');fs.mkdirSync(V,{recursive:true});
const get=async u=>Buffer.from(await (await fetch(u)).arrayBuffer());
const MAP=[
 ['https://unpkg.com/lucide@latest/dist/umd/lucide.min.js','lucide.min.js'],
 ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','three.min.js'],
];
(async()=>{
 const rep={};
 for(const [u,n] of MAP){fs.writeFileSync(path.join(V,n),await get(u));rep[u]='vendor/'+n;console.log('✓',n);}
 // FontAwesome: css + webfonts
 const FA='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/';
 let css=(await get(FA+'css/all.min.css')).toString();
 fs.mkdirSync(path.join(V,'webfonts'),{recursive:true});
 for(const f of new Set([...css.matchAll(/\.\.\/webfonts\/([\w.-]+)/g)].map(m=>m[1]))){
   fs.writeFileSync(path.join(V,'webfonts',f),await get(FA+'webfonts/'+f));}
 css=css.replace(/\.\.\/webfonts\//g,'webfonts/');
 fs.writeFileSync(path.join(V,'fontawesome.min.css'),css);rep[FA+'css/all.min.css']='vendor/fontawesome.min.css';console.log('✓ fontawesome');
 // Google Fonts: Cairo / Reem Kufi / Markazi etc.
 const gf=new Set();
 for(const f of fs.readdirSync(W).filter(x=>/\.(html|css)$/.test(x)))
  for(const m of fs.readFileSync(path.join(W,f),'utf8').matchAll(/https:\/\/fonts\.googleapis\.com\/css2\?[^"')\s]+/g))gf.add(m[0].replace(/&amp;/g,'&'));
 fs.mkdirSync(path.join(V,'fonts'),{recursive:true});let all='',i=0;
 for(const u of gf){
  let c=(await (await fetch(u,{headers:{'User-Agent':'Mozilla/5.0 (Linux; Android 13) Chrome/120 Mobile'}})).text());
  for(const m of [...c.matchAll(/url\((https:[^)]+\.woff2)\)/g)]){const n=(i++)+'.woff2';fs.writeFileSync(path.join(V,'fonts',n),await get(m[1]));c=c.replace(m[1],'fonts/'+n);}
  all+=c+'\n';rep[u]='vendor/fonts.css';
 }
 fs.writeFileSync(path.join(V,'fonts.css'),all);console.log('✓ fonts');
 // rewrite references
 for(const f of fs.readdirSync(W).filter(x=>/\.(html|css)$/.test(x))){
  let s=fs.readFileSync(path.join(W,f),'utf8'),o=s;
  for(const [k,v] of Object.entries(rep)){s=s.split(k).join(v).split(k.replace(/&/g,'&amp;')).join(v);}
  s=s.replace(/@import url\('vendor\/fonts\.css'\);?/g,"@import url('vendor/fonts.css');");
  if(f==='style.css')s=s.replace(/vendor\//g,'vendor/');
  if(s!==o)fs.writeFileSync(path.join(W,f),s);
 }
 console.log('تم. شغّل الآن: npx cap sync android');
})();
