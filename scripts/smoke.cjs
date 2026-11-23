/** Render every page through TypeScript transpilation and a tiny JSX shim.
 * This checks page execution and navigation without requiring a Next server.
 * It is additive to, NOT a replacement for, `next build` and browser QA.
 */
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const root=path.resolve(__dirname,'..');
const ts=require(process.env.TYPESCRIPT_MODULE || 'typescript');
const originalResolve=Module._resolveFilename;
const originalLoad=Module._load;
const Fragment=Symbol.for('Fragment');
const h=(type,props)=>({type,props:props||{}});
Module._resolveFilename=function(request,parent,...rest){if(request.startsWith('@/'))return originalResolve.call(this,path.join(root,'src',request.slice(2)),parent,...rest);return originalResolve.call(this,request,parent,...rest)};
Module._load=function(request,parent,...rest){
 if(request==='react/jsx-runtime')return {jsx:h,jsxs:h,Fragment};
 if(request==='react')return {useState:(initial)=>[initial,()=>{}],useId:()=> 'smoke-carousel',useRef:(initial)=>({current:initial}),useEffect:()=>{},useCallback:(cb)=>cb};
 if(request==='next/link')return {__esModule:true,default:({href,children,...props})=>h('a',{href,children,...props})};
 if(request==='next/navigation')return {notFound(){throw new Error('notFound')}};
 if(request.endsWith('.css'))return {};
 return originalLoad.call(this,request,parent,...rest);
};
for(const ext of ['.tsx','.ts'])require.extensions[ext]=(mod,file)=>{const content=fs.readFileSync(file,'utf8');const result=ts.transpileModule(content,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}});mod._compile(result.outputText,file)};
async function render(n){
 if(n===null||n===undefined||n===false)return '';
 if(typeof n==='string'||typeof n==='number')return escapeHtml(n);
 if(Array.isArray(n))return (await Promise.all(n.map(render))).join('');
 if(n.then)return render(await n);
 if(n.type===Fragment)return render(n.props.children);
 if(typeof n.type==='function')return render(await n.type(n.props));
 if(typeof n.type!=='string')throw Error('Unknown JSX element');
 const {children,ref,key,dangerouslySetInnerHTML,...attrs}=n.props;
 const att=Object.entries(attrs).filter(([k,v])=>k!=='suppressHydrationWarning'&&v!==undefined&&v!==null&&v!==false&&typeof v!=='function'&&!k.startsWith('on')).map(([k,v])=>` ${k==='className'?'class':k}="${escapeHtml(String(v))}"`).join('');
 const inner=dangerouslySetInnerHTML?.__html??await render(children);
 return `<${n.type}${att}>${inner}</${n.type}>`;
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
(async()=>{
 const home=require('../src/app/page.tsx');
 const layout=require('../src/app/layout.tsx');
 const staticRoutes=['weddings','wedding-packages','the-enclave','cabins','corporate-retreats','things-to-do','gallery','video-gallery','guest-information','contact','blog','amenities','things-to-do/restaurants','things-to-do/wineries','things-to-do/trails'];
 const routes=[['/',home.default]];
 for(const slug of staticRoutes)routes.push([`/${slug}`,require(`../src/app/${slug}/page.tsx`).default]);
 const dynamic=require('../src/app/cabins/[slug]/page.tsx');
 const {STAYS}=require('../src/lib/content.ts');
 for(const stay of STAYS)routes.push([`/cabins/${stay.slug}`,()=>dynamic.default({params:Promise.resolve({slug:stay.slug})})]);
 const known=new Set(routes.map(([r])=>r));
 const out=process.env.SMOKE_OUTPUT_DIR;
 if(out)fs.mkdirSync(out,{recursive:true});
 let failures=0;
 for(const [url,fn] of routes){
  try{
   const html=await render(layout.default({children:fn()}));
   if(out){const style=fs.readFileSync(path.join(root,'src/app/style.css'),'utf8').replace(/^@import[^\n]*\n/,'');const name=url==='/'?'home':url.replace(/^\//,'').replaceAll('/','--');fs.writeFileSync(path.join(out,`${name}.html`),`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>${style}</style>${html}`)}
   const h1=(html.match(/<h1(?:\s[^>]*)?>/g)||[]).length;
   if(h1!==1)throw Error(`Expected exactly one H1, got ${h1}`);
   const hrefs=[...html.matchAll(/href="([^"]+)"/g)].map(x=>x[1]);
   for(const href of hrefs){if(href.startsWith('/')&&!known.has(href.split('?')[0].split('#')[0]))throw Error(`Dead internal link ${href}`)}
   if(/\b0[1-9]\s*[\/|·-]\s*(Weddings|Cabins|Services)/i.test(html))throw Error('Numbered template label');
   if(/preview only|migration pending|verify before launch|lorem ipsum/i.test(html))throw Error('Implementation note leaked to page');
   console.log(`OK ${url} [${(html.length/1024).toFixed(1)} KB, H1, ${hrefs.length} links]`);
  }catch(error){failures++;console.error(`FAILED ${url}: ${error.stack||error.message}`)}
 }
 if(failures){console.error(`${failures} failed route(s)`);process.exitCode=1}
 else console.log(`PASS: ${routes.length} pages render with a natural H1 and no dead internal links.`);
})();
