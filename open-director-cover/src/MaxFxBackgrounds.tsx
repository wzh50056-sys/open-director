import {AbsoluteFill, Composition, Folder, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

type Fx = "inferno" | "ultraviolet" | "cyberglass" | "plasma";
const palettes = {
  inferno:["#ff3b12","#ffb000","#ff1654"], ultraviolet:["#7c3cff","#00eaff","#ff2bd6"],
  cyberglass:["#00f0ff","#4169ff","#b9ffff"], plasma:["#ff006e","#8338ec","#3a86ff"],
} as const;
const shards=Array.from({length:22},(_,i)=>i); const sparks=Array.from({length:96},(_,i)=>i);

const MaxFx = ({variant}:{variant:Fx}) => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const p=frame/durationInFrames; const t=p*Math.PI*2;
  const [a,b,c]=palettes[variant]; const pulse=1+Math.sin(t*4)*.055; const flash=Math.max(0,Math.sin(t*3.2))**16;
  return <AbsoluteFill style={{overflow:"hidden",background:"#020207",filter:`saturate(${1.35+flash*.45}) contrast(${1.12+flash*.12})`}}>
    <div style={{position:"absolute",inset:-240,rotate:`${p*45}deg`,background:`conic-gradient(from 15deg,transparent 0 8%,${a}55 13%,transparent 21%,${b}44 31%,transparent 43%,${c}55 56%,transparent 70%,${a}38 83%,transparent 94%)`,filter:"blur(72px)",scale:1.1+Math.sin(t)*.08}} />
    <div style={{position:"absolute",left:390,top:110,width:500,height:500,borderRadius:999,background:`radial-gradient(circle at 42% 38%,white 0 1%,${b} 4%,${c} 12%,${a}88 31%,transparent 69%)`,filter:"blur(1px)",scale:pulse,boxShadow:`0 0 45px ${b},0 0 130px ${c}99,0 0 260px ${a}55`}} />
    {[0,1,2,3,4,5].map(i=><div key={i} style={{position:"absolute",left:640-(260+i*68)/2,top:360-(260+i*68)/2,width:260+i*68,height:260+i*68,borderRadius:999,border:`${i%2?2:4}px solid ${i%3===0?a:i%3===1?b:c}${i<2?"cc":"66"}`,rotate:`${(i%2?-1:1)*p*(90+i*23)}deg`,scale:1+Math.sin(t*2+i)*.045,boxShadow:`0 0 ${12+i*4}px ${i%2?b:a}88`,clipPath:i%2?"polygon(0 0,100% 0,100% 42%,0 68%)":"none"}}/>)}
    {shards.map(i=>{const ang=i*16.36+t*(i%2?-.3:.22); const r=235+(i%5)*49; return <div key={i} style={{position:"absolute",left:630+Math.cos(ang)*r,top:350+Math.sin(ang)*r*.62,width:42+i%4*18,height:120+i%3*34,background:`linear-gradient(135deg,rgba(255,255,255,.42),${i%3===0?a:i%3===1?b:c}44,transparent)`,border:"1px solid rgba(255,255,255,.28)",clipPath:"polygon(50% 0,100% 100%,0 72%)",rotate:`${ang*57.3+frame*(i%2?.7:-.5)}deg`,filter:`blur(${i%7===0?2:0}px)`,opacity:.35+(i%4)*.12,boxShadow:`0 0 20px ${b}66`}}/>})}
    {sparks.map(i=>{const phase=(p*(1.5+(i%6)*.16)+(i*37%100)/100)%1; const ang=(i*137.5)*Math.PI/180; const r=80+phase*730; return <i key={i} style={{position:"absolute",left:640+Math.cos(ang)*r,top:360+Math.sin(ang)*r*.58,width:2+phase*9,height:2,borderRadius:9,background:i%3===0?a:i%3===1?b:"white",opacity:(1-phase)*.85,rotate:`${ang*57.3}deg`,boxShadow:`0 0 12px ${i%2?a:b}`}}/>})}
    {[0,1,2,3].map(i=><div key={i} style={{position:"absolute",left:-160,top:100+i*155+Math.sin(t+i)*55,width:1600,height:3+i,rotate:`${-12+i*7}deg`,background:`linear-gradient(90deg,transparent,${i%2?a:b},white,${i%2?c:a},transparent)`,filter:`blur(${i===2?6:1}px)`,opacity:.18+(i%3)*.12,boxShadow:`0 0 24px ${b}`}}/>)}
    {[0,1,2].map(i=><div key={i} style={{position:"absolute",left:0,top:((frame*7+i*211)%760)-40,width:"100%",height:5+i*3,background:`linear-gradient(90deg,transparent,${c}88,white,${a}88,transparent)`,opacity:frame%37<4?.7:0,translate:`${i%2?18:-22}px 0`,mixBlendMode:"screen"}}/>)}
    <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at center,transparent 15%,rgba(0,0,0,.2) 52%,rgba(0,0,0,.82) 100%),linear-gradient(${90+Math.sin(t)*8}deg,transparent 48%,${b}12 50%,transparent 52%)`,scale:1.02+flash*.035}} />
    <div style={{position:"absolute",inset:0,background:"white",opacity:flash*.16,mixBlendMode:"overlay"}} />
    <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 180px #000",border:`${interpolate(Math.sin(t*2),[-1,1],[0,2])}px solid ${b}44`}}/>
  </AbsoluteFill>;
};

const defs:Array<[string,Fx]>=[["MAX-Inferno-Core","inferno"],["MAX-Ultraviolet-Burst","ultraviolet"],["MAX-Cyber-Glass","cyberglass"],["MAX-Plasma-Rift","plasma"]];
export const MaxFxCompositions=()=> <Folder name="MAX-FX">{defs.map(([id,variant])=><Composition key={id} id={id} component={MaxFx} durationInFrames={180} fps={30} width={1280} height={720} defaultProps={{variant}}/>)}</Folder>;
