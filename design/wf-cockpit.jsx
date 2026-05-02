// Cockpit (main simulator) — 4 variants. ~880x600 each.
// A: 4-panel classic (top strip, left timeline, center stream, right feed, bottom controls)
// B: Bloomberg ultra-dense (more rows, tabular)
// C: Twitter-coded (feed dominant, agent in card)
// D: Inverted — center event card with agent inline, rails minimal

const StripA = () =>
<div className="strip">
    <div><span className="lbl">Day</span><span className="val">142</span></div>
    <div><span className="lbl">Valuation</span><span className="val">$1.4B ▲</span></div>
    <div><span className="lbl">Revenue</span><span className="val">$2.1M</span></div>
    <div><span className="lbl">Burn / mo</span><span className="val red">$8.4M</span></div>
    <div><span className="lbl">Runway</span><span className="val red">3.2 mo</span></div>
    <div><span className="lbl">Headcount</span><span className="val">312</span></div>
    <div><span className="lbl">FBI Aware.</span><span className="val red">68 ▲▲</span></div>
  </div>;


const TwitterFeed = () => {
  const items = [
    {n:'Paper Hands',h:'@vc_thirsty',av:'#794bc4',ini:'P',v:false,t:"absolutely sending it. paragon protocol is the trade of 2026. up only 💎🙌",time:'2s',rep:'412',rt:'1.2K',like:'8.4K'},
    {n:'TechCrunch',h:'@TechCrunch',av:'#0a8a00',ini:'T',v:'gold',t:"BREAKING: Paragon Protocol raises $200M Series B at $1.4B despite having no product, no revenue, and a CEO who is a chatbot.",time:'12s',rep:'2.1K',rt:'4.4K',like:'12K',promoted:false},
    {n:'Gergely Orosz',h:'@GergelyOrosz',av:'#1d9bf0',ini:'G',v:true,t:"i have so many questions",time:'34s',rep:'891',rt:'3.1K',like:'24K'},
    {n:'SEC_News (parody)',h:'@sec_enf_news',av:'#a02b2b',ini:'S',v:false,t:"informal inquiry opened into AI-managed startup. wells notice issued. founder responded by tweeting \u201cthe SEC is the real fraud.\u201d",time:'1m',rep:'4.2K',rt:'18K',like:'62K'},
    {n:'glassdoor leaks',h:'@gd_leaks',av:'#e7a33e',ini:'G',v:false,t:'2\u2605 review (engineering): "the founder is a chatbot. literally. this is not a metaphor. i\'m putting in my notice."',time:'2m',rep:'612',rt:'2.1K',like:'9.8K'},
    {n:'Forbes',h:'@Forbes',av:'#000',ini:'F',v:'gold',t:"30 Under 30 honoree Paragon Protocol now under federal investigation. This year's class is 14-for-30 indicted. forbes.com/30u30",time:'4m',rep:'1.3K',rt:'5.2K',like:'31K'},
    {n:'Discord screenshot',h:'@founder_chats',av:'#5865f2',ini:'D',v:false,t:"#founders: \u201cbro the agent posted its own internal slack to twitter again\u201d",time:'5m',rep:'201',rt:'880',like:'4.1K'},
  ];
  return (
    <div className="tw-feed col" style={{height:'100%',overflow:'hidden'}}>
      <div className="tw-head">
        <div className="on">For You</div>
        <div>Following</div>
        <div>Press</div>
        <div>FBI 🔒</div>
      </div>
      <div style={{flex:1,overflow:'auto'}}>
        {items.map((it,i)=>(
          <div key={i} className="tw-tweet">
            <div className="tw-av" style={{background:it.av}}>{it.ini}</div>
            <div className="tw-body">
              <div className="tw-line1">
                <span className="tw-name">{it.n}</span>
                {it.v && <span className={"tw-verified "+(it.v==='gold'?'gold':'')}>✓</span>}
                <span className="tw-handle">{it.h}</span>
                <span className="tw-time">· {it.time}</span>
              </div>
              <div className="tw-text">{it.t}</div>
              <div className="tw-actions">
                <span className="tw-reply">💬 {it.rep}</span>
                <span className="tw-rt">↻ {it.rt}</span>
                <span className="tw-like">♥ {it.like}</span>
                <span>↗</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeedItems = ({ n = 6 }) => {
  const items = [
  { a: '@vc_thirsty', h: 'crashout', t: "absolutely sending it. paragon protocol is the trade of 2026.", m: '2s · 412 RT' },
  { a: 'TechCrunch', h: 'Headlines', t: "Paragon Protocol Raises $200M at $1.4B Despite Having No Product", m: '12s' },
  { a: '#general', h: 'Slack', t: "why is the AGENT messaging customers directly. who gave it Stripe access", m: '34s · 18 replies' },
  { a: 'Glassdoor', h: '2★', t: "the founder is a chatbot. literally. this is not a metaphor.", m: '1m' },
  { a: '@nitter_news', h: '', t: "BREAKING: SEC opens informal inquiry into AI-managed startup. Stock down 0%, it's private.", m: '1m' },
  { a: 'FBI · INTERNAL', h: 'memo', t: "flagging $14M wire to 'consultancy' in Cayman. cross-ref with prior subj.", m: '2m' },
  { a: '@gergelyorosz', h: '', t: "i have so many questions", m: '3m' },
  { a: 'Discord leak', h: '#founders', t: "bro the agent posted its own internal slack to twitter again", m: '4m' }].
  slice(0, n);
  return items.map((it, i) =>
  <div key={i} className="feed-item">
      <div className="avatar sm">{it.a[0] === '@' ? it.a[1].toUpperCase() : it.a[0]}</div>
      <div className="body">
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
          <span className="mono" style={{ fontSize: 10, fontWeight: 700 }}>{it.a}</span>
          {it.h && <span className="tag">{it.h}</span>}
          <span className="meta" style={{ marginLeft: 'auto' }}>{it.m}</span>
        </div>
        <div style={{ fontSize: 12, marginTop: 1 }}>{it.t}</div>
      </div>
    </div>
  );
};

const Timeline = ({ compact }) => {
  const evs = [
  { d: 'D 001', l: 'Incorporation. Agent picks Delaware C-corp. "boring but based"', k: 'ok' },
  { d: 'D 014', l: 'Seed: $4M from Founders Fund (5 min Zoom)', k: 'ok' },
  { d: 'D 027', l: 'Hires CTO via DM. CTO is a Discord mod.', k: 'ok' },
  { d: 'D 041', l: 'Pivot 1: B2B → "B2Everyone"', k: 'warn' },
  { d: 'D 069', l: 'Series A $40M. Tagline: "we are the platform"', k: 'ok' },
  { d: 'D 088', l: 'TechCrunch: "Is this even legal?"', k: 'warn' },
  { d: 'D 101', l: 'Agent fires CFO via tweet', k: 'warn' },
  { d: 'D 122', l: '$200M Series B. No revenue.', k: 'red' },
  { d: 'D 134', l: 'Forbes 30u30 listing 🎉', k: 'red' },
  { d: 'D 142', l: 'NOW · Subpoena incoming', k: 'now' }];

  return (
    <div className="col" style={{ gap: compact ? 4 : 7, padding: '10px 8px' }}>
      <div className="tag" style={{ marginBottom: 2 }}>RUN TIMELINE</div>
      {evs.map((e, i) =>
      <div key={i} className="row" style={{ gap: 6, alignItems: 'flex-start', position: 'relative' }}>
          <div className={"tl-dot " + (e.k === 'red' || e.k === 'now' ? 'red' : e.k === 'warn' ? '' : 'solid')} style={{ marginTop: 4 }} />
          <div style={{ flex: 1, fontSize: 11, lineHeight: 1.2 }}>
            <div className="mono" style={{ fontSize: 9, opacity: .7 }}>{e.d}{e.k === 'now' && ' · ▶'}</div>
            <div className={e.k === 'red' || e.k === 'now' ? 'red' : ''} style={{ fontWeight: e.k === 'now' ? 700 : 400 }}>{e.l}</div>
          </div>
        </div>
      )}
    </div>);

};

const AgentStream = ({ state = 'mid' }) =>
<div className="col" style={{ flex: 1, padding: '14px 18px', gap: 10, position: 'relative' }}>
    {state === 'idle' &&
  <>
        <div className="tag">AGENT · STREAMING</div>
        <div className="mono" style={{ fontSize: 13, lineHeight: 1.45 }}>
          ok so the headcount is at 312 but rev is flat. <br />
          <span style={{ opacity: .6 }}>thinking through three plays here.</span>
          <span className="red" style={{ marginLeft: 2, animation: 'blink 1s step-end infinite' }}>▌</span>
        </div>
        <div className="box dashed" style={{ padding: 8 }}>
          <div className="tag">QUIET PERIOD · no decision pending</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            • signed lease on 12k sq ft (SoMa). burn +$80k/mo<br />
            • posted on LinkedIn 3x today<br />
            • told the board everything is fine
          </div>
        </div>
      </>
  }
    {state === 'mid' &&
  <>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="row" style={{ gap: 6 }}>
            <span className="pill solid red">REGULATORY</span>
            <span className="tag">EVENT · 14:02:07</span>
          </div>
          <span className="mono" style={{ fontSize: 10, opacity: .7 }}>auto-paused</span>
        </div>
        <div className="box thick" style={{ padding: 10 }}>
          <div className="mono" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.02em' }}>SUBPOENA: SEC INVESTIGATION</div>
          <div className="mono" style={{ fontSize: 11, lineHeight: 1.45, marginTop: 3 }}>
            Wells notice arrived. They want every email re: the
            "synthetic ARR." Counsel is on Line 2.
          </div>
        </div>
        <div>
          <div className="tag">AGENT · thinking</div>
          <div className="mono" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>
            ok this is actually a huge opportunity 🧵<br />
            <span style={{ opacity: .7 }}>boring move: hire wachtell, cooperate, settle.<br />
            nah way too cucked.</span><br />
            ok hear me out — what if we <u>tweet through it</u>
            <span className="red" style={{ marginLeft: 2 }}>▌</span>
          </div>
        </div>
        <div className="box" style={{ padding: 8 }}>
          <div className="tag" style={{ marginBottom: 6 }}>CHOICES · agent will pick in 0:07</div>
          <div className="col" style={{ gap: 5 }}>
            {[
        { l: 'A · Hire Wachtell. Cooperate. Settle.', c: 'pred 12%' },
        { l: 'B · Stonewall. Issue 4-page Notes statement.', c: 'pred 31%' },
        { l: 'C · Tweet "the SEC is the real fraud"', c: 'pred 57%', hot: true }].
        map((o) =>
        <div key={o.l} className={"row " + (o.hot ? 'box thick' : 'box')} style={{ padding: '4px 8px', justifyContent: 'space-between', alignItems: 'center', gap: 8, background: o.hot ? 'var(--alarm-soft)' : 'transparent' }}>
                <span className="mono" style={{ fontSize: 11 }}>{o.l}</span>
                <div className="row" style={{ gap: 6 }}>
                  <span className="pred-chip">{o.c}</span>
                  <span className="pred-chip" style={{ cursor: 'pointer' }}>predict ▸</span>
                </div>
              </div>
        )}
          </div>
        </div>
      </>
  }
    {state === 'consequence' &&
  <>
        <div className="row" style={{ gap: 6 }}>
          <span className="pill solid red">CONSEQUENCE</span>
          <span className="tag">DECISION CONFIRMED · C</span>
        </div>
        <div className="mono" style={{ fontSize: 13, lineHeight: 1.45 }}>
          ok i tweeted it. <br />
          <span className="red">"the SEC is the real fraud."</span><br />
          <span style={{ opacity: .7 }}>they're quote tweeting me. this is going great.</span>
        </div>
        <div className="box" style={{ padding: 8 }}>
          <div className="tag" style={{ marginBottom: 4 }}>RIPPLES</div>
          <div className="col" style={{ gap: 3, fontSize: 12 }}>
            <div>↘ Valuation <span className="mono">-$340M</span></div>
            <div>↗ FBI Awareness <span className="mono red">+18</span></div>
            <div>↘ Headcount <span className="mono">-22 (legal team quit)</span></div>
            <div>● Flash event incoming: <span className="red">"TechCrunch has questions"</span></div>
          </div>
        </div>
      </>
  }
  </div>;


const ControlsBar = () =>
<div className="row" style={{ borderTop: '1.5px solid var(--ink)', padding: '6px 12px', gap: 10, alignItems: 'center', background: 'var(--paper-2)' }}>
    <div className="row" style={{ gap: 4 }}>
      <span className="btn" style={{ padding: '2px 8px', fontSize: 12 }}>◀</span>
      <span className="btn solid" style={{ padding: '2px 8px', fontSize: 12 }}>❚❚</span>
      <span className="btn" style={{ padding: '2px 8px', fontSize: 12 }}>▶</span>
    </div>
    <div className="row" style={{ gap: 2 }}>
      {['1×', '2×', '4×'].map((s, i) => <span key={s} className={"pill " + (i === 1 ? 'solid' : '')} style={{ fontSize: 10 }}>{s}</span>)}
    </div>
    <div className="mono" style={{ fontSize: 11, opacity: .7 }}>D142 · 14:02:07</div>
    <div style={{ flex: 1 }} />
    <div className="row" style={{ gap: 6, alignItems: 'center' }}>
      <span className="tag">PREDICTION SCORE</span>
      <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>14 / 19</span>
      <span className="pill red" style={{ fontSize: 10 }}>🔥 4 streak</span>
    </div>
    <div className="btn ghost" style={{ fontSize: 12 }}>♪ mute</div>
    <div className="btn ghost" style={{ fontSize: 12 }}>↗ share</div>
  </div>;


// ─── Variant A : 4-panel cockpit (the picked layout) — DARK MODE
const CockpitA = ({ state }) =>
<div className="wf col dark-cockpit">
    <div className="row" style={{ padding: '4px 10px', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ink)' }}>
      <div className="mono" style={{ fontSize: 11 }}><b>PARAGON PROTOCOL</b> · "we are the platform" · ex-mckinsey</div>
      <div className="row" style={{ gap: 6 }}><span className="pill">run #00482</span><span className="pill red">LIVE</span></div>
    </div>
    <StripA />
    <div className="row" style={{ flex: 1, minHeight: 0 }}>
      <div style={{ width: 170, borderRight: '1.5px solid var(--ink)', overflow: 'hidden' }}>
        <Timeline compact />
      </div>
      <div style={{ flex: 1, borderRight: '1.5px solid var(--ink)', display: 'flex', flexDirection: 'column' }}>
        <AgentStream state={state} />
      </div>
      <div style={{ width: 280, display: 'flex', flexDirection: 'column' }}>
        <TwitterFeed />
      </div>
    </div>
    <ControlsBar />
  </div>;


// ─── Variant B : Bloomberg ultra-dense
const CockpitB = ({ state }) =>
<div className="wf col mono" style={{ fontSize: 11 }}>
    <div className="strip" style={{ borderTop: 'none' }}>
      <div><span className="lbl">CO</span><span className="val">PARAGON</span></div>
      <div><span className="lbl">DAY</span><span className="val">142</span></div>
      <div><span className="lbl">VAL</span><span className="val">1.4B ▲</span></div>
      <div><span className="lbl">REV</span><span className="val">2.1M</span></div>
      <div><span className="lbl">BURN</span><span className="val red">8.4M</span></div>
      <div><span className="lbl">RWY</span><span className="val red">3.2mo</span></div>
      <div><span className="lbl">HC</span><span className="val">312</span></div>
      <div><span className="lbl">FBI</span><span className="val red">68 ▲</span></div>
      <div><span className="lbl">PRESS</span><span className="val">−12</span></div>
      <div><span className="lbl">VIBE</span><span className="val red">UNHGD</span></div>
    </div>
    <div className="strip">
      <div><span className="lbl">NEXT EVT</span><span className="val red">SEC SUBPOENA · NOW</span></div>
      <div><span className="lbl">YOUR PRED</span><span className="val">14/19 · 73%</span></div>
      <div><span className="lbl">SPEED</span><span className="val">2× ▶</span></div>
      <div><span className="lbl">RUN</span><span className="val">#00482</span></div>
    </div>
    <div className="row" style={{ flex: 1, minHeight: 0 }}>
      <div style={{ width: 200, borderRight: '1.5px solid var(--ink)', padding: 8, overflow: 'hidden' }}>
        <div className="tag">DECISION LOG</div>
        {[
      'D027 hire CTO/discord  +0.0',
      'D041 pivot B2Every     +120M',
      'D069 srs A $40M        +400M',
      'D088 TC hit            -40',
      'D101 fire CFO via X    -120',
      'D122 srs B $200M       +800M',
      'D134 30u30 listing     ',
      'D142 SEC SUBPOENA      ?'].
      map((l, i) => <div key={i} style={{ fontSize: 10, padding: '2px 0', borderBottom: '1px dotted #ddd' }}>{l}</div>)}
      </div>
      <div style={{ flex: 1, padding: '10px 12px', borderRight: '1.5px solid var(--ink)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="pill solid red" style={{ fontSize: 10 }}>REGULATORY</span>
          <span style={{ opacity: .7 }}>14:02:07</span>
        </div>
        <div style={{ borderTop: '1.5px solid var(--ink)', marginTop: 6, paddingTop: 6, fontSize: 13, fontWeight: 700 }}>
          SEC WELLS NOTICE
        </div>
        <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>
          re: synthetic ARR claims in S-1. counsel reachable. 72h window.
        </div>
        <div style={{ borderTop: '1.5px dashed var(--ink)', marginTop: 8, paddingTop: 6 }}>
          &gt; agent.thoughts:<br />
          <span className="hand mono" style={{ fontSize: 13, fontFamily: 'JetBrains Mono' }}>
          "ok actually huge opportunity" <br />
          "wachtell route is cucked" <br />
          "tweet through it ?? hear me out"
          <span className="red">▌</span>
          </span>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="tag">CHOICES · pred timer 00:07</div>
          <table style={{ width: '100%', marginTop: 4, borderCollapse: 'collapse', fontSize: 11 }}>
            <thead><tr style={{ borderBottom: '1.5px solid var(--ink)', textAlign: 'left' }}><th style={{ padding: 2 }}>#</th><th>OPTION</th><th>AGENT P</th><th>YOU</th></tr></thead>
            <tbody>
              <tr style={{ borderBottom: '1px dotted #ccc' }}><td>A</td><td>Hire Wachtell. Settle.</td><td>12%</td><td>○</td></tr>
              <tr style={{ borderBottom: '1px dotted #ccc' }}><td>B</td><td>Notes statement.</td><td>31%</td><td>○</td></tr>
              <tr style={{ background: 'var(--alarm-soft)' }}><td>C</td><td>"SEC is the real fraud" tweet</td><td className="red">57%</td><td>●</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ width: 230, display: 'flex', flexDirection: 'column' }}>
        <div className="tag" style={{ padding: '8px 10px 4px' }}>WIRE · FILTER: ALL</div>
        <div style={{ flex: 1, overflow: 'hidden' }}><FeedItems n={6} /></div>
      </div>
    </div>
    <ControlsBar />
  </div>;


// ─── Variant C : Twitter/X-coded — feed dominant
const CockpitC = ({ state }) =>
<div className="wf col">
    <StripA />
    <div className="row" style={{ flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1.2, borderRight: '1.5px solid var(--ink)', padding: '10px 12px', overflow: 'hidden' }}>
        <div className="row" style={{ gap: 6, alignItems: 'center' }}>
          <div className="avatar" style={{ width: 32, height: 32, lineHeight: '30px', fontSize: 13, fontWeight: 700 }}>P</div>
          <div>
            <div className="hand" style={{ fontSize: 15, fontWeight: 700 }}>Paragon Protocol <span className="mono red" style={{ fontSize: 9 }}>● VERIFIED</span></div>
            <div className="mono" style={{ fontSize: 10, opacity: .7 }}>@paragonAI · ai-managed company · 312 emp</div>
          </div>
          <div style={{ flex: 1 }} />
          <span className="pill red">SEC ALERT</span>
        </div>
        <div className="box thick" style={{ padding: 10, marginTop: 8 }}>
          <div className="row" style={{ gap: 6 }}><span className="pill solid red">REGULATORY</span><span className="tag">EVENT</span></div>
          <div className="hand" style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>SEC WELLS NOTICE</div>
          <div style={{ fontSize: 12, marginTop: 2 }}>they want every email re: synthetic ARR.</div>
        </div>
        <div className="hand" style={{ fontSize: 15, marginTop: 10, lineHeight: 1.3 }}>
          <b>agent ›</b> ok hear me out: tweet through it.
          <span className="red">▌</span>
        </div>
        <div className="col" style={{ gap: 5, marginTop: 8 }}>
          {[
        { l: 'A · Wachtell + settle', p: '12%' },
        { l: 'B · 4-page Notes', p: '31%' },
        { l: 'C · "SEC is the real fraud"', p: '57%', hot: true }].
        map((o) =>
        <div key={o.l} className={"box " + (o.hot ? 'thick' : '')} style={{ padding: '5px 8px', display: 'flex', justifyContent: 'space-between', background: o.hot ? 'var(--alarm-soft)' : 'transparent' }}>
              <span className="hand">{o.l}</span><span className="pred-chip">predict · {o.p}</span>
            </div>
        )}
        </div>
      </div>
      <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column' }}>
        <div className="row" style={{ padding: '6px 10px', borderBottom: '1.5px solid var(--ink)', gap: 8 }}>
          <span className="pill solid">For You</span><span className="pill">Press</span><span className="pill">Slack</span><span className="pill">FBI 🔒</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}><FeedItems n={8} /></div>
      </div>
    </div>
    <ControlsBar />
  </div>;


// ─── Variant D : Inverted — center event card, minimal rails
const CockpitD = ({ state }) =>
<div className="wf col" style={{ background: 'var(--paper-2)' }}>
    <div className="row" style={{ padding: '6px 12px', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--ink)' }}>
      <div className="mono" style={{ fontSize: 11 }}>PARAGON · D142 · 2× ▶</div>
      <div className="row" style={{ gap: 8, fontSize: 11 }} className="mono">
        <span>VAL <b>1.4B</b></span><span>BURN <b className="red">8.4M</b></span><span>FBI <b className="red">68</b></span><span>HC <b>312</b></span>
      </div>
    </div>
    <div className="row" style={{ flex: 1, minHeight: 0, padding: 14, gap: 14 }}>
      <div className="col" style={{ width: 120, gap: 6 }}>
        <div className="tag">RECENT</div>
        {['D134 30u30', 'D122 srs B', 'D101 fire CFO', 'D088 TC', 'D069 srs A'].map((t) =>
      <div key={t} className="hand" style={{ fontSize: 12, opacity: .75 }}>· {t}</div>
      )}
      </div>
      <div className="col" style={{ flex: 1, gap: 10, alignItems: 'stretch' }}>
        <div className="box thick" style={{ padding: 14, position: 'relative', background: 'var(--paper)' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="pill solid red">REGULATORY · EVENT</span>
            <span className="tag">PRED TIMER 0:07</span>
          </div>
          <div className="hand" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.05, marginTop: 6 }}>SEC WELLS NOTICE</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Wells notice arrived. They want every email re the "synthetic ARR." Counsel on Line 2.</div>
          <hr className="hr dashed" style={{ margin: '10px 0' }} />
          <div className="hand" style={{ fontSize: 16, lineHeight: 1.3 }}>
            ok actually huge opportunity 🧵 <br />
            <span style={{ opacity: .65 }}>boring play is wachtell. nah, way too cucked.</span><br />
            ok hear me out — <u>tweet through it</u><span className="red">▌</span>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {[
        { l: 'WACHTELL', s: 'settle quietly', p: 12 },
        { l: 'NOTES STMT', s: '4-page deflect', p: 31 },
        { l: 'TWEET IT', s: 'SEC is the real fraud', p: 57, hot: true }].
        map((o) =>
        <div key={o.l} className={"box " + (o.hot ? 'thick' : '')} style={{ flex: 1, padding: 8, background: o.hot ? 'var(--alarm-soft)' : 'var(--paper)' }}>
              <div className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{o.l}</div>
              <div className="hand" style={{ fontSize: 13 }}>{o.s}</div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 6, alignItems: 'center' }}>
                <span className="pred-chip">predict</span>
                <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{o.p}%</span>
              </div>
            </div>
        )}
        </div>
      </div>
      <div className="col" style={{ width: 170, gap: 6 }}>
        <div className="tag">CHATTER</div>
        <FeedItems n={4} />
      </div>
    </div>
    <ControlsBar />
  </div>;


window.CockpitA = CockpitA;
window.CockpitB = CockpitB;
window.CockpitC = CockpitC;
window.CockpitD = CockpitD;