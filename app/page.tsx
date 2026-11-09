'use client'

import { useMemo, useState } from 'react'
import {
  Activity, BarChart3, Bell, BookOpen, BriefcaseBusiness, CalendarDays, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, FileText, Filter, LayoutDashboard,
  Mail, Menu, MoreHorizontal, Plus, Search, Send, Settings, ShieldCheck, SlidersHorizontal,
  Target, TrendingUp, UserRound, Users, X, Zap
} from 'lucide-react'

type Lead = { id: string; name: string; company: string; product: string; source: string; owner: string; status: string; priority: string; date: string; initials: string }

const products = ['All products', 'Z-Factory', 'Z-Tracs', 'Z-Market', 'Z-Drone', 'Z-Consultancy']
const nav = [
  { label: 'Overview', icon: LayoutDashboard }, { label: 'Leads & Requests', icon: Users, count: 24 },
  { label: 'Brochure Downloads', icon: BookOpen }, { label: 'Schedule', icon: CalendarDays, count: 3 },
  { label: 'Messages', icon: Mail, count: 8 }, { label: 'Marketing Campaigns', icon: Target },
  { label: 'Direct Mail', icon: Send }, { label: 'Quotations', icon: FileText },
  { label: 'Lead Assignment', icon: ClipboardCheck }, { label: 'Acknowledgements', icon: ShieldCheck },
  { label: 'Reports & Analytics', icon: BarChart3 }, { label: 'Settings', icon: Settings },
]
const leads: Lead[] = [
  ['LD-1048','Aarav Mehta','Vertex Manufacturing','Z-Factory','Website enquiry','Priya Nair','New','High','Today','AM'],
  ['LD-1047','Sofia Rodriguez','Northstar Logistics','Z-Tracs','Brochure download','Rohan Kapoor','Qualified','Medium','Today','SR'],
  ['LD-1046','Daniel Chen','Harbor Infrastructure','Z-Drone','Marketing campaign','Ananya Shah','Demo Scheduled','High','Yesterday','DC'],
  ['LD-1045','Maya Patel','UrbanCart Retail','Z-Market','Referral','Priya Nair','Contacted','Medium','Yesterday','MP'],
  ['LD-1044','Ethan Williams','Apex Industrial','Z-Factory','Direct outreach','Rohan Kapoor','Proposal Sent','Urgent','12 Jun 2024','EW'],
  ['LD-1043','Nisha Menon','BluePeak Ports','Z-Tracs','Website enquiry','Ananya Shah','Negotiation','High','11 Jun 2024','NM'],
  ['LD-1042','Lucas Martin','Orion Systems','Z-Consultancy','Marketing campaign','Priya Nair','New','Low','10 Jun 2024','LM'],
  ['LD-1041','Ishita Rao','BuildWell Group','Z-Factory','Brochure download','Rohan Kapoor','Won','Medium','10 Jun 2024','IR'],
]
const stats = [
  { label:'Total leads', value:'248', change:'+12.5%', icon:Users, color:'violet' }, { label:'New leads', value:'42', change:'+8.2%', icon:Zap, color:'blue' },
  { label:'Qualified leads', value:'86', change:'+18.4%', icon:TrendingUp, color:'green' }, { label:'Pending follow-ups', value:'17', change:'-4.3%', icon:Activity, color:'amber' },
]

function Badge({ children, tone = 'gray' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
function toneFor(value: string) { return value === 'New' ? 'blue' : value === 'Qualified' || value === 'Won' ? 'green' : value === 'Urgent' ? 'red' : value === 'High' ? 'amber' : value === 'Proposal Sent' || value === 'Negotiation' ? 'violet' : 'gray' }

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [product, setProduct] = useState('All products')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [role, setRole] = useState('SUPERADMIN')
  const filtered = useMemo(() => leads.filter(l => (l.name + l.company + l.product + l.owner).toLowerCase().includes(query.toLowerCase()) && (product === 'All products' || l.product === product)), [query, product])

  return <div className="crm-shell">
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand"><div className="brand-mark">Z</div><div className="brand-copy"><strong>ZEE X AI</strong><span>Intelligence, amplified.</span></div></div>
      <button className="workspace-switch"><span className="workspace-dot" /> <span className="workspace-text">ZEE X AI Workspace</span><ChevronDown size={14}/></button>
      <div className="nav-section"><span className="nav-label">Workspace</span>{nav.slice(0, 6).map(item => <NavItem key={item.label} item={item} active={active} setActive={setActive} />)}</div>
      <div className="nav-section"><span className="nav-label">Operations</span>{nav.slice(6, 10).map(item => <NavItem key={item.label} item={item} active={active} setActive={setActive} />)}</div>
      <div className="nav-section"><span className="nav-label">Insights</span>{nav.slice(10).map(item => <NavItem key={item.label} item={item} active={active} setActive={setActive} />)}</div>
      <div className="sidebar-bottom"><div className="help-row"><CircleHelp size={17}/><span>Help center</span></div><div className="user-row"><div className="avatar avatar-purple">AS</div><div className="user-copy"><strong>Arun Saravanan</strong><span>{role}</span></div><MoreHorizontal size={16}/></div></div>
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="top-actions"><div className="global-search"><Search size={17}/><input placeholder="Search anything..." /><kbd>⌘ K</kbd></div><button className="icon-btn notification"><Bell size={18}/><i /></button><button className="profile-btn"><div className="avatar avatar-purple">AS</div><ChevronDown size={14}/></button></div></header>
      <div className="page-wrap">
        {active === 'Overview' ? <Overview setActive={setActive} /> : active === 'Leads & Requests' ? <LeadsPage filtered={filtered} query={query} setQuery={setQuery} product={product} setProduct={setProduct} setShowLeadForm={setShowLeadForm} /> : <ModulePage title={active} />}
      </div>
    </main>
    {showLeadForm && <LeadForm close={() => setShowLeadForm(false)} />}
  </div>
}

function NavItem({ item, active, setActive }: any) { const Icon = item.icon; return <button className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => setActive(item.label)}><Icon size={17}/><span>{item.label}</span>{item.count && <em>{item.count}</em>}</button> }

function Overview({ setActive }: any) { return <>
  <div className="page-heading"><div><p className="eyebrow">Monday, 17 June 2024</p><h1>Good morning, Arun <span>✦</span></h1><p className="subheading">Here&apos;s what&apos;s happening across your customer pipeline today.</p></div><div className="heading-actions"><button className="btn btn-secondary"><CalendarDays size={16}/> Last 30 days <ChevronDown size={14}/></button><button className="btn btn-primary" onClick={() => setActive('Leads & Requests')}><Plus size={17}/> Add new lead</button></div></div>
  <div className="stats-grid">{stats.map(s => { const Icon=s.icon; return <div className="stat-card" key={s.label}><div className={`stat-icon ${s.color}`}><Icon size={18}/></div><div className="stat-label">{s.label}<span className="info">i</span></div><div className="stat-value">{s.value}</div><div className="stat-change"><span>↗ {s.change}</span> <small>vs last period</small></div></div> })}</div>
  <div className="content-grid"><div className="card chart-card"><div className="card-head"><div><h2>Lead acquisition</h2><p>New leads received over time</p></div><button className="select-btn">Weekly <ChevronDown size={14}/></button></div><div className="chart-legend"><span><i className="legend-dot violet-dot"/>New leads</span><span><i className="legend-dot blue-dot"/>Qualified</span></div><div className="fake-chart"><div className="chart-y"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="chart-area"><svg viewBox="0 0 620 190" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6045f5" stopOpacity=".22"/><stop offset="1" stopColor="#6045f5" stopOpacity="0"/></linearGradient></defs><path d="M0 145 C45 142 55 110 95 120 S145 155 185 100 S240 88 275 105 S320 120 350 82 S405 40 440 70 S495 76 530 32 S580 68 620 20 V190 H0Z" fill="url(#area)"/><path d="M0 145 C45 142 55 110 95 120 S145 155 185 100 S240 88 275 105 S320 120 350 82 S405 40 440 70 S495 76 530 32 S580 68 620 20" fill="none" stroke="#6045f5" strokeWidth="3"/><path d="M0 165 C50 145 75 145 110 150 S165 142 200 145 S255 122 290 145 S345 125 375 140 S430 105 465 130 S520 120 550 125 S590 100 620 105" fill="none" stroke="#4263eb" strokeWidth="2" strokeDasharray="5 5"/></svg><div className="chart-x"><span>May 20</span><span>May 27</span><span>Jun 03</span><span>Jun 10</span><span>Jun 17</span></div></div></div></div>
  <div className="card funnel-card"><div className="card-head"><div><h2>Pipeline health</h2><p>Lead conversion funnel</p></div><MoreHorizontal size={18}/></div><div className="funnel"><div className="funnel-row"><span>New leads</span><b>248</b><div className="funnel-bar"><i style={{width:'100%'}} /></div></div><div className="funnel-row"><span>Contacted</span><b>172</b><div className="funnel-bar"><i style={{width:'70%'}} /></div></div><div className="funnel-row"><span>Qualified</span><b>86</b><div className="funnel-bar"><i style={{width:'48%'}} /></div></div><div className="funnel-row"><span>Proposal sent</span><b>38</b><div className="funnel-bar"><i style={{width:'30%'}} /></div></div><div className="funnel-row"><span>Won</span><b>21</b><div className="funnel-bar"><i style={{width:'18%'}} /></div></div></div><div className="conversion"><strong>8.5%</strong><span>overall conversion rate</span></div></div></div>
  <div className="bottom-grid"><div className="card"><div className="card-head"><div><h2>Today&apos;s schedule</h2><p>Meetings and follow-ups for today</p></div><button className="text-btn" onClick={() => setActive('Schedule')}>View calendar <ChevronRight size={14}/></button></div><div className="meeting-list"><Meeting time="09:30 AM" title="Z-Factory discovery call" company="Vertex Manufacturing" type="Discovery call" color="purple"/><Meeting time="11:00 AM" title="Product demonstration" company="Northstar Logistics" type="Demo · Z-Tracs" color="blue"/><Meeting time="02:30 PM" title="Proposal review" company="Apex Industrial" type="Follow-up" color="green"/></div></div><div className="card"><div className="card-head"><div><h2>Recent activity</h2><p>Latest updates from your team</p></div><button className="text-btn">View all <ChevronRight size={14}/></button></div><div className="activity-list"><ActivityRow icon="lead" text="New lead added by" bold="Priya Nair" time="8 min ago"/><ActivityRow icon="mail" text="Email sent to" bold="Aarav Mehta" time="24 min ago"/><ActivityRow icon="check" text="Lead qualified by" bold="Rohan Kapoor" time="1 hr ago"/></div></div></div>
</> }
function Meeting({time,title,company,type,color}: any){return <div className="meeting-row"><div className="meeting-time">{time}</div><div className={`meeting-line ${color}`} /><div className="meeting-info"><strong>{title}</strong><span>{company} · {type}</span></div><button className="more-btn"><MoreHorizontal size={16}/></button></div>}
function ActivityRow({icon,text,bold,time}: any){return <div className="activity-row"><div className={`activity-icon ${icon}`}><UserRound size={14}/></div><div><span>{text} <b>{bold}</b></span><small>{time}</small></div></div>}

function LeadsPage({ filtered, query, setQuery, product, setProduct, setShowLeadForm }: any) { return <><div className="page-heading compact"><div><p className="eyebrow">Workspace / Leads</p><h1>Leads &amp; Requests</h1><p className="subheading">Manage your pipeline, follow-ups, and customer relationships.</p></div><button className="btn btn-primary" onClick={() => setShowLeadForm(true)}><Plus size={17}/> Add new lead</button></div><div className="lead-kpis"><div><span>All leads</span><strong>248</strong></div><div><span>New</span><strong className="blue-text">42</strong></div><div><span>Qualified</span><strong className="green-text">86</strong></div><div><span>Needs follow-up</span><strong className="amber-text">17</strong></div></div><div className="card lead-card"><div className="table-toolbar"><div className="table-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, company, or owner..."/></div><select value={product} onChange={e => setProduct(e.target.value)}>{products.map(p => <option key={p}>{p}</option>)}</select><button className="filter-btn"><Filter size={15}/> Filters <span>2</span></button><button className="icon-btn"><MoreHorizontal size={18}/></button></div><div className="table-wrap"><table><thead><tr><th><input type="checkbox"/></th><th>Lead</th><th>Company</th><th>Product</th><th>Owner</th><th>Status</th><th>Priority</th><th>Created</th><th></th></tr></thead><tbody>{filtered.map((l: Lead) => <tr key={l.id}><td><input type="checkbox"/></td><td><div className="lead-name"><div className="avatar avatar-soft">{l.initials}</div><div><strong>{l.name}</strong><small>{l.id}</small></div></div></td><td>{l.company}</td><td><span className="product-cell"><i />{l.product}</span></td><td>{l.owner}</td><td><Badge tone={toneFor(l.status)}>{l.status}</Badge></td><td><Badge tone={toneFor(l.priority)}>{l.priority}</Badge></td><td>{l.date}</td><td><button className="more-btn"><MoreHorizontal size={16}/></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of 248 leads</span><div><button className="pagination"><ChevronLeft size={14}/></button><button className="pagination current">1</button><button className="pagination">2</button><button className="pagination">3</button><span>...</span><button className="pagination">25</button><button className="pagination"><ChevronRight size={14}/></button></div></div></div></> }
function ModulePage({title}: {title: string}) { return <div className="module-empty"><div className="module-icon"><SlidersHorizontal size={26}/></div><p className="eyebrow">CRM module</p><h1>{title}</h1><p>This workspace is ready for your team. Use the navigation to manage records, workflows, and reporting in one place.</p><button className="btn btn-primary"><Plus size={17}/> Create new</button></div> }
function LeadForm({close}: {close: () => void}) { return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><p className="eyebrow">New record</p><h2>Add a new lead</h2></div><button className="icon-btn" onClick={close}><X size={18}/></button></div><div className="form-grid"><label>First name<input placeholder="e.g. Aarav"/></label><label>Last name<input placeholder="e.g. Mehta"/></label><label className="wide">Company name<input placeholder="Company or organization"/></label><label>Email address<input type="email" placeholder="name@company.com"/></label><label>Phone number<input placeholder="+91 00000 00000"/></label><label>Interested product<select><option>Z-Factory</option>{products.slice(2).map(p=><option key={p}>{p}</option>)}</select></label><label>Priority<select><option>Medium</option><option>High</option><option>Urgent</option></select></label><label className="wide">Requirements<textarea placeholder="Tell us more about this opportunity..." rows={3}/></label></div><div className="modal-actions"><button className="btn btn-secondary" onClick={close}>Cancel</button><button className="btn btn-primary" onClick={close}><Plus size={16}/> Create lead</button></div></div></div> }
