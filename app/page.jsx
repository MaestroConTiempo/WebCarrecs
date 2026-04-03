'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, BookOpen, Globe, ArrowUpRight, ChevronDown } from 'lucide-react';

// Each item observes itself individually — animates only when IT enters the viewport
function FadeItem({ children, delay = 0, dir = 'up', className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const style = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none'
      : dir === 'left'  ? 'translateX(-35px)'
      : dir === 'right' ? 'translateX(35px)'
      : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, inView, duration = 2500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-6 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-lg font-black text-slate-900">{question}</span>
        <ChevronDown
          size={22}
          className={`text-blue-900 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-6 text-slate-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function CarrecsIALanding() {
  const [scrollY, setScrollY] = useState(0);
  const [activePhase, setActivePhase] = useState(0);

  const [formData, setFormData] = useState({ nom: '', centre: '', carrec: '', missatge: '' });
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [metricsRef, metricsInView] = useInView(0.3);
  const count20 = useCounter(20, metricsInView, 2500);
  const count5  = useCounter(5,  metricsInView, 1800);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '91374749-c0ee-477c-9614-7b01b490676c',
          subject: `Sol·licitud seminari càrrecs - ${formData.centre}`,
          from_name: formData.nom,
          nom: formData.nom,
          centre: formData.centre,
          carrec: formData.carrec,
          missatge: formData.missatge,
        }),
      });
      const data = await res.json();
      if (data.success) setFormStatus('success');
      else setFormStatus('error');
    } catch {
      setFormStatus('error');
    }
  };

  const phases = [
    {
      num: '01',
      title: 'Diagnosi i disseny',
      desc: 'Identifiquem conjuntament els processos que més temps consumeixen al vostre equip directiu: actes, comunicacions, certificats, programacions. Dissenyem el pla d\'automatització adaptat al vostre centre.',
      icon: <BookOpen size={22} />,
    },
    {
      num: '02',
      title: 'Actes i reunions',
      desc: 'Construïm el sistema d\'automatització d\'actes per al consell escolar, el claustre i l\'equip directiu. A partir de notes breus, l\'eina genera l\'acta completa en el format del centre.',
      icon: <Users size={22} />,
    },
    {
      num: '03',
      title: 'Documents de gestió',
      desc: 'Automatitzem la redacció de certificats, comunicacions per a famílies, convocatòries i informes de seguiment. Documents que passaven d\'una hora a menys de cinc minuts.',
      icon: <Globe size={22} />,
    },
    {
      num: '04',
      title: 'Coordinació pedagògica',
      desc: 'Creem eines per detectar incoherències entre programacions i currículum, generar rúbriques coherents i agilitzar el seguiment de les coordinacions de cicle.',
      icon: <BookOpen size={22} />,
    },
    {
      num: '05',
      title: 'Consolidació i protocols',
      desc: 'Integrem tots els sistemes en el flux de treball diari. Elaborem els protocols d\'ús intern perquè tot l\'equip directiu pugui usar les eines de manera autònoma i consistent.',
      icon: <ArrowUpRight size={22} />,
    },
  ];

  const outputs = [
    { icon: '📝', title: 'Sistema d\'actes automatitzat', desc: 'Genera actes completes del consell escolar, claustre i equip directiu a partir de notes breus.' },
    { icon: '✉️', title: 'Plantilles intel·ligents', desc: 'Comunicacions per a famílies, certificats i convocatòries en el format oficial del centre en minuts.' },
    { icon: '📊', title: 'Eines de coordinació pedagògica', desc: 'Detecció d\'incoherències entre programacions, seguiment de cicles i generació de rúbriques.' },
    { icon: '🗂️', title: 'Biblioteca de prompts del centre', desc: 'Biblioteca personalitzada amb els prompts que funcionen per als vostres processos específics.' },
    { icon: '📋', title: 'Protocols d\'ús intern', desc: 'Guies pràctiques perquè tot l\'equip directiu pugui usar els sistemes de manera autònoma.' },
    { icon: '🔄', title: 'Memòries i informes anuals', desc: 'Eines per agilitzar la redacció de memòries de final de curs i informes de seguiment de projectes.' },
  ];

  const examples = [
    {
      before: 'Redactar l\'acta del consell escolar ocupava entre 2 i 3 hores, entre prendre notes i estructurar-ho tot.',
      after: 'L\'assistent genera l\'acta completa a partir de notes breus i la formata automàticament en el format oficial del centre.',
    },
    {
      before: 'Cada comunicació per a famílies requeria revisar el to, adaptar el format i evitar errors de coherència.',
      after: 'El sistema genera comunicacions professionals en menys de tres minuts a partir d\'una idea o un esquema.',
    },
    {
      before: 'Detectar si una programació de cicle era coherent amb el currículum exigia una revisió manual document per document.',
      after: 'L\'eina analitza les programacions i assenyala incoherències respecte al currículum oficial en qüestió de segons.',
    },
    {
      before: 'Els certificats d\'assistència o d\'exercici del càrrec es redactaven un a un, buscant el model cada vegada.',
      after: 'L\'assistent redacta els certificats en el format oficial del centre en pocs clics, amb les dades introduïdes una sola vegada.',
    },
  ];

  const testimonials = [
    {
      quote: 'Fa tres sessions que no he hagut de quedar-me fins les vuit per redactar l\'acta del claustre. Semblava impossible.',
      name: 'Montserrat Valls',
      role: 'Directora',
      school: 'Escola Puig d\'en Cals',
    },
    {
      quote: 'El que més m\'ha sorprès és que no hem après IA en abstracte. Hem muntat eines que ens funcionen des del primer dia.',
      name: 'Ricard Puig',
      role: 'Cap d\'estudis',
      school: 'Institut Miralles',
    },
    {
      quote: 'Les comunicacions per a famílies ara les fem en minuts. I queden millor que abans. L\'equip no es pot creure el canvi.',
      name: 'Anna Ferrer',
      role: 'Coordinadora pedagògica',
      school: 'Escola La Roureda',
    },
  ];

  const faqs = [
    {
      q: 'Necessitem coneixements previs d\'IA?',
      a: 'No. El seminari està dissenyat per a equips directius que no han treballat mai amb IA. Partim dels vostres processos reals i construïm pas a pas. Al final de cada sessió teniu eines que podeu usar de manera autònoma.',
    },
    {
      q: 'Com és el format del seminari?',
      a: 'Cinc sessions presencials al vostre centre, de dues hores cadascuna. Entre sessions, teniu suport per correu per resoldre dubtes i ajustar les eines. El ritme l\'adaptem a la vostra disponibilitat.',
    },
    {
      q: 'Per a quins càrrecs és útil?',
      a: 'Directors, caps d\'estudis, secretaris, coordinadors pedagògics i coordinadors de cicle. Treballem els processos que comparteix tot l\'equip directiu, però adaptem les eines a les funcions de cada rol.',
    },
    {
      q: 'Quins documents i processos podem automatitzar?',
      a: 'Actes de reunions (consell escolar, claustre, equip directiu), comunicacions per a famílies, certificats, convocatòries, programacions, informes de seguiment i memòries anuals. Partim de la vostra realitat per decidir on l\'impacte és més gran.',
    },
    {
      q: 'Funciona amb les eines que ja fem servir?',
      a: 'Sí. Treballem amb les eines que ja teniu al centre: Google Workspace, Microsoft 365, o el que useu habitualment. No cal instal·lar res especial ni canviar de plataforma.',
    },
  ];

  return (
    <div className="font-sans text-slate-900 bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <FadeItem delay={0}>
            <p className="text-blue-300 text-sm font-bold tracking-widest uppercase mb-6">
              Seminaris d'IA per a equips directius
            </p>
          </FadeItem>

          <FadeItem delay={100}>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tight">
              Menys paperassa.<br />
              <span className="text-blue-400">Més lideratge.</span>
            </h1>
          </FadeItem>

          <FadeItem delay={200}>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Construïm sistemes d'IA per als vostres processos reals.<br className="hidden md:block" />
              Sortiu de cada sessió amb eines que podeu usar l'endemà.
            </p>
          </FadeItem>

          <FadeItem delay={300}>
            <a
              href="#contacte"
              className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-900/40"
            >
              Sol·licita una sessió informativa
              <ArrowRight size={20} />
            </a>
          </FadeItem>

          <FadeItem delay={400}>
            <p className="mt-8 text-slate-400 text-sm">
              Per a directors, caps d'estudis, coordinadors pedagògics i secretaris
            </p>
          </FadeItem>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown size={28} className="text-white" />
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <FadeItem>
            <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">El problema real</p>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              El problema no és de formació.<br />
              <span className="text-blue-700">És de processos.</span>
            </h2>
          </FadeItem>
          <FadeItem delay={100}>
            <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              Els processos de gestió del centre funcionen igual que fa quinze anys.
              Actes que triguen hores. Comunicacions que es reescriuen des de zero.
              Documents que es dupliquen. I vosaltres, enmig de tot, sense temps per al que realment importa.
            </p>
          </FadeItem>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { icon: '📋', text: 'Actes de reunions que triguen entre una i tres hores a redactar i revisar.' },
              { icon: '✉️', text: 'Comunicacions per a famílies que es reescriuen des de zero cada vegada.' },
              { icon: '📄', text: 'Certificats i convocatòries que busqueu en carpetes antigues per copiar el format.' },
              { icon: '📚', text: 'Programacions i memòries que s\'acumulen sense que ningú tingui temps de revisar-les bé.' },
            ].map((item, i) => (
              <FadeItem key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 flex gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-slate-700 leading-relaxed">{item.text}</p>
                </div>
              </FadeItem>
            ))}
          </div>

          <FadeItem delay={200}>
            <p className="mt-12 text-2xl font-black text-slate-800">
              "No parlem d'IA. Muntem sistemes de treball que funcionen."
            </p>
          </FadeItem>
        </div>
      </section>

      {/* ── COST REAL (dark metrics) ── */}
      <section ref={metricsRef} className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <FadeItem>
            <h2 className="text-3xl md:text-4xl font-black mb-4">El cost real que no surt als informes</h2>
            <p className="text-slate-400 text-lg mb-16">Hores de lideratge convertides en burocracia</p>
          </FadeItem>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeItem delay={0}>
              <div>
                <p className="text-blue-400 font-black whitespace-nowrap" style={{ fontSize: '3rem' }}>
                  {count20}h → &lt;4h
                </p>
                <p className="text-slate-300 text-lg mt-2 font-semibold">Reduïm</p>
                <p className="text-slate-400 text-sm mt-1">setmanals en tasques mecàniques de gestió</p>
              </div>
            </FadeItem>
            <FadeItem delay={100}>
              <div>
                <p className="font-black text-blue-400" style={{ fontSize: '3rem' }}>≡</p>
                <p className="text-slate-300 text-lg mt-2 font-semibold">Unifiquem</p>
                <p className="text-slate-400 text-sm mt-1">tots els documents en un únic sistema coherent</p>
              </div>
            </FadeItem>
            <FadeItem delay={200}>
              <div>
                <p className="font-black text-blue-400" style={{ fontSize: '3rem' }}>{count5}</p>
                <p className="text-slate-300 text-lg mt-2 font-semibold">Automatitzem</p>
                <p className="text-slate-400 text-sm mt-1">tipus de documents que es generen repetitivament cada curs</p>
              </div>
            </FadeItem>
          </div>
        </div>
      </section>

      {/* ── PROGRAMA (5 sessions) ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">El seminari</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Cinc sessions. Eines reals.</h2>
              <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                Cada sessió té un objectiu concret. Sortiu amb un sistema funcionant, no amb apunts.
              </p>
            </div>
          </FadeItem>

          <div className="flex flex-col md:flex-row gap-3 mb-8 justify-center flex-wrap">
            {phases.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  activePhase === i
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sessió {p.num}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-10 border border-blue-100 min-h-48 transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="bg-blue-700 text-white rounded-2xl p-4 flex-shrink-0">
                {phases[activePhase].icon}
              </div>
              <div>
                <p className="text-blue-600 font-bold text-sm mb-2">Sessió {phases[activePhase].num}</p>
                <h3 className="text-2xl font-black mb-4">{phases[activePhase].title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{phases[activePhase].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUÈ TINDRAN ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Resultats concrets</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Què tindrà el vostre equip</h2>
              <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                No uns apunts sobre IA. Eines que funcionen des del primer dia.
              </p>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outputs.map((item, i) => (
              <FadeItem key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-blue-100 h-full">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-black text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXEMPLES REALS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Casos pràctics</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Exemples reals del seminari</h2>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-2 gap-6">
            {examples.map((ex, i) => (
              <FadeItem key={i} delay={i * 80} dir={i % 2 === 0 ? 'left' : 'right'}>
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-full">
                  <div className="bg-red-50 p-6 border-b border-red-100">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Abans</p>
                    <p className="text-slate-700 leading-relaxed text-sm">{ex.before}</p>
                  </div>
                  <div className="bg-green-50 p-6">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Amb el sistema</p>
                    <p className="text-slate-700 leading-relaxed text-sm">{ex.after}</p>
                  </div>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIS ── */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Qui ho ha provat, ho repeteix</h2>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <FadeItem key={i} delay={i * 100}>
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full flex flex-col">
                  <p className="text-slate-200 leading-relaxed text-base flex-1 italic mb-8">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-black text-white">{t.name}</p>
                    <p className="text-blue-400 text-sm font-semibold">{t.role}</p>
                    <p className="text-slate-500 text-sm">{t.school}</p>
                  </div>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Preguntes freqüents</p>
              <h2 className="text-4xl md:text-5xl font-black">Les preguntes que tothom fa</h2>
            </div>
          </FadeItem>

          <FadeItem delay={100}>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              {faqs.map((f, i) => (
                <FaqItem key={i} question={f.q} answer={f.a} />
              ))}
            </div>
          </FadeItem>
        </div>
      </section>

      {/* ── CTA + FORMULARI ── */}
      <section id="contacte" className="py-24 px-6 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <FadeItem>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Parleu amb nosaltres.<br />
              <span className="text-blue-300">Sense compromís.</span>
            </h2>
            <p className="text-blue-200 text-lg mb-12 leading-relaxed">
              Expliqueu-nos en quin centre treballeu i quins processos us fan perdre més temps.
              Respostem en menys de 24 hores amb una proposta concreta.
            </p>
          </FadeItem>

          <FadeItem delay={100}>
            {formStatus === 'success' ? (
              <div className="bg-green-800/40 border border-green-500/40 rounded-2xl p-10 text-center">
                <p className="text-4xl mb-4">✅</p>
                <p className="text-xl font-black text-green-300 mb-2">Rebut!</p>
                <p className="text-green-200">Us contactem en menys de 24 hores.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="El vostre nom"
                    required
                    value={formData.nom}
                    onChange={e => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition"
                  />
                  <input
                    type="text"
                    placeholder="Nom del centre"
                    required
                    value={formData.centre}
                    onChange={e => setFormData({ ...formData, centre: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Càrrec (directora, cap d'estudis, coordinadora...)"
                  required
                  value={formData.carrec}
                  onChange={e => setFormData({ ...formData, carrec: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition"
                />
                <textarea
                  placeholder="Quin procés us fa perdre més temps? (opcional)"
                  rows={4}
                  value={formData.missatge}
                  onChange={e => setFormData({ ...formData, missatge: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition resize-none"
                />
                {formStatus === 'error' && (
                  <p className="text-red-300 text-sm text-center">Hi ha hagut un error. Torneu-ho a provar o escriviu-nos directament.</p>
                )}
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-bold text-lg px-8 py-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  {formStatus === 'sending' ? 'Enviant...' : 'Sol·licita informació'}
                  {formStatus !== 'sending' && <ArrowRight size={20} />}
                </button>
              </form>
            )}
          </FadeItem>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 bg-slate-950 text-slate-400 text-center text-sm">
        <p className="font-bold text-white mb-1">Mestre amb Temps</p>
        <p>© 2026 Mestre amb Temps · Seminaris d'IA per a equips directius</p>
        <p className="mt-2">
          <a href="mailto:mestreambtemps@gmail.com" className="hover:text-blue-400 transition">
            mestreambtemps@gmail.com
          </a>
        </p>
      </footer>

    </div>
  );
}
