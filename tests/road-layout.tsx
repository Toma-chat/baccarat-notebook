// Isolated visual fixture. No IndexedDB or user records are read or changed.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Board} from '../src/Board';
import {displayRoad,emptyFlags,roads,type Game} from '../src/engine';
import '../src/style.css';
import '../src/compact.css';
import '../src/stats.css';
import '../src/layout.css';
const count=new URLSearchParams(location.search).has('sample')?40:2400;
const games:Game[]=Array.from({length:count},(_,i)=>({...emptyFlags(),id:String(i),at:'2026-11-16T00:00:00Z',winner:Math.floor(i/8)%2?'B':'P',natural:i%11===0,dragon:i%11!==0&&Math.floor(i/8)%2===1&&i%13===0,panda:i%11!==0&&Math.floor(i/8)%2===0&&i%7===0,pPair:i%19===0,bPair:i%23===0}));
const r=roads(games);
createRoot(document.getElementById('root')!).render(<main><header>長い罫線の配置検証 · {count}ゲーム · 保存なし</header><div className="workspace"><Board title="大路" cells={displayRoad(games)}/><div className="middle"><div className="derived">{r.derived.map((cells,i)=><Board key={i} title={['大眼仔','小路','曱甴路'][i]} kind={['ring','solid','slash'][i]} cells={cells}/>)}</div><Board title="珠盤" kind="bead" cells={games.map((g,i)=>({x:Math.floor(i/6),y:i%6,value:g.winner,games:[g]}))}/></div><div className="summary">全マスの中心と背景罫線のピッチを測定する検証専用画面</div><div className="legend">入力・端末内保存なし</div></div><footer/></main>);
