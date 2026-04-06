'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

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

function useCounter(target, inView, duration = 2500, startDelay = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let timer;
    const timeout = setTimeout(() => {
      let current = 0;
      const increment = target / (duration / 16);
      timer = setInterval(() => {
        current += increment;
        if (current >= target) { setCount(target); clearInterval(timer); }
        else { setCount(Math.floor(current)); }
      }, 16);
    }, startDelay);
    return () => { clearTimeout(timeout); clearInterval(timer); };
  }, [inView, target, duration, startDelay]);
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
  const [formData, setFormData] = useState({ nom: '', seminari: '', carrec: '', missatge: '' });
  const [formStatus, setFormStatus] = useState('idle');

  const [metricsRef, metricsInView] = useInView(0.3);
  const count30 = useCounter(30, metricsInView, 4000, 1000);
  const count5  = useCounter(5,  metricsInView, 3000, 1000);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '91374749-c0ee-477c-9614-7b01b490676c',
          subject: `Sol·licitud seminari càrrecs - ${formData.seminari}`,
          from_name: formData.nom,
          nom: formData.nom,
          seminari: formData.seminari,
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

  const faqs = [
    {
      q: 'Necessitem coneixements previs d\'IA?',
      a: 'No. El programa parteix de zero i es construeix sobre les vostres tasques reals. No cal saber res d\'IA amb antel·lació. Cada sessió és demostració + pràctica guiada + construcció d\'eines pròpies.',
    },
    {
      q: 'Per a quins càrrecs és útil?',
      a: 'Per a qualsevol càrrec de gestió educativa: secretaris, caps d\'estudis, coordinadors pedagògics, directors, equips de CRPS... Qualsevol que gestioni documentació repetitiva — actes, informes, comunicacions, programacions.',
    },
    {
      q: 'On es fan les sessions?',
      a: 'Presencial i totalment personalitzat al perfil del seminari i/o càrrec. Ens desplacem al vostre centre o espai de formació. El programa s\'adapta a les necessitats concretes del vostre grup.',
    },
    {
      q: 'Quin és el preu del programa?',
      a: 'La proposta de preu és personalitzada segons el número de sessions i la mida del grup. Fem una trucada de 20 minuts per identificar les necessitats del seminari i us enviem una proposta concreta.',
    },
    {
      q: 'Amb quines eines treballem?',
      a: 'Treballem amb eines d\'IA fàcils d\'utilitzar i implementar. No cal instal·lar cap programari especial. Aprendreu a fer-les servir correctament per crear sistemes que treballin per vosaltres, des del primer dia.',
    },
  ];

  return (
    <div className="font-sans text-slate-900 bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
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

        <div className="relative z-10 w-full px-8 py-24 text-center">
          <FadeItem delay={0}>
            <p className="text-blue-300 text-base lg:text-xl font-bold tracking-widest uppercase mb-6">
              Programa d'automatització per a seminaris de càrrecs de gestió educativa
            </p>
          </FadeItem>

          <FadeItem delay={100}>
            <h1 className="text-5xl md:text-[6.5vw] font-black leading-tight mb-8 tracking-tight">
              Menys paperassa.<br />
              <span className="text-blue-400 italic">Més lideratge.</span>
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
              Portem el programa al vostre grup de treball.
              <ArrowRight size={20} />
            </a>
          </FadeItem>

          <FadeItem delay={400}>
            <p className="mt-8 text-slate-400 text-sm">
              Per a secretaris, caps d'estudis, coordinadors pedagògics, directors i equips de CRPS
            </p>
          </FadeItem>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ChevronDown size={28} className="text-white" />
        </div>
      </section>

      {/* ── LA REALITAT ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">La realitat</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                Els processos de gestió del centre<br />funcionen igual que fa 15 anys.
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                El problema no és de formació en IA. És que la feina mecànica s'ha acumulat durant anys i ningú ha tingut temps de resoldre-la.
              </p>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                title: 'Actes, actes i més actes',
                desc: 'Consell escolar, claustre, equip directiu, comissions... Cada reunió genera un document que algú ha de redactar, formatar i arxivar.',
              },
              {
                icon: '📚',
                title: 'Dissenyar, unificar, acordar',
                desc: 'Programacions didàctiques que s\'han de revisar. Informes i programacions que cada profe interpreta de maneres diferents.',
              },
              {
                icon: '📄',
                title: 'Certificats, comunicacions i memòries',
                desc: 'Certificats un per un, memòria anual, pla anual... Feina mecànica que es repeteix cada curs.',
              },
            ].map((item, i) => (
              <FadeItem key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-black text-lg mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-base">{item.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>

          <FadeItem delay={200}>
            <div className="mt-10 bg-white border-l-4 border-blue-500 rounded-r-2xl px-8 py-6 max-w-3xl mx-auto">
              <p className="text-slate-700 text-lg italic leading-relaxed">
                "Si dediqueu més temps a paperassa que a les decisions que realment importen, aquest programa és per a vosaltres."
              </p>
            </div>
          </FadeItem>
        </div>
      </section>

      {/* ── AIXÒ NO ÉS UN ALTRE CURS ── */}
      <section ref={metricsRef} className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">Això no és un altre curs de IA</h2>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FadeItem delay={0}>
              <div className="space-y-4">
                {[
                  'No és una xerrada sobre ChatGPT i eines d\'IA que s\'obliden en dues setmanes',
                  'No són llistes de prompts genèrics que no resolen els vostres processos reals',
                  'No farem demostracions impressionants que després costa replicar',
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-red-400 font-black text-xl flex-shrink-0 mt-0.5">✕</span>
                    <p className="text-slate-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </FadeItem>
            <FadeItem delay={100}>
              <div className="space-y-4">
                {[
                  'Aquí aprendreu a construir fluxos de treball per a les vostres tasques reals',
                  'Crear assistents d\'IA configurats per al tipus de documentació que gestioneu',
                  'Sortir de cada sessió amb eines muntades que podeu usar l\'endemà',
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-blue-400 font-black text-xl flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-slate-200 leading-relaxed font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </FadeItem>
          </div>

          <FadeItem delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-slate-700 pt-16">
              <div>
                <p className="text-blue-400 font-black whitespace-nowrap" style={{ fontSize: '3rem' }}>
                  {count30}min → 5min
                </p>
                <p className="text-slate-300 text-lg mt-2 font-semibold">Reduïm</p>
                <p className="text-slate-400 text-sm mt-1">el temps per redactar una acta de reunió</p>
              </div>
              <div>
                <p className="font-black text-blue-400" style={{ fontSize: '3rem' }}>≡</p>
                <p className="text-slate-300 text-lg mt-2 font-semibold">Unifiquem</p>
                <p className="text-slate-400 text-sm mt-1">formats i criteris per a tot l'equip, independentment de qui elabora el document</p>
              </div>
              <div>
                <p className="font-black text-blue-400" style={{ fontSize: '3rem' }}>{count5}</p>
                <p className="text-slate-300 text-lg mt-2 font-semibold">Sessions</p>
                <p className="text-slate-400 text-sm mt-1">pràctiques per construir un sistema complet que funciona</p>
              </div>
            </div>
          </FadeItem>

          <FadeItem delay={200}>
            <p className="text-center text-blue-300 text-xl font-black mt-16 italic">
              "No parlem d'IA. Muntem sistemes de treball que funcionen."
            </p>
          </FadeItem>
        </div>
      </section>

      {/* ── SOBRE QUÈ TREBALLAREM ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">El programa</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Sobre què treballarem</h2>
              <p className="text-slate-500 text-lg italic">"Cada sessió treballa sobre tasques reals. Res de teoria, res de demostracions que no pugueu replicar."</p>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Documentació automàtica',
                desc: 'Actes de reunions en minuts. Informes de seguiment i memòries generades a partir de notes breus.',
              },
              {
                num: '2',
                title: 'Coherència de l\'equip',
                desc: 'Formats i estàndards comuns per a tot l\'equip. Assistents configurats amb els criteris propis del vostre càrrec. Documentació coherent independentment de qui l\'elabora.',
              },
              {
                num: '3',
                title: 'Continuïtat i onboarding',
                desc: 'Assistents d\'IA configurats amb els criteris i formats del vostre centre. Fluxos de treball que queden documentats i reutilitzables. Un sistema que el vostre equip pot usar des del primer dia sense dependre de ningú extern.',
              },
            ].map((item, i) => (
              <FadeItem key={i} delay={i * 80}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-700 text-white font-black text-xl flex items-center justify-center mb-5">
                    {item.num}
                  </div>
                  <h3 className="font-black text-xl mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── EL QUE CANVIA ── */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">El que canvia quan apliqueu el que aprendreu aquí</h2>
              <p className="text-slate-400 text-lg italic">"Un director estalvia ~100 hores/any. Multiplica'l per cada càrrec de gestió: són 400 hores anuals que podrien anar a lideratge real."</p>
            </div>
          </FadeItem>

          {(() => {
            const items = [
              {
                title: 'Actes i documentació',
                before: '20–30 min per acta, redacció manual post-reunió, format diferent segons qui escriu.',
                after: 'Acta generada en 5 minuts amb el format oficial del vostre centre.',
              },
              {
                title: 'Informes i memòries',
                before: 'Redacció des de zero cada vegada, hores per document, sense plantilla comuna.',
                after: 'Assistent que genera l\'esborrany en minuts. D\'1 hora a 5 minuts per informe. La mestra revisa i ajusta.',
              },
              {
                title: 'Programacions automàtiques',
                before: 'Crear programacions des de zero seguint el model del centre: més d\'1 hora per programació.',
                after: 'Assistent configurat amb el model propi del centre que genera programacions de forma automàtica. D\'1 hora de feina a 3 minuts, programació creada.',
              },
              {
                title: 'Criteris unificats per a activitats',
                before: 'Cada docent treballa la resolució de problemes o el vocabulari de manera diferent. Criteris dispersos, resultats inconsistents.',
                after: 'Un assistent que guia cada docent amb el criteri comú del centre. Imagineu que tota l\'escola treballa igual la resolució de problemes o unifica el treball de vocabulari a través d\'un assistent.',
              },
            ];
            return (
              <div className="space-y-5">
                {items.map((item, i) => (
                  <FadeItem key={i} delay={i * 80}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 border-l-4 border-red-500 rounded-xl p-6">
                        <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">Abans</p>
                        <p className="font-black text-white text-lg mb-3">{item.title}</p>
                        <p className="text-slate-300 text-base leading-relaxed">{item.before}</p>
                      </div>
                      <div className="bg-slate-800 border-l-4 border-emerald-500 rounded-xl p-6 flex flex-col">
                        <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Després</p>
                        <p className="text-slate-200 text-base leading-relaxed flex-1">{item.after}</p>
                        <p className="text-emerald-400 font-bold text-base mt-4">↗ Impacte real</p>
                      </div>
                    </div>
                  </FadeItem>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── AMB QUÈ SORTIREU ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Resultats</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Amb què sortireu d'aquest programa</h2>
              <p className="text-slate-600 text-lg">No sortiu amb apunts. Sortiu amb sistemes muntats i la capacitat d'implantar-los.</p>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeItem delay={0} dir="left">
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 h-full">
                <h3 className="font-black text-xl text-blue-800 mb-6">Automatitzar la vostra documentació</h3>
                <ul className="space-y-4">
                  {[
                    'Sabreu crear fluxos per generar informes, actes, comunicacions i documentació amb IA',
                    'Sabreu adaptar-los al format i criteris del vostre lloc de treball',
                    'Aprendreu a crear assistents i plantilles per automatitzar la vostra feina repetitiva',
                    'Tot el que apreneu ho podreu implantar i ensenyar al vostre equip',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-blue-600 font-black mt-0.5 flex-shrink-0">→</span>
                      <span className="text-slate-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeItem>

            <FadeItem delay={100} dir="right">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 h-full">
                <h3 className="font-black text-xl text-slate-800 mb-6">Construir coherència i continuïtat</h3>
                <ul className="space-y-4">
                  {[
                    'Guies per transferir els fluxos de treball a altres situacions',
                    'Assistents configurats amb els criteris i formats propis del vostre càrrec o centre',
                    'No sortiu amb apunts. Sortiu amb sistemes muntats i la capacitat d\'implantar-los',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-slate-500 font-black mt-0.5 flex-shrink-0">→</span>
                      <span className="text-slate-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeItem>
          </div>
        </div>
      </section>

      {/* ── COM FUNCIONA ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Les sessions</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Com funciona el programa</h2>
              <p className="text-slate-500 text-lg italic">"Cada sessió és un pas cap a un sistema complet"</p>
            </div>
          </FadeItem>

          <div className="space-y-4">
            {[
              {
                sessions: 'Sessions 1–2',
                subtitle: 'Criteris + primers fluxos',
                desc: 'Criteri comú d\'ús de la IA al centre. Primers fluxos de documentació automatitzada: informes, actes, comunicacions.',
                note: 'Analitzem quines tasques us fan perdre més temps i treballem sobre elles.',
              },
              {
                sessions: 'Sessions 3–4',
                subtitle: 'Assistents + coherència',
                desc: 'Assistents personalitzats per a programacions, actes, documentació. Fluxos de coherència i línia d\'escola.',
                note: 'Cada assistent surt amb eines configurades per al seu servei i la seva metodologia.',
              },
              {
                sessions: 'Sessió 5',
                subtitle: 'Consolidació del sistema',
                desc: 'Documentació pas a pas + plantilles reutilitzables + 3 mesos de suport per email.',
                note: 'Guia per portar el que heu après al vostre equip i mantenir el sistema viu.',
              },
              {
                sessions: 'Format',
                subtitle: 'Presencial i personalitzat',
                desc: 'Totalment adaptat al perfil del seminari i/o càrrec.',
                note: 'Demostració + pràctica guiada + construcció d\'eines pròpies a cada sessió.',
              },
            ].map((item, i) => (
              <FadeItem key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm grid md:grid-cols-3 gap-4 items-start">
                  <div>
                    <p className="font-black text-blue-700 text-lg">{item.sessions}</p>
                    <p className="font-bold text-slate-800">{item.subtitle}</p>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.desc}</p>
                  <p className="text-blue-600 text-sm font-semibold leading-relaxed">{item.note}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Testimonis</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">El que diuen els centres</h2>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Hem passat d\'invertir 18h per docent en informes a menys de 2h. I tot el claustre treballa amb el mateix criteri. Ja no hem de perseguir ningú.',
              },
              {
                quote: 'Hem automatitzat la feina repetitiva i hem recuperat hores per a allò que importa. Els docents nous s\'incorporen en dies, no en setmanes. El sistema queda, no depèn de cap persona.',
              },
              {
                quote: 'Unificar la manera de treballar les situacions d\'aprenentatge de ciències era un repte constant: cada mestra tenia el seu enfocament. Ara tenim un assistent que guia cada docent en el disseny d\'aquestes programacions amb un criteri comú de centre.',
              },
            ].map((item, i) => (
              <FadeItem key={i} delay={i * 80}>
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 h-full flex flex-col">
                  <p className="text-blue-300 text-4xl font-black leading-none mb-4">"</p>
                  <p className="text-slate-700 leading-relaxed italic flex-1">{item.quote}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── EL COST DE NO ACTUAR ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">El cost de no actuar</p>
              <h2 className="text-4xl md:text-5xl font-black">Quin és el risc de continuar com esteu?</h2>
            </div>
          </FadeItem>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Un any més de paperassa',
                desc: 'El risc no és invertir en aquest programa. El risc és continuar un any més amb la mateixa càrrega de paperassa.',
              },
              {
                num: '02',
                title: 'Sense criteris comuns',
                desc: 'Càrrecs cremats fent feina mecànica i sense un sistema que realment funcioni en pilot automàtic.',
              },
              {
                num: '03',
                title: '20 hores/mes perdudes',
                desc: '20 hores/mes en paperassa repetitiva que es podrien dedicar a lideratge educatiu real, suport a docents, millora estratègica.',
              },
            ].map((item, i) => (
              <FadeItem key={i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-sm h-full">
                  <p className="text-blue-500 font-black text-2xl mb-3">{item.num}</p>
                  <h3 className="font-black text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>

          <FadeItem delay={200}>
            <p className="text-center mt-10 text-slate-600 font-semibold text-lg">
              Proposta de preu per seminari: personalitzada segons número de sessions i mida del grup.
            </p>
          </FadeItem>
        </div>
      </section>

      {/* ── QUI HI HA DARRERE ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <FadeItem>
            <div className="text-center mb-12">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Qui hi ha darrere</p>
              <div className="flex justify-center mb-6">
                <img
                  src="/ruben.png"
                  alt="Rubén Fabri"
                  className="w-72 h-72 rounded-full object-cover object-top shadow-lg border-4 border-blue-100"
                />
              </div>
              <h2 className="text-4xl md:text-5xl font-black">Rubén Fabri</h2>
            </div>
          </FadeItem>

          <div className="space-y-6">
            <FadeItem delay={0}>
              <div className="bg-slate-50 border-l-4 border-blue-500 rounded-r-2xl p-8">
                <p className="text-slate-700 text-lg leading-relaxed italic">
                  +15 anys de mestre a primària. Conec la realitat de l'aula, el claustre i les reunions de cicle. Parlo des de dins del sector, no des de fora.
                </p>
              </div>
            </FadeItem>
            <FadeItem delay={100}>
              <div className="bg-slate-50 border-l-4 border-blue-300 rounded-r-2xl p-8">
                <p className="text-slate-700 text-lg leading-relaxed italic">
                  Sóc el secretari de l'escola. Sé què és fer actes, certificats, memòries, reunions... No parlo de teoria — visc cada dia la paperassa dels càrrecs. Especialista en automatització i IA aplicada. No ensenyo eines — ensenyo a muntar sistemes.
                </p>
              </div>
            </FadeItem>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <FadeItem>
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-4">Preguntes freqüents</p>
              <h2 className="text-4xl md:text-5xl font-black">Les preguntes que tothom fa</h2>
            </div>
          </FadeItem>

          <FadeItem delay={100}>
            <div className="bg-white rounded-3xl p-8 border border-slate-100">
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
              Voleu portar aquest programa<br />
              <span className="text-blue-300">al vostre grup de treball?</span>
            </h2>
            <p className="text-blue-200 text-lg mb-4 leading-relaxed">
              Escriviu-me i adaptem el programa al vostre perfil i necessitats.
            </p>
            <p className="text-blue-300 text-base mb-12">
              Fem una trucada de 20 minuts per identificar les necessitats del seminari i veure com encaixem el programa.
            </p>
          </FadeItem>

          <FadeItem delay={100}>
            {formStatus === 'success' ? (
              <div className="bg-green-800/40 border border-green-500/40 rounded-2xl p-10 text-center">
                <p className="text-4xl mb-4">✅</p>
                <p className="text-xl font-black text-green-300 mb-2">Rebut!</p>
                <p className="text-green-200">Us contactem en menys de 24 hores per organitzar la trucada.</p>
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
                    placeholder="Nom del seminari o servei"
                    required
                    value={formData.seminari}
                    onChange={e => setFormData({ ...formData, seminari: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Càrrec (secretari, cap d'estudis, coordinadora...)"
                  required
                  value={formData.carrec}
                  onChange={e => setFormData({ ...formData, carrec: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition"
                />
                <textarea
                  placeholder="Quina és la tasca que us fa perdre més temps? (opcional)"
                  rows={4}
                  value={formData.missatge}
                  onChange={e => setFormData({ ...formData, missatge: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition resize-none"
                />
                {formStatus === 'error' && (
                  <p className="text-red-300 text-sm text-center">Hi ha hagut un error. Torneu-ho a provar o escriviu-nos directament a mestreambtemps@gmail.com</p>
                )}
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-bold text-lg px-8 py-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  {formStatus === 'sending' ? 'Enviant...' : 'Sol·licita una trucada de 20 minuts'}
                  {formStatus !== 'sending' && <ArrowRight size={20} />}
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="text-blue-300 text-sm">o bé</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                <a
                  href="https://wa.me/639525092?text=Hola%20Rubén%2C%20m%27interessa%20saber%20més%20sobre%20el%20programa%20de%20seminaris%20de%20càrrecs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-8 py-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escriu per WhatsApp
                </a>
              </form>
            )}
          </FadeItem>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 bg-slate-950 text-slate-400 text-center text-sm">
        <p className="font-bold text-white mb-1">Mestre amb Temps</p>
        <p>© 2026 Mestre amb Temps · Programa d'automatització per a seminaris de càrrecs de gestió educativa</p>
        <p className="mt-2">
          <a href="mailto:mestreambtemps@gmail.com" className="hover:text-blue-400 transition">
            mestreambtemps@gmail.com
          </a>
        </p>
      </footer>

    </div>
  );
}
