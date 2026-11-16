export type Winner='P'|'B'|'T';
export type Flags={pPair:boolean;bPair:boolean;natural:boolean;dragon:boolean;panda:boolean};
export type Game=Flags & {id:string;winner:Winner;at:string};
export type Shoe={id:string;number:number;createdAt:string;games:Game[]};
export type Data={version:1;currentId:string;shoes:Shoe[]};
export const emptyFlags=():Flags=>({pPair:false,bPair:false,natural:false,dragon:false,panda:false});
export function validGame(g:Game){return ['P','B','T'].includes(g.winner)&&!(g.dragon&&g.winner!=='B')&&!(g.panda&&g.winner!=='P')&&[g.natural,g.dragon,g.panda].filter(Boolean).length<=1;}
export type Cell={x:number;y:number;value:string;games:Game[]};
// A run keeps moving horizontally after its first collision/bottom turn.
export function place(values:string[]):Cell[]{const cells:Cell[]=[];const used=new Set<string>();let start=-1,x=0,y=0,turned=false;values.forEach((v,i)=>{if(i===0||v!==values[i-1]){start++;x=start;y=0;turned=false;while(used.has(`${x},0`))x++;start=x;}else if(!turned&&y<5&&!used.has(`${x},${y+1}`)){y++;}else{turned=true;x++;while(used.has(`${x},${y}`))x++;}used.add(`${x},${y}`);cells.push({x,y,value:v,games:[]});});return cells;}
export function roads(games:Game[]){const decisive=games.filter(g=>g.winner!=='T');const big=place(decisive.map(g=>g.winner));let i=-1;const leading:Game[]=[];for(const g of games){if(g.winner==='T'){if(i<0)leading.push(g);else big[i].games.push(g);}else{ i++;big[i].games.push(...(i===0?leading:[]),g);}}
if(!big.length&&leading.length)big.push({x:0,y:0,value:'T',games:leading});
// Compare logical streak lengths, before six-row display wrapping.
const lengths:number[]=[];const derived:string[][]=[[],[],[]];let prev='';let c=-1;
for(const g of decisive){if(g.winner!==prev){c++;lengths[c]=0;}lengths[c]++;const r=lengths[c]-1;for(let k=1;k<=3;k++){let red:boolean|undefined;if(r===0){if(c>=k+1)red=lengths[c-1]===lengths[c-k-1];}else if(c>=k){const h=lengths[c-k];red=r<h||r>h;}if(red!==undefined)derived[k-1].push(red?'R':'U');}prev=g.winner;}
return {big,derived:derived.map(place)};}
export function preview(games:Game[],winner:'P'|'B'){const before=roads(games).derived;const after=roads([...games,{...emptyFlags(),id:'preview',at:'',winner}]).derived;return after.map((a,i)=>a.length>before[i].length?a.at(-1)!.value:null);}
export function newShoe(number:number):Shoe{return {id:crypto.randomUUID(),number,createdAt:new Date().toISOString(),games:[]};}
export function initial():Data{const s=newShoe(1);return {version:1,currentId:s.id,shoes:[s]};}
export function validateBackup(v:unknown):Data{if(!v||typeof v!=='object')throw Error('JSON形式が不正です');const d=v as Data;if(d.version!==1||!Array.isArray(d.shoes)||!d.shoes.length||d.shoes.length>10000)throw Error('対応しないバックアップです');const ids=new Set<string>();for(const s of d.shoes){if(typeof s.id!=='string'||ids.has(s.id)||!Number.isInteger(s.number)||s.number<1||typeof s.createdAt!=='string'||!Number.isFinite(Date.parse(s.createdAt))||!Array.isArray(s.games)||s.games.length>100000)throw Error('シュー形式が不正です');ids.add(s.id);const gi=new Set<string>();for(const g of s.games){if(!g||typeof g.id!=='string'||gi.has(g.id)||typeof g.at!=='string'||!Number.isFinite(Date.parse(g.at))||Object.keys(emptyFlags()).some(k=>typeof g[k as keyof Flags]!=='boolean')||!validGame(g))throw Error('ゲーム形式・付加情報が不正です');gi.add(g.id);}}if(!ids.has(d.currentId))throw Error('現在のシューが不正です');return d;}
