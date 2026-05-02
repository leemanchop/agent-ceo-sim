// Top-level app — DesignCanvas with sections of artboards + Tweaks panel.

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "color": "alarm",
  "state": "mid",
  "voice": "mid",
  "showCockpitVariant": "all"
}/*EDITMODE-END*/;

function App(){
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(()=>{
    document.body.dataset.color = tw.color;
    document.body.dataset.state = tw.state;
    document.body.dataset.voice = tw.voice;
  },[tw]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="landing" title="① Landing / Onboarding"
          subtitle="founder upload — keep it under 30 seconds. 4 framings.">
          <DCArtboard id="L1" label="A · Tabloid hero" width={440} height={640}><div className="dark-frame" style={{height:'100%'}}><LandingA_Tabloid/></div></DCArtboard>
          <DCArtboard id="L2" label="B · Terminal boot" width={440} height={640}><div className="dark-frame" style={{height:'100%'}}><LandingB_Terminal/></div></DCArtboard>
          <DCArtboard id="L3" label="C · Founder card" width={440} height={640}><div className="dark-frame" style={{height:'100%'}}><LandingC_Card/></div></DCArtboard>
          <DCArtboard id="L4" label="D · Magazine cover" width={440} height={640}><div className="dark-frame" style={{height:'100%'}}><LandingD_Magazine/></div></DCArtboard>
        </DCSection>

        <DCSection id="cockpit" title="② Main Cockpit (desktop)"
          subtitle="4-panel base + 3 remixes. Toggle agent state from the tweaks panel.">
          <DCArtboard id="C1" label="A · 4-panel classic (picked layout)" width={880} height={600}><CockpitA state={tw.state}/></DCArtboard>
        </DCSection>

        <DCSection id="decision" title="③ Decision Moment"
          subtitle="The 15-30s engagement loop — inline within agent stream.">
          <DCArtboard id="D1" label="A · Inline (in stream)" width={640} height={520}><div className="dark-frame" style={{height:'100%'}}><DecisionA_Inline/></div></DCArtboard>
        </DCSection>

        <DCPostIt top={20} left={40} rotate={-3} width={210}>
          low-fi wireframes — structure first, polish later. all variants share the same agent voice and event ("SEC wells notice") so you can compare apples-to-apples.
        </DCPostIt>
        <DCPostIt top={140} right={40} rotate={2} width={200}>
          tweaks panel ↗ — flip layout state (idle / mid-decision / consequence), swap color treatment, dial agent spiciness.
        </DCPostIt>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="State">
          <TweakRadio
            label="Agent state"
            value={tw.state}
            onChange={v=>setTweak('state',v)}
            options={[
              {value:'idle',label:'Idle'},
              {value:'mid',label:'Mid-decision'},
              {value:'consequence',label:'Consequence'},
            ]}
          />
        </TweakSection>
        <TweakSection title="Color">
          <TweakRadio
            label="Treatment"
            value={tw.color}
            onChange={v=>setTweak('color',v)}
            options={[
              {value:'alarm',label:'B&W + red'},
              {value:'bw',label:'Pure B&W'},
            ]}
          />
        </TweakSection>
        <TweakSection title="Agent voice">
          <TweakRadio
            label="Spiciness"
            value={tw.voice}
            onChange={v=>setTweak('voice',v)}
            options={[
              {value:'mild',label:'Mild'},
              {value:'mid',label:'Mid'},
              {value:'unhinged',label:'Unhinged'},
            ]}
          />
          <div style={{fontSize:11,opacity:.7,marginTop:6,lineHeight:1.3,fontFamily:'ui-sans-serif,system-ui,sans-serif'}}>
            {tw.voice==='mild' && '"This requires careful consideration of stakeholder impact."'}
            {tw.voice==='mid' && '"ok hear me out — what if we tweet through it 🧵"'}
            {tw.voice==='unhinged' && '"the SEC is the real fraud. respectfully. fwd: legal@. they\'ll get it."'}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
