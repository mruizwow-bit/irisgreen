import { mkdir,writeFile } from 'node:fs/promises';
import { buildGameEntities } from '../src/r04/games-adapter.mjs';
const out=new URL('../build/r04/',import.meta.url);
const {entities,report}=buildGameEntities();
await mkdir(out,{recursive:true});
await writeFile(new URL('games-entities.json',out),JSON.stringify({schema:'R51_A9_GAME_ENTITIES/1.0',entities},null,2)+'\n');
await writeFile(new URL('games-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
