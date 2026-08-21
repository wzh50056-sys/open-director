import {AbsoluteFill, Composition, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {BackgroundCompositions} from "./Backgrounds";
import {PremiumBackgroundCompositions} from "./PremiumBackgrounds";
import {MaxFxCompositions} from "./MaxFxBackgrounds";

type CoverProps = {readonly eyebrow: string; readonly title: string; readonly accent: string};

const PlayMark = () => <div style={{width:112,height:112,borderRadius:34,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg,#ff7b82 0%,#f04ca4 48%,#8e54ff 100%)",boxShadow:"0 22px 70px rgba(212,70,201,.42),inset 0 1px 0 rgba(255,255,255,.55)",border:"1px solid rgba(255,255,255,.28)"}}><div style={{width:0,height:0,marginLeft:8,borderTop:"22px solid transparent",borderBottom:"22px solid transparent",borderLeft:"34px solid white"}} /></div>;

const Timeline = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <Interactive.Div name="Creative timeline" style={{position:"absolute",left:88,right:88,bottom:116,height:270,padding:"32px 34px",borderRadius:42,background:"linear-gradient(160deg,rgba(24,25,49,.94),rgba(10,10,25,.94))",border:"1px solid rgba(255,255,255,.12)",boxShadow:"0 38px 90px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.08)",opacity:interpolate(frame,[1*fps,2*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)}),translate:interpolate(frame,[1*fps,2*fps],["0px 80px","0px 0px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)})}}>
    <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:28}}><span style={{width:11,height:11,borderRadius:99,background:"#ff6d78"}}/><span style={{width:11,height:11,borderRadius:99,background:"#ffc65f"}}/><span style={{width:11,height:11,borderRadius:99,background:"#54e3a5"}}/><span style={{marginLeft:10,fontSize:20,letterSpacing:3,color:"#777b94"}}>DIRECTOR TIMELINE</span></div>
    <div style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:14,alignItems:"center"}}><span style={{fontSize:20,color:"#969ab2"}}>画面</span><div style={{height:55,borderRadius:15,background:"linear-gradient(90deg,#ee667d,#dd50b7 45%,#835eff)",padding:8,display:"flex",gap:7}}>{[0,1,2,3,4].map((n)=><div key={n} style={{flex:1,borderRadius:9,background:"rgba(255,220,255,.16)",border:"1px solid rgba(255,255,255,.14)"}}/>)}</div><span style={{fontSize:20,color:"#969ab2"}}>旁白</span><div style={{height:42,display:"flex",alignItems:"center",gap:6,padding:"0 16px",borderRadius:13,background:"rgba(83,220,190,.13)",border:"1px solid rgba(83,220,190,.28)"}}>{[13,22,31,18,36,25,15,33,40,24,34,17,29,38,20,30,14,26,34,19,28,16,24,32].map((h,i)=><span key={i} style={{flex:1,height:h,borderRadius:99,background:"linear-gradient(#73f0d3,#3ab6e7)"}}/>)}</div></div>
    <div style={{position:"absolute",top:73,bottom:20,left:interpolate(frame,[2*fps,5.5*fps],[250,870],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),width:3,borderRadius:9,background:"#fff",boxShadow:"0 0 18px rgba(255,255,255,.9)"}}/>
  </Interactive.Div>;
};

export const OpenDirectorCover = ({eyebrow,title,accent}: CoverProps) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  return <AbsoluteFill style={{overflow:"hidden",background:"#080912",color:"white",fontFamily:'Inter,"PingFang SC","Microsoft YaHei",sans-serif'}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 12%,rgba(114,76,255,.34),transparent 37%),radial-gradient(circle at 10% 55%,rgba(255,93,120,.20),transparent 38%),linear-gradient(165deg,#111323 0%,#080912 55%,#06070c 100%)"}}/>
    <div style={{position:"absolute",inset:0,opacity:.18,backgroundImage:"linear-gradient(rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.09) 1px,transparent 1px)",backgroundSize:"72px 72px",maskImage:"linear-gradient(to bottom,black,transparent 76%)"}}/>
    <div style={{position:"absolute",width:720,height:720,left:-390,top:400,borderRadius:999,border:"1px solid rgba(255,118,149,.26)",boxShadow:"0 0 130px rgba(246,68,142,.14)"}}/><div style={{position:"absolute",width:560,height:560,right:-330,top:190,borderRadius:999,border:"1px solid rgba(139,94,255,.30)",boxShadow:"0 0 130px rgba(112,78,255,.18)"}}/><div style={{position:"absolute",left:126,top:170,width:15,height:15,rotate:"45deg",borderRadius:3,background:"linear-gradient(135deg,#fff4c8,#ffb05c)",boxShadow:"0 0 28px rgba(255,179,92,.9)"}}/>
    <Interactive.Div name="Brand" style={{position:"absolute",top:112,left:88,right:88,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:interpolate(frame,[0,.8*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)})}}><div style={{display:"flex",alignItems:"center",gap:24}}><PlayMark/><div><div style={{fontSize:42,lineHeight:1,fontWeight:760,letterSpacing:-1.5}}>OpenDirector</div><div style={{fontSize:18,marginTop:12,letterSpacing:6,color:"#8f93ad"}}>AI VIDEO STUDIO</div></div></div><div style={{padding:"14px 22px",borderRadius:999,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.05)",fontSize:17,color:"#c9cce0",letterSpacing:2}}>OPEN SOURCE</div></Interactive.Div>
    <div style={{position:"absolute",left:88,right:88,top:410}}>
      <Interactive.Div name="Eyebrow" style={{display:"inline-flex",alignItems:"center",gap:16,padding:"14px 22px",borderRadius:999,background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.12)",fontSize:24,fontWeight:600,letterSpacing:3,color:"#d4d6e8",opacity:interpolate(frame,[.35*fps,1.15*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)}),translate:interpolate(frame,[.35*fps,1.15*fps],["0px 34px","0px 0px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)})}}><span style={{color:"#ffba65"}}>✦</span>{eyebrow}</Interactive.Div>
      <Interactive.Div name="Main title" style={{marginTop:46,width:900,fontSize:132,lineHeight:1.08,letterSpacing:-9,fontWeight:900,opacity:interpolate(frame,[.7*fps,1.7*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)}),translate:interpolate(frame,[.7*fps,1.7*fps],["0px 70px","0px 0px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)})}}>{title}</Interactive.Div>
      <Interactive.Div name="Accent title" style={{marginTop:22,fontSize:118,lineHeight:1.05,letterSpacing:-7,fontWeight:900,color:"transparent",backgroundImage:"linear-gradient(92deg,#ff8c82 0%,#f267c1 48%,#9f75ff 100%)",backgroundClip:"text",WebkitBackgroundClip:"text",opacity:interpolate(frame,[1.05*fps,2.05*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)}),translate:interpolate(frame,[1.05*fps,2.05*fps],["0px 70px","0px 0px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)})}}>{accent}</Interactive.Div>
      <Interactive.Div name="Supporting copy" style={{marginTop:54,width:840,fontSize:36,lineHeight:1.65,fontWeight:450,color:"#a7abc2",letterSpacing:1,opacity:interpolate(frame,[1.4*fps,2.4*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)})}}>一句话生成脚本、分镜、素材与成片。<br/>把每一个灵感，导演成值得被看见的故事。</Interactive.Div>
    </div><Timeline/>
  </AbsoluteFill>;
};

export const RemotionCompositions=()=> <>
  <Composition id="OpenDirectorCover" component={OpenDirectorCover} durationInFrames={180} fps={30} width={1080} height={1920} defaultProps={{eyebrow:"开源 AI 短视频创作工作台",title:"从一个灵感",accent:"导演一支视频"}}/>
      <BackgroundCompositions />
      <PremiumBackgroundCompositions />
      <MaxFxCompositions />
</>;
