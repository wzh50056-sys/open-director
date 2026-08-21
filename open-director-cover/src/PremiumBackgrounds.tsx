import {AbsoluteFill, Composition, Folder, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

type PremiumVariant = "silk" | "eclipse" | "prism" | "halo" | "ribbons" | "dust";

const loop = (frame: number, duration: number) => (frame / duration) * Math.PI * 2;

const Grain = ({opacity = 0.06}: {opacity?: number}) => {
  const frame = useCurrentFrame();
  const dots = Array.from({length: 90}, (_, i) => i);
  return <AbsoluteFill style={{opacity, mixBlendMode:"screen"}}>{dots.map((i) => (
    <i key={i} style={{position:"absolute",left:`${(i * 73 + frame * 0.3) % 101}%`,top:`${(i * 47 + frame * 0.16) % 103}%`,width:1 + i % 2,height:1 + i % 2,borderRadius:99,background:"white",opacity:.2 + (i % 5) * .12}} />
  ))}</AbsoluteFill>;
};

const SilkChrome = () => {
  const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig(); const t = loop(frame, durationInFrames);
  return <AbsoluteFill style={{overflow:"hidden",background:"#07080b"}}>
    <div style={{position:"absolute",width:1500,height:920,left:-100,top:-100,filter:"blur(12px)",rotate:`${-4 + Math.sin(t) * 2}deg`,translate:`${Math.sin(t) * 28}px ${Math.cos(t) * 18}px`,background:"radial-gradient(ellipse at 19% 50%,rgba(255,255,255,.22),transparent 15%), radial-gradient(ellipse at 73% 54%,rgba(165,177,199,.2),transparent 18%), linear-gradient(112deg,#050609 17%,#343943 27%,#08090d 37%,#11141a 54%,#747b86 63%,#090a0e 73%,#292d35 83%,#050609 92%)",borderRadius:"44% 56% 41% 59% / 55% 42% 58% 45%"}} />
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 22%,rgba(0,0,0,.7) 100%)"}} /><Grain opacity={.035}/>
  </AbsoluteFill>;
};

const Eclipse = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const t=loop(frame,durationInFrames);
  return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(145deg,#030405,#0a0b0d 55%,#040506)"}}>
    <div style={{position:"absolute",width:600,height:600,left:340,top:55,borderRadius:999,background:"#020203",boxShadow:`${Math.cos(t)*18}px ${Math.sin(t)*10}px 65px rgba(255,199,144,.35), 0 0 170px rgba(255,91,52,.13)`}} />
    <div style={{position:"absolute",width:610,height:610,left:335+Math.cos(t)*10,top:50+Math.sin(t)*6,borderRadius:999,border:"1px solid rgba(255,220,185,.38)",filter:"blur(.2px)",boxShadow:"inset 0 0 28px rgba(255,185,119,.12),0 0 26px rgba(255,130,76,.16)"}} />
    <div style={{position:"absolute",left:140,top:340,width:1000,height:1,background:"linear-gradient(90deg,transparent,rgba(255,177,111,.32),rgba(255,255,255,.55),rgba(255,177,111,.3),transparent)",boxShadow:"0 0 25px rgba(255,144,82,.2)",opacity:.65+Math.sin(t)*.15}} /><Grain opacity={.055}/>
  </AbsoluteFill>;
};

const GlassPrism = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const t=loop(frame,durationInFrames);
  return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(135deg,#07090d,#10131b 52%,#06070a)"}}>
    {[0,1,2].map((i)=><div key={i} style={{position:"absolute",width:520-i*50,height:760,left:130+i*340+Math.sin(t+i)*28,top:-30+Math.cos(t+i)*18,rotate:`${-24+i*25+Math.sin(t+i)*3}deg`,borderRadius:58,background:"linear-gradient(120deg,rgba(255,255,255,.02),rgba(255,255,255,.13) 48%,rgba(255,255,255,.015) 55%)",border:"1px solid rgba(255,255,255,.12)",boxShadow:"inset 18px 0 50px rgba(255,255,255,.035),0 30px 80px rgba(0,0,0,.38)",backdropFilter:"blur(20px)"}} />)}
    <div style={{position:"absolute",width:720,height:240,left:280,top:250,background:"linear-gradient(90deg,rgba(103,224,255,.16),rgba(173,117,255,.18),rgba(255,113,164,.13))",filter:"blur(80px)",rotate:`${Math.sin(t)*5}deg`}} /><div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent,rgba(0,0,0,.58))"}} />
  </AbsoluteFill>;
};

const SoftHalo = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const t=loop(frame,durationInFrames);
  return <AbsoluteFill style={{overflow:"hidden",background:"#080a10"}}>
    {[0,1,2,3].map((i)=><div key={i} style={{position:"absolute",left:640-(300+i*105)/2,top:360-(300+i*105)/2,width:300+i*105,height:300+i*105,borderRadius:999,border:`${34-i*5}px solid rgba(${i%2?135:238},${i%2?153:174},${i%2?255:190},${.12-i*.018})`,filter:`blur(${18+i*8}px)`,scale:1+Math.sin(t+i*.8)*.035}} />)}
    <div style={{position:"absolute",width:390,height:390,left:445,top:165,borderRadius:999,background:"radial-gradient(circle,rgba(242,244,255,.13),rgba(118,132,255,.07) 45%,transparent 70%)",boxShadow:"0 0 130px rgba(110,130,255,.12)"}} /><Grain opacity={.04}/>
  </AbsoluteFill>;
};

const LightRibbons = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const t=loop(frame,durationInFrames);
  return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(180deg,#05070a,#090b10)"}}>
    {[0,1,2,3,4].map((i)=><div key={i} style={{position:"absolute",width:1500,height:110+i*16,left:-110,top:110+i*105+Math.sin(t+i*.85)*44,borderRadius:"50%",borderTop:`${2+i}px solid rgba(${i<2?255:142},${i<2?235:190},${i<2?210:255},${.2-i*.018})`,rotate:`${-8+i*3+Math.cos(t+i)*3}deg`,filter:`blur(${i*1.8}px)`,boxShadow:i===1?"0 -12px 45px rgba(255,190,140,.12)":"0 -10px 35px rgba(117,147,255,.08)"}} />)}
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 48%,transparent 14%,rgba(0,0,0,.62) 90%)"}} /><Grain opacity={.03}/>
  </AbsoluteFill>;
};

const CosmicDust = () => {
  const frame=useCurrentFrame(); const {durationInFrames}=useVideoConfig(); const t=loop(frame,durationInFrames);
  const stars=Array.from({length:120},(_,i)=>i);
  return <AbsoluteFill style={{overflow:"hidden",background:"radial-gradient(ellipse at 50% 45%,#10131b,#030405 72%)"}}>
    <div style={{position:"absolute",width:960,height:280,left:160,top:220,rotate:`${-12+Math.sin(t)*2}deg`,background:"linear-gradient(90deg,transparent,rgba(227,183,144,.11),rgba(137,151,201,.13),transparent)",filter:"blur(45px)",borderRadius:"50%"}} />
    {stars.map((i)=>{const x=(i*83)%1280; const base=(i*151)%720; return <i key={i} style={{position:"absolute",left:x+Math.sin(t+i)*8,top:base+Math.cos(t+i*.7)*5,width:i%19===0?3:1,height:i%19===0?3:1,borderRadius:99,background:i%7===0?"#ffd9b6":"#dce4ff",opacity:interpolate(Math.sin(t+i*.61),[-1,1],[.08,.72]),boxShadow:i%19===0?"0 0 12px currentColor":"none"}} />})}
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 18%,rgba(0,0,0,.63) 100%)"}} />
  </AbsoluteFill>;
};

const PremiumBackground = ({variant}: {variant: PremiumVariant}) => {
  if (variant === "silk") return <SilkChrome/>;
  if (variant === "eclipse") return <Eclipse/>;
  if (variant === "prism") return <GlassPrism/>;
  if (variant === "halo") return <SoftHalo/>;
  if (variant === "ribbons") return <LightRibbons/>;
  return <CosmicDust/>;
};

const defs: Array<[string, PremiumVariant]> = [["Premium-Silk-Chrome","silk"],["Premium-Eclipse","eclipse"],["Premium-Glass-Prism","prism"],["Premium-Soft-Halo","halo"],["Premium-Light-Ribbons","ribbons"],["Premium-Cosmic-Dust","dust"]];

export const PremiumBackgroundCompositions = () => <Folder name="Premium-Backgrounds">{defs.map(([id,variant])=><Composition key={id} id={id} component={PremiumBackground} durationInFrames={180} fps={30} width={1280} height={720} defaultProps={{variant}} />)}</Folder>;
