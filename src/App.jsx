import { useMemo, useState } from "react";

const DECISIONS = {
  now: { label: "Do Now", cost: 2, color: "#38b58a" },
  enable: { label: "Enable for Later", cost: 1, color: "#8067d8" },
  later: { label: "Add Later", cost: 0, color: "#7f8993" },
};

const HOTSPOTS = [
  { id:"camera", label:"Clinical Camera", x:47, y:15, tier:"Required", why:"Virtual assessment depends on a reliable view of the patient and care environment.", ripple:"Coordinate mounting, field of view, privacy, power/data, service access and replacement." },
  { id:"audio", label:"Audio Array", x:34, y:18, tier:"Required", why:"Two-way communication should work without asking the patient or bedside team to manage another device.", ripple:"Plan microphone and speaker coverage, acoustics, privacy, pathways and maintainability." },
  { id:"display", label:"Shared Digital Footwall", x:78, y:38, tier:"Required", why:"The display becomes a shared surface for the patient, family, bedside team and virtual nurse.", ripple:"Resolve viewing angles, glare, mounting, cleanability, power/data and visibility from multiple zones." },
  { id:"headwall", label:"Digital Headwall", x:24, y:45, tier:"Required", why:"The headwall is where clinical infrastructure and future digital capability converge.", ripple:"Protect pathways and capacity for power, data, devices, integration, maintenance and future change." },
  { id:"monitor", label:"Monitor Integration", x:39, y:46, tier:"Required", why:"Virtual clinicians need useful clinical context without creating a parallel workflow.", ripple:"Coordinate device integration, cabling, network reliability, viewing and escalation workflows." },
  { id:"lighting", label:"Adaptive Lighting", x:61, y:18, tier:"Enhanced", why:"Virtual rounding may need assessment lighting without disrupting patient rest.", ripple:"Provide camera-supportive lighting scenes, dimming and bedside overrides." },
  { id:"shades", label:"Smart Window Shades", x:89, y:44, tier:"Enhanced", why:"Glare can undermine virtual interaction and visual assessment.", ripple:"Plan controls, glare management, manual override and automation readiness." },
  { id:"family", label:"Family Collaboration Zone", x:79, y:72, tier:"Enhanced", why:"Virtual nursing often includes education, discharge and family participation.", ripple:"Protect display sightlines, audio coverage, privacy, seating orientation and charging." },
  { id:"workstation", label:"Bedside Workstation", x:62, y:69, tier:"Enhanced", why:"Bedside and virtual workflows must coexist without duplicated documentation.", ripple:"Coordinate ergonomics, visibility, device access, cleanability, power/data and collaboration." },
];

const SCOPE = [
  { name:"Pilot", tag:"Learn fast", description:"Prove the experience in a focused setting before you scale.", resources:"Focused change team • local champions • limited implementation reach", tension:"Lower exposure, but pilot-only decisions may create rework when you scale." },
  { name:"Selected Unit", tag:"Make it real", description:"Design virtual nursing as a repeatable operating model across a full unit.", resources:"Unit leadership • clinical + IT support • moderate change capacity", tension:"Enough scale to expose real workflow and space issues, without enterprise-wide resources." },
  { name:"Enterprise", tag:"Think big", description:"Set a system vision that can work across units, facilities and future conditions.", resources:"Broader governance • cross-functional teams • greater coordination capacity", tension:"More reach, but complexity, consistency and future-proofing matter from day one." },
];

const FACILITY = [
  { name:"New Facility", tag:"Design it in", description:"Intentionally integrate virtual care into rooms, units and infrastructure.", resources:"Greatest design flexibility • coordinated pathways • planned infrastructure", tension:"More opportunity creates more expectation. Decide what belongs now versus later." },
  { name:"Renovation", tag:"Work with what you have", description:"Improve an existing environment while protecting operations and inherited conditions.", resources:"Selective capital • phased access • existing infrastructure to reuse", tension:"Every intervention competes with disruption, constructability and existing conditions." },
  { name:"Technology Overlay", tag:"Move quickly", description:"Add capability with minimal construction and lean on what the facility already supports.", resources:"Fast deployment • limited construction • technology-led implementation", tension:"Speed is attractive, but missed power, data, mounting, acoustics or workflow needs can become future debt." },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [scope, setScope] = useState("");
  const [facility, setFacility] = useState("");
  const [active, setActive] = useState(null);
  const [choices, setChoices] = useState({});
  const budget = 10;
  const used = useMemo(() => Object.values(choices).reduce((sum, key) => sum + DECISIONS[key].cost, 0), [choices]);
  const remaining = budget - used;
  const selected = HOTSPOTS.find((h) => h.id === active);

  function makeChoice(id, decision) {
    const previous = choices[id] ? DECISIONS[choices[id]].cost : 0;
    if (DECISIONS[decision].cost - previous > remaining) return;
    setChoices((current) => ({ ...current, [id]: decision }));
    setActive(null);
  }

  if (step === 0) return <ChoiceScreen eyebrow="ROUND 1 • SET YOUR AMBITION" title="How far are you trying to take virtual nursing?" subtitle="There is no safe answer. Your deployment choice changes the pressure on people, operations and design." options={SCOPE} onPick={(v)=>{setScope(v);setStep(1);}} />;
  if (step === 1) return <ChoiceScreen eyebrow="ROUND 2 • MEET YOUR BUILDING" title="What reality does the vision have to live in?" subtitle="The same virtual nursing vision can feel very different when the building fights back." options={FACILITY} onPick={(v)=>{setFacility(v);setStep(2);}} onBack={()=>setStep(0)} />;

  return <div className="app">
    <header className="header">
      <div><div className="kicker">VIRTUAL NURSING • RIPPLE EFFECT</div><h1>Explore the patient room</h1></div>
      <div className="stats"><Stat value={`${Object.keys(choices).length}/9`} label="decisions"/><Stat value={remaining} label="tokens left"/><button className="secondary" onClick={()=>{setChoices({});setActive(null);}}>Reset room</button></div>
    </header>
    <div className="legend">
      <Key color="#e59a32" text="Explore"/><Key color={DECISIONS.now.color} text="Do Now • 2"/><Key color={DECISIONS.enable.color} text="Enable • 1"/><Key color={DECISIONS.later.color} text="Add Later • 0"/>
      <span className="context">{scope} • {facility} • 10-token room budget</span>
    </div>
    <main className="stage">
      <img className="room-photo" src={`${import.meta.env.BASE_URL}images/virtual-nursing-room.jpg`} alt="Virtual nursing patient room" />
      {HOTSPOTS.map((h)=>{ const decision=choices[h.id]; const color=decision?DECISIONS[decision].color:"#e59a32"; return <button className="hotspot" key={h.id} onClick={()=>setActive(h.id)} style={{left:`${h.x}%`,top:`${h.y}%`,background:color,boxShadow:`0 0 0 6px ${color}42, 0 8px 18px #001b`}}><span>{decision?"✓":"+"}</span><b>{h.label}</b></button>; })}
      {selected && <aside className="panel">
        <button className="close" onClick={()=>setActive(null)}>×</button><span className="tier">{selected.tier}</span><h2>{selected.label}</h2>
        <Info title="Why it matters">{selected.why}</Info><Info title="Architectural ripple">{selected.ripple}</Info>
        <h3>What belongs in the roadmap?</h3>
        {Object.entries(DECISIONS).map(([key,d])=>{const prior=choices[selected.id]?DECISIONS[choices[selected.id]].cost:0;const blocked=d.cost-prior>remaining;return <button className="decision" key={key} disabled={blocked} onClick={()=>makeChoice(selected.id,key)} style={{borderColor:d.color,opacity:blocked?.42:1}}><b style={{color:d.color}}>{d.label.toUpperCase()}</b><span>{d.cost} token{d.cost===1?"":"s"}{blocked?" • insufficient tokens":""}</span></button>;})}
      </aside>}
    </main>
    <footer><span><b>Build a visual decision map.</b> Decide what belongs now, what should be enabled, and what can wait.</span><button className="primary" onClick={()=>setStep(1)}>Change context</button></footer>
  </div>;
}

function ChoiceScreen({eyebrow,title,subtitle,options,onPick,onBack}) { return <div className="setup"><div className="kicker">{eyebrow}</div><h1>{title}</h1><p className="setup-sub">{subtitle}</p><div className="cards">{options.map((o,i)=><button className="card" key={o.name} onClick={()=>onPick(o.name)} style={{borderTopColor:["#ef9d3a","#46c7b0","#8b70e8"][i]}}><div><span className="tag">{o.tag}</span><h2>{o.name}</h2><p>{o.description}</p><Box title="WHAT YOU HAVE">{o.resources}</Box><Box title="THE CATCH" catchBox>{o.tension}</Box></div><strong>Choose this path →</strong></button>)}</div>{onBack&&<button className="secondary" onClick={onBack}>← Back</button>}</div>; }
function Box({title,children,catchBox}) { return <div className={catchBox?"box catch":"box"}><b>{title}</b><div>{children}</div></div>; }
function Info({title,children}) { return <section className="info"><b>{title}</b><p>{children}</p></section>; }
function Stat({value,label}) { return <div className="stat"><b>{value}</b><span>{label}</span></div>; }
function Key({color,text}) { return <span className="key"><i style={{background:color}}/>{text}</span>; }
