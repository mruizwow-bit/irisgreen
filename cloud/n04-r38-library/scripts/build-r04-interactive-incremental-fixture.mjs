import { mkdir,writeFile } from 'node:fs/promises';
import { buildGameEntities } from '../src/r04/games-adapter.mjs';
import { buildRoutineEntities } from '../src/r04/routines-adapter.mjs';

const game=buildGameEntities({ids:['los-cordones']});
const routine=buildRoutineEntities({ids:['manana-para-salir']});
const report={
  schema:'R51_A9_INCREMENTAL_INTERACTIVE_FIXTURE/1.0',
  game:{id:'los-cordones',entities:game.entities.length,locales:game.entities.map(e=>e.locale).sort()},
  routine:{id:'manana-para-salir',entities:routine.entities.length,locales:routine.entities.map(e=>e.locale).sort(),steps:routine.report.step_references}
};
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
await writeFile(new URL('incremental-interactive-fixture.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
