/** Fail on malformed TypeScript/TSX, including syntax the lightweight renderer might miss.
 * This is additive to tsc --noEmit and next build, not a substitute.
 */
import ts from 'typescript';
import {readdirSync,readFileSync} from 'node:fs';
import {join,resolve,relative} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const files=[];
function visit(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true})) {
    const path=join(dir,entry.name);
    if(entry.isDirectory())visit(path);
    else if(entry.name.endsWith('.ts')||entry.name.endsWith('.tsx'))files.push(path);
  }
}
visit(join(root,'src'));
files.push(join(root,'next.config.ts'));
let problems=0;
for(const file of files) {
  const contents=readFileSync(file,'utf8');
  const kind=file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS;
  const source=ts.createSourceFile(file,contents,ts.ScriptTarget.Latest,true,kind);
  for(const diagnostic of source.parseDiagnostics) {
    const pos=source.getLineAndCharacterOfPosition(diagnostic.start??0);
    console.error(`${relative(root,file)}:${pos.line+1}:${pos.character+1} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')}`);
    problems++;
  }
}
if(problems) {console.error(`Syntax check FAILED: ${problems} error(s) in ${files.length} files.`);process.exitCode=1}
else console.log(`Syntax check passed: ${files.length} TypeScript/TSX files.`);
