import {AbsoluteFill, Composition, Folder, useCurrentFrame, useVideoConfig} from "remotion";

type Variant = "aurora" | "nebula" | "warp" | "light" | "tunnel" | "liquid";
type BackgroundProps = {readonly variant: Variant};

const particles = Array.from({length: 72}, (_, index) => ({
  angle: (index * 137.508) % 360,
  offset: (index * 47) % 150,
  size: 1 + (index % 4),
  speed: 0.55 + (index % 7) * 0.08,
}));

const rings = Array.from({length: 18}, (_, index) => index);

const AuroraGrid = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const angle = (frame / durationInFrames) * Math.PI * 2;
  return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(180deg,#080a12,#03040a)"}}>
    <div style={{position:"absolute",width:1000,height:900,left:-320,top:-250,borderRadius:"50%",background:"rgba(255,83,133,.34)",filter:"blur(150px)",translate:`${Math.sin(angle)*210}px ${Math.cos(angle)*90}px`}} />
    <div style={{position:"absolute",width:1100,height:900,right:-370,top:-290,borderRadius:"50%",background:"rgba(108,82,255,.42)",filter:"blur(165px)",translate:`${Math.cos(angle)*190}px ${Math.sin(angle)*110}px`}} />
    <div style={{position:"absolute",inset:-100,opacity:.25,backgroundImage:"linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",backgroundSize:"72px 72px",translate:`${(frame/durationInFrames)*72}px ${(frame/durationInFrames)*72}px`,maskImage:"linear-gradient(to bottom,black,transparent 92%)"}} />
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at center,transparent 10%,rgba(2,3,8,.52) 100%)"}} />
  </AbsoluteFill>;
};

const NeonNebula = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const turn=(frame/durationInFrames)*360;
  return <AbsoluteFill style={{overflow:"hidden",background:"#050611"}}>
    <div style={{position:"absolute",inset:-500,rotate:`${turn}deg`,background:"conic-gradient(from 20deg,transparent 0 12%,rgba(31,225,255,.34) 18%,transparent 29%,rgba(255,56,172,.38) 42%,transparent 55%,rgba(111,73,255,.48) 70%,transparent 84%)",filter:"blur(100px)"}} />
    <div style={{position:"absolute",width:620,height:620,left:330,top:40,borderRadius:"46% 54% 58% 42%",background:"radial-gradient(circle at 35% 35%,rgba(255,255,255,.18),rgba(128,75,255,.28) 35%,rgba(18,211,255,.08) 65%,transparent 72%)",filter:"blur(16px)",rotate:`-${turn*.45}deg`,scale:1+Math.sin((frame/durationInFrames)*Math.PI*2)*.08,boxShadow:"0 0 150px rgba(116,66,255,.42)"}} />
    {particles.slice(0,36).map((p,i)=><span key={i} style={{position:"absolute",left:`${8+(i*23)%88}%`,top:`${6+(i*37)%84}%`,width:p.size,height:p.size,borderRadius:99,background:i%3===0?"#62eaff":"#d9ccff",opacity:.25+(i%5)*.1,boxShadow:"0 0 12px currentColor"}} />)}
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at center,transparent 25%,rgba(2,3,10,.65) 100%)"}} />
  </AbsoluteFill>;
};

const ParticleWarp = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig();
  return <AbsoluteFill style={{overflow:"hidden",background:"radial-gradient(circle at 50% 48%,#17255a 0%,#080a18 24%,#020308 70%)"}}>
    {particles.map((p,i)=>{const progress=((frame*p.speed+p.offset)%durationInFrames)/durationInFrames; const radius=20+progress*820; const rad=p.angle*Math.PI/180; return <span key={i} style={{position:"absolute",left:640+Math.cos(rad)*radius,top:360+Math.sin(rad)*radius*.58,width:3+progress*16,height:1+progress*3,borderRadius:99,rotate:`${p.angle}deg`,background:i%4===0?"#ff75cb":i%3===0?"#7a8cff":"#b8f7ff",opacity:progress,boxShadow:"0 0 14px currentColor"}} />})}
    <div style={{position:"absolute",left:570,top:290,width:140,height:140,borderRadius:999,background:"radial-gradient(circle,#d8f7ff 0%,#727cff 18%,rgba(91,50,255,.28) 48%,transparent 72%)",scale:.9+Math.sin((frame/durationInFrames)*Math.PI*2)*.12,boxShadow:"0 0 120px rgba(81,94,255,.9)"}} />
  </AbsoluteFill>;
};

const FilmLight = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const angle=(frame/durationInFrames)*Math.PI*2;
  return <AbsoluteFill style={{overflow:"hidden",background:"#06050a"}}>
    <div style={{position:"absolute",width:900,height:980,left:-280,top:-200,borderRadius:"45%",background:"linear-gradient(135deg,rgba(255,42,91,.72),rgba(255,136,44,.2) 48%,transparent 70%)",filter:"blur(110px)",translate:`${Math.sin(angle)*170}px ${Math.cos(angle)*70}px`,rotate:`${-18+Math.sin(angle)*8}deg`}} />
    <div style={{position:"absolute",width:980,height:920,right:-380,top:-170,borderRadius:"50%",background:"linear-gradient(225deg,rgba(122,64,255,.8),rgba(237,55,184,.18) 52%,transparent 72%)",filter:"blur(130px)",translate:`${Math.cos(angle)*160}px ${Math.sin(angle)*85}px`}} />
    <div style={{position:"absolute",left:-260,top:-120,width:1600,height:280,background:"linear-gradient(90deg,transparent,rgba(255,202,151,.2),transparent)",filter:"blur(35px)",rotate:`${-25+Math.sin(angle)*6}deg`,translate:`0px ${Math.sin(angle)*150}px`}} />
    {particles.slice(0,48).map((p,i)=><span key={i} style={{position:"absolute",left:`${(i*41+frame*.18)%100}%`,top:`${(i*67+frame*.09)%100}%`,width:p.size,height:p.size,borderRadius:99,background:"rgba(255,255,255,.22)"}} />)}
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.72) 100%)"}} />
  </AbsoluteFill>;
};

const DataTunnel = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig();
  return <AbsoluteFill style={{overflow:"hidden",background:"radial-gradient(circle,#10194a,#03040c 68%)",perspective:700}}>
    {rings.map((ring)=>{const phase=((frame+ring*(durationInFrames/rings.length))%durationInFrames)/durationInFrames; const size=80+phase*1450; return <div key={ring} style={{position:"absolute",left:640-size/2,top:360-size*.55/2,width:size,height:size*.55,border:`${1+phase*2}px solid rgba(${ring%2?111:45},${ring%2?92:222},255,${.1+phase*.35})`,borderRadius:24+phase*80,rotate:`${phase*22+(ring%2?8:-8)}deg`,boxShadow:"0 0 22px rgba(68,114,255,.16)"}} />})}
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(86,126,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(86,126,255,.07) 1px,transparent 1px)",backgroundSize:"64px 64px",opacity:.35}} />
    <div style={{position:"absolute",left:560,top:300,width:160,height:120,borderRadius:999,background:"rgba(94,71,255,.36)",filter:"blur(55px)",boxShadow:"0 0 120px rgba(30,220,255,.4)"}} />
  </AbsoluteFill>;
};

const LiquidGradient = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const angle=(frame/durationInFrames)*Math.PI*2;
  const blobs=[{c:"#ff4d8d",x:40,y:10,o:0},{c:"#6954ff",x:68,y:35,o:2.1},{c:"#1bc8d4",x:28,y:56,o:4.2},{c:"#ff8a3d",x:55,y:72,o:1.2}];
  return <AbsoluteFill style={{overflow:"hidden",background:"#080916"}}>
    <div style={{position:"absolute",inset:-180,filter:"blur(90px) saturate(130%)",scale:1.16}}>{blobs.map((b,i)=><div key={b.c} style={{position:"absolute",left:`${b.x}%`,top:`${b.y}%`,width:620-i*35,height:520+i*25,borderRadius:`${44+i*5}% ${56-i*3}% ${48+i*4}% ${52-i*2}%`,background:b.c,opacity:.5,translate:`${Math.sin(angle+b.o)*180}px ${Math.cos(angle+b.o)*120}px`,rotate:`${(frame/durationInFrames)*360*(i%2?-.18:.22)}deg`,scale:.9+Math.sin(angle+b.o)*.12}} />)}</div>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.06),transparent 35%),radial-gradient(circle at center,transparent 10%,rgba(4,5,12,.58) 100%)"}} />
  </AbsoluteFill>;
};

export const Background = ({variant}: BackgroundProps) => {
  if(variant==="aurora") return <AuroraGrid/>;
  if(variant==="nebula") return <NeonNebula/>;
  if(variant==="warp") return <ParticleWarp/>;
  if(variant==="light") return <FilmLight/>;
  if(variant==="tunnel") return <DataTunnel/>;
  return <LiquidGradient/>;
};

export const BackgroundCompositions = () => <Folder name="Backgrounds">
  <Composition id="BG-Aurora-Grid" component={Background} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{variant:"aurora"}} />
  <Composition id="BG-Neon-Nebula" component={Background} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{variant:"nebula"}} />
  <Composition id="BG-Particle-Warp" component={Background} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{variant:"warp"}} />
  <Composition id="BG-Film-Light" component={Background} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{variant:"light"}} />
  <Composition id="BG-Data-Tunnel" component={Background} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{variant:"tunnel"}} />
  <Composition id="BG-Liquid-Gradient" component={Background} durationInFrames={150} fps={30} width={1280} height={720} defaultProps={{variant:"liquid"}} />
</Folder>;
