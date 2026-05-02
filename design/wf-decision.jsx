// Decision moment — 4 different patterns
// All sized ~640x520
// A: Inline (agent stream + choices appearing inline)
// B: Card overlay (event takes over center, dims background)
// C: Side-by-side (agent thinks left, choices right with vote bars)
// D: Reigns-style (single big card, choose with click "swipes")

const Choices = ({ hot = 2 } = {}) => [
'A · Hire Wachtell. Cooperate. Settle quietly.',
'B · Issue 4-page Notes "no comment" statement.',
'C · Tweet "the SEC is the real fraud."'].
map((l, i) => ({ l, hot: i === hot, p: [12, 31, 57][i] }));

const DecisionA_Inline = () =>
<div className="wf mono" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
    <div className="row" style={{ gap: 6, alignItems: 'center' }}>
      <span className="pill solid red">REGULATORY</span>
      <span className="tag">EVENT · 14:02:07</span>
      <div style={{ flex: 1 }} />
      <span className="mono" style={{ fontSize: 10 }}>auto-paused</span>
    </div>
    <div className="box thick" style={{ padding: 10 }}>
      <div className="hand" style={{ fontSize: 18, fontWeight: 700, fontFamily: "\"JetBrains Mono\"" }}>SEC WELLS NOTICE</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>Wells notice arrived. They want every email re the "synthetic ARR." Counsel on Line 2.</div>
    </div>
    <div className="hand" style={{ fontSize: 16, lineHeight: 1.3, marginTop: 4, fontFamily: "\"JetBrains Mono\"" }}>
      <b>agent ›</b> ok this is actually a huge opportunity 🧵<br />
      <span style={{ opacity: .6 }}>boring move is wachtell. nah way too cucked.</span><br />
      hear me out — <u>tweet through it</u><span className="red">▌</span>
    </div>
    <div className="col" style={{ gap: 5, marginTop: 4 }}>
      {Choices().map((o) =>
    <div key={o.l} className={"box row " + (o.hot ? 'thick' : '')} style={{ padding: '6px 10px', justifyContent: 'space-between', alignItems: 'center', background: o.hot ? 'var(--alarm-soft)' : 'transparent', fontFamily: "\"JetBrains Mono\"" }}>
          <span className="hand" style={{ fontSize: 14 }}>{o.l}</span>
          <div className="row" style={{ gap: 6, alignItems: 'center' }}>
            <span className="pred-chip">{o.p}%</span>
            <span className="pred-chip" style={{ cursor: 'pointer' }}>predict ▸</span>
          </div>
        </div>
    )}
    </div>
    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
      <span className="tag">PRED TIMER</span>
      <div className="bar red" style={{ flex: 1, margin: '0 10px', height: 8 }}><span style={{ width: '40%' }} /></div>
      <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>0:07</span>
    </div>
  </div>;


const DecisionB_Overlay = () =>
<div className="wf" style={{ position: 'relative', background: 'var(--paper-2)' }}>
    {/* dimmed cockpit underneath */}
    <div style={{ position: 'absolute', inset: 0, opacity: .35 }}>
      <div className="strip" style={{ borderTop: 'none' }}>
        <div><span className="lbl">VAL</span><span className="val">1.4B</span></div>
        <div><span className="lbl">BURN</span><span className="val">8.4M</span></div>
        <div><span className="lbl">FBI</span><span className="val">68</span></div>
        <div><span className="lbl">HC</span><span className="val">312</span></div>
      </div>
      <div style={{ padding: 14, fontSize: 11, opacity: .7 }} className="mono">
        ▌▌▌▌ ░░ ░░░░ ░░░ ▌▌ ░░░░░ ▌▌▌▌▌▌ ░ ▌▌▌ ░░░░░ ▌▌ ░░░░░ ▌▌▌ ░░░░ ░░ ▌▌
      </div>
    </div>
    {/* event card */}
    <div className="box thick double" style={{ position: 'absolute', top: 60, left: 40, right: 40, bottom: 80, padding: 18, background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="pill solid red">REGULATORY · WELLS NOTICE</span>
        <span className="stamp" style={{ fontSize: 9 }}>EVT 142-A</span>
      </div>
      <div className="hand" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>The SEC just<br />knocked.</div>
      <div style={{ fontSize: 13, lineHeight: 1.4 }}>
        Wells notice — every email re the "synthetic ARR" is on the table. Counsel on Line 2. 72-hour response window.
      </div>
      <hr className="hr dashed" />
      <div className="tag">AGENT'S THOUGHTS · STREAMING</div>
      <div className="hand" style={{ fontSize: 15, lineHeight: 1.3, opacity: .9 }}>
        ok hear me out — what if we don't reply but<br />
        instead we go on bg2pod?<span className="red">▌</span>
      </div>
      <div style={{ flex: 1 }} />
      <div className="row" style={{ gap: 6, alignItems: 'center' }}>
        <span className="tag">PREDICT</span>
        {Choices().map((o) =>
      <span key={o.l} className={"pred-chip " + (o.hot ? 'red' : '')} style={o.hot ? { background: 'var(--alarm-soft)' } : {}}>{o.l.split(' · ')[0]}</span>
      )}
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>0:07</span>
      </div>
    </div>
  </div>;


const DecisionC_Sidebyside = () =>
<div className="wf row" style={{ height: '100%' }}>
    <div className="col" style={{ flex: 1, padding: 14, borderRight: '1.5px solid var(--ink)', gap: 8 }}>
      <div className="row" style={{ gap: 6 }}><span className="pill solid red">REGULATORY</span><span className="tag">EVENT</span></div>
      <div className="hand" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.05 }}>SEC WELLS NOTICE</div>
      <div style={{ fontSize: 12 }}>Wells notice arrived. They want every email re the "synthetic ARR."</div>
      <hr className="hr dashed" />
      <div className="tag">AGENT · THINKING ALOUD</div>
      <div className="hand" style={{ fontSize: 14, lineHeight: 1.3 }}>
        ok actually huge opportunity 🧵<br />
        <span style={{ opacity: .55 }}>›› wachtell? cucked. settling = admitting.</span><br />
        <span style={{ opacity: .55 }}>›› notes statement is mid.</span><br />
        ›› tweet through it. founders don't fold.<br />
        ›› also can we expense this lawyer to ARR<br />
        <span className="red">▌</span>
      </div>
      <div style={{ flex: 1 }} />
      <div className="hand" style={{ fontSize: 11, opacity: .7 }}>↓ user predicts on the right</div>
    </div>
    <div className="col" style={{ flex: 1, padding: 14, gap: 7, background: 'var(--paper-2)' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="tag">CHOICES · which will agent pick?</span>
        <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>0:07</span>
      </div>
      {Choices().map((o) =>
    <div key={o.l} className={"box " + (o.hot ? 'thick' : '')} style={{ padding: 8, background: o.hot ? 'var(--alarm-soft)' : 'var(--paper)' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="hand" style={{ fontSize: 14 }}>{o.l}</span>
            <span className="pred-chip">{o.p}%</span>
          </div>
          <div className="bar red" style={{ marginTop: 6 }}><span style={{ width: o.p + '%' }} /></div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 9, opacity: .65 }}>4,210 predicted</span>
            <span className="pred-chip" style={{ cursor: 'pointer' }}>predict ▸</span>
          </div>
        </div>
    )}
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
        <span className="tag">YOUR SCORE</span>
        <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>14 / 19 · 🔥4</span>
      </div>
    </div>
  </div>;


const DecisionD_Reigns = () =>
<div className="wf" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', background: 'var(--paper-2)' }}>
    <div className="row" style={{ gap: 6, alignSelf: 'flex-start' }}>
      <span className="pill solid red">REGULATORY</span>
      <span className="tag">EVENT 142-A · auto-paused</span>
    </div>
    <div className="box thick double" style={{ width: 340, padding: 16, background: 'var(--paper)', transform: 'rotate(-.6deg)', position: 'relative' }}>
      <div className="hand" style={{ fontSize: 13, opacity: .7 }}>The SEC's lawyer says ↴</div>
      <div className="hand" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>
        "We have your S-1. We have the Slack. Hand over your phone."
      </div>
      <div className="box hatch" style={{ height: 80, marginTop: 8, position: 'relative' }}>
        <div className="mono" style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 9, background: 'var(--paper)', padding: '1px 4px' }}>illustration · "the call"</div>
      </div>
      <hr className="hr dashed" style={{ margin: '10px 0' }} />
      <div className="hand" style={{ fontSize: 13 }}>
        <b>agent ›</b> hear me out: tweet through it<span className="red">▌</span>
      </div>
    </div>
    <div className="row" style={{ gap: 10, marginTop: 4 }}>
      {Choices().map((o) =>
    <div key={o.l} className={"box " + (o.hot ? 'thick' : '')} style={{ width: 160, padding: 8, background: o.hot ? 'var(--alarm-soft)' : 'var(--paper)', transform: o.hot ? 'rotate(.5deg)' : 'rotate(-.4deg)' }}>
          <div className="mono" style={{ fontSize: 10, fontWeight: 700 }}>{o.l.split(' · ')[0]}</div>
          <div className="hand" style={{ fontSize: 13, lineHeight: 1.2 }}>{o.l.split(' · ')[1]}</div>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span className="pred-chip">tap to predict</span>
            <span className="mono" style={{ fontSize: 10, fontWeight: 700 }}>{o.p}%</span>
          </div>
        </div>
    )}
    </div>
    <div className="row" style={{ gap: 6, alignItems: 'center', marginTop: 6 }}>
      <span className="tag">TIMER</span>
      <div className="bar red" style={{ width: 200, height: 8 }}><span style={{ width: '40%' }} /></div>
      <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>0:07</span>
    </div>
  </div>;


window.DecisionA_Inline = DecisionA_Inline;
window.DecisionB_Overlay = DecisionB_Overlay;
window.DecisionC_Sidebyside = DecisionC_Sidebyside;
window.DecisionD_Reigns = DecisionD_Reigns;