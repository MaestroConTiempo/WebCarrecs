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

// FAQ accordion item
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

export default function CentreIALanding() {
  const [scrollY, setScrollY] = useState(0);
  const [activePhase, setActivePhase] = useState(0);

  // Contact form state
  const [formData, setFormData] = useState({ nom: '', centre: '', carrec: '', missatge: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | success | error

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [metricsRef, metricsInView] = useInView(0.3);
  const count30 = useCounter(30, metricsInView, 2500);
  const count3  = useCounter(3,  metricsInView, 1800);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Sol·licitud diagnòstic - ${formData.centre}`);
    const body = encodeURIComponent(
      `Nom: ${formData.nom}\nCentre: ${formData.centre}\nCàrrec: ${formData.carrec}\n\n${formData.missatge}`
    );
    window.location.href = `mailto:mestreambtemps@gmail.com?subject=${subject}&body=${body}`;
    setFormStatus('success');
  };

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* HEADER — logo only, no nav */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-lg font-black tracking-tight">
            <span className="text-blue-900">Centre</span>
            <span className="text-slate-400"> IA en Marxa</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-28 pb-24 px-6 relative overflow-hidden">
        <div
          className="absolute top-20 left-10 w-80 h-80 border border-slate-200 rounded-3xl opacity-20"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div className="absolute bottom-0 right-20 w-96 h-96 border border-slate-100 rounded-full opacity-10" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-slate-100 rounded-full text-xs font-black text-blue-900 uppercase tracking-widest">
            Per a directius i equips pedagògics
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-8 tracking-tight">
            <span className="text-blue-900">Tot el que crema hores al vostre claustre, automatitzat.</span>
            <br />
            <span className="text-slate-500 text-4xl md:text-5xl">Sense dependre de cap expert.</span>
          </h1>

          <p className="text-2xl text-slate-700 mb-4 max-w-3xl leading-relaxed font-bold">
            No és una formació genèrica. És implementació real de sistemes de treball que necessiteu
          </p>

          <p className="text-lg text-slate-500 mb-10 max-w-3xl leading-relaxed">
            Implantem fluxos de treball amb IA que el claustre usa dia a dia. Una línia d'escola unificada, que tothom segueix. Sistemàtica, documentada, que queda al centre.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a href="#contacte" className="px-8 py-5 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-950 transition flex items-center justify-center gap-3 text-lg">
              Reserva diagnòstic (gratuït)
              <ArrowRight size={20} />
            </a>
          </div>

          <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${count30}h → 2h`, label: 'Reduïm el temps en burocràcia per mestre/trimestre', delay: 0,   size: 'text-3xl' },
              { value: '≡',               label: "Unifiquem la línia d'escola",                         delay: 200, size: 'text-5xl' },
              { value: count3,            label: 'fluxos automatitzats',                                delay: 400, size: 'text-3xl' },
              { value: '∞',               label: 'Estandaritzem maneres de fer al centre',              delay: 600, size: 'text-5xl' },
            ].map((m, i) => (
              <FadeItem key={i} delay={m.delay} className="border-l-4 border-blue-900 pl-6">
                <div className={`${m.size} font-black text-blue-900 whitespace-nowrap`}>{m.value}</div>
                <div className="text-slate-600 text-sm mt-1">{m.label}</div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="py-24 px-6 bg-blue-50 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Què passa al vostre centre?</h2>
          <p className="text-xl text-slate-600 mb-16 max-w-3xl">Reconeixeu alguna d'aquestes situacions?</p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: '📄', title: 'Informes desiguals',
                desc: 'Cada docent redacta de manera diferent. Imatge inconsistent davant les famílies. Direcció constantment unificant formats.' },
              { icon: '⏱️', title: 'Cada docent ho fa a la seva manera',
                desc: "Situacions d'aprenentatge amb enfocaments diferents per cicles. Activitats dissenyades sense un criteri comú." },
              { icon: '🔄', title: 'Rotació docent = caos',
                desc: 'Setembre es torna a començar de zero. Cada docent inventa el seu procés. Cap memòria col·lectiva.' },
              { icon: '🚫', title: 'IA en teoria, no en pràctica',
                desc: 'Vau fer un curs. Ara cadascú usa IA o no. Zero protocol, zero seguretat, zero coherència.' },
              { icon: '📋', title: 'Sense elaboració automàtica de materials',
                desc: "Programacions, actes de reunió, materials. Docents redactant a casa perquè a l'escola no hi ha temps. Cap sistema d'elaboració automàtica al centre." },
              { icon: '🎯', title: "Sense línia d'escola",
                desc: 'Cada cicle fa la seva. Metodologies fragmentades. Alumnes que canvien de dinàmica cada any.' },
            ].map((item, i) => (
              <FadeItem
                key={i}
                delay={0}
                className="p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </FadeItem>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-900 text-white rounded-2xl border-2 border-blue-900">
            <p className="text-xl leading-relaxed">
              <strong>El fons del problema:</strong> No és que "l'IA no funcioni". És que el centre no té un <strong>sistema</strong> que defineixi quan, com i per a què usar-la. Sense protocol, sense plantilles, sense assistents configurats. Només caos amb més tecnologia.
            </p>
          </div>
        </div>
      </section>

      {/* COST REAL */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Quin és el cost real de continuar com ara?</h2>
          <p className="text-xl text-slate-400 mb-14 max-w-3xl">Cada any sense un sistema té un preu concret per al vostre centre.</p>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '📆', text: 'Un any més amb la mateixa càrrega burocràtica' },
              { icon: '🔧', text: 'Seguir amb més cursos on el claustre prova eines aïllades' },
              { icon: '📊', text: 'Informes desiguals sense criteri comú' },
              { icon: '🔁', text: "Cada nova incorporació d'una mestra torna a començar de zero" },
              { icon: '🚔', text: 'L\'equip directiu fent de "policia" de la documentació' },
              { icon: '⚔️', text: 'Lluita constant per aconseguir unificar la metodologia del centre' },
            ].map((item, i) => (
              <FadeItem
                key={i}
                delay={i * 80}
                className="flex items-start gap-5 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
              >
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <p className="text-lg text-slate-200 leading-relaxed">{item.text}</p>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMA */}
      <section id="programa" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Centre IA en Marxa</h2>
          <p className="text-xl text-slate-600 mb-16 max-w-3xl">
            Programa d'implementació amb 3 fases. Entrem, identifiquem els fluxos que us cremen més, els automatitzem, documentem tot i entreguem sistemes que funcionen.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { num: '01', title: 'Diagnosi',
                desc: "Establim les necessitats de l'escola amb un grup impulsor del claustre. Identifiquem els processos que generen més càrrega i dissenyem el pla d'acció específic per al centre." },
              { num: '02', title: 'Implantació', highlight: true,
                desc: 'Escalem a tot el claustre. Creem 3 fluxos estables, assistents personalitzats i manual operatiu complet.' },
              { num: '03', title: 'Expansió',
                desc: "Nous fluxos segons necessitats. Comunicacions a famílies, programacions, seguiment. El sistema creix amb l'escola." },
            ].map((phase, i) => (
              <FadeItem
                key={i}
                delay={i * 150}
                className={`p-8 rounded-2xl border-2 relative overflow-hidden transition-all cursor-pointer ${
                  phase.highlight
                    ? 'border-blue-900 bg-gradient-to-br from-blue-50 to-slate-50 shadow-2xl scale-105'
                    : 'border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 hover:border-blue-500'
                }`}
              >
                <div onMouseEnter={() => setActivePhase(i)}>
                  <div className={`text-5xl font-black mb-2 ${phase.highlight ? 'text-blue-900' : 'text-slate-400'}`}>
                    {phase.num}
                  </div>
                  <h3 className="text-3xl font-black mb-4">{phase.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{phase.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* QUÈ TINDRÀ EL CENTRE */}
      <section className="py-24 px-6 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Què tindrà el vostre centre en acabar</h2>
          <p className="text-xl text-slate-600 mb-16 max-w-3xl">
            No és teoria. No són certificats. Són sistemes que el claustre usa cada setmana.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FadeItem delay={0} className="p-10 bg-white border-2 border-slate-200 rounded-2xl">
              <h3 className="text-2xl font-black mb-6 text-teal-600">Què guanya la direcció</h3>
              <ul className="space-y-4">
                {[
                  'Informes, programacions i materials amb format i criteri unificats a tot el centre',
                  'Protocols clars perquè la documentació arribi a temps sense perseguir ningú',
                  'Onboarding de docents nous en dies, no en mesos',
                  'La manera de treballar queda al centre, no depèn de persones concretes',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeItem>

            <FadeItem delay={150} className="p-10 bg-white border-2 border-slate-200 rounded-2xl">
              <h3 className="text-2xl font-black mb-6 text-pink-600">Què guanya el claustre</h3>
              <ul className="space-y-4">
                {[
                  'Menys hores en paperassa repetitiva (informes, actes, programacions i creació de materials)',
                  "Fluxos clars: \"al nostre centre, les situacions d'aprenentatge es fan així\"",
                  "Més temps per a l'alumnat i el disseny d'activitats amb sentit",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeItem>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: <BookOpen size={32} className="text-blue-900" />,
                title: '3 fluxos de treball automatitzats',
                desc: 'Processos que abans consumien hores ara funcionen amb plantilles i assistents. Exemple: informes trimestrals de 45 min/alumne a 2 min/alumne.' },
              { icon: <Users size={32} className="text-blue-900" />,
                title: '2 assistents interns del centre',
                desc: "Configurats a mida: alineats amb el vostre projecte educatiu, la manera de programar i avaluar. Qualsevol docent els usa des del dia 1." },
              { icon: <BookOpen size={32} className="text-blue-900" />,
                title: 'Manual operatiu del centre',
                desc: "Plantilles, protocols i exemples oficials. Perquè docents nous s'incorporin i treballin igual. La pràctica queda a l'escola, no se'n va amb la persona." },
              { icon: <Globe size={32} className="text-blue-900" />,
                title: 'Entorn web del centre',
                desc: 'El centre tindrà un entorn web amb tota la documentació que anem treballant: fluxos, plantilles, assistents i protocols. Accessible per a tot el claustre en qualsevol moment.' },
            ].map((item, i) => (
              <FadeItem
                key={i}
                delay={0}
                className="p-10 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </FadeItem>
            ))}
          </div>

          <div className="p-10 bg-blue-900 text-white rounded-2xl border-2 border-blue-900">
            <p className="text-lg leading-relaxed">
              <strong>"Per a que la IA funcioni al dia a dia del centre, no només en teoria."</strong>
              <br /><br />
              Quan acabem, tota l'escola usa el mateix sistema. Docents nous entenen com es fan les coses en una setmana. Els informes són coherents. Els assistents són alineats. Cap persona és "l'expert en IA". Tothom treballa igual.
            </p>
          </div>
        </div>
      </section>

      {/* CASOS PRÀCTICS */}
      <section id="fases" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Exemples reals</h2>

          <div className="space-y-6">
            {[
              { caso: 'Informes trimestrals (25 alumnes)',
                antes:   '45 min × 25 = 18h per docent. Formats desiguals.',
                despues: '5 min × 25 = 2h. Format, criteri i to unificats automàticament.' },
              { caso: "Creació d'activitats de resolució de problemes",
                antes:   "Cada docent crea les seves. Diferent enfocament per cicle. Cap línia d'escola.",
                despues: 'Assistent genera activitats alineades amb metodologia pròpia per a tota la primària.' },
              { caso: 'Programacions didàctiques',
                antes:   'Redacció manual des de zero. Hores per docent. Formats inconsistents.',
                despues: 'Assistent genera esborrany automàtic amb plantilla oficial. Docent revisa i ajusta.' },
              { caso: 'Docent nou al centre',
                antes:   '"com es fan les coses aquí". Setmanes per entendre-ho.',
                despues: 'Accés a assistents i plantilles des del dia 1. Treballa com la resta en una setmana.' },
            ].map((ejemplo, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-6">
                <FadeItem delay={0} dir="left" className="p-8 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <p className="text-sm font-black text-red-900 mb-2">ABANS</p>
                  <p className="font-black text-slate-900 mb-3">{ejemplo.caso}</p>
                  <p className="text-slate-700">{ejemplo.antes}</p>
                </FadeItem>
                <FadeItem delay={300} dir="right" className="p-8 bg-green-50 border-l-4 border-green-400 rounded-lg flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-black text-green-900 mb-2">DESPRÉS</p>
                    <p className="text-slate-700">{ejemplo.despues}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-green-900 font-black">
                    <ArrowUpRight size={20} /> Impacte real
                  </div>
                </FadeItem>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Centres que ja ho han implantat</h2>
          <p className="text-xl text-slate-500 mb-14">En nombres concrets, no en impressions generals.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Hem passat d'invertir 18h per docent en informes a menys de 2h. I tot el claustre treballa amb el mateix criteri. Ja no hem de perseguir ningú.",
                author: 'Pati Rey',
                role: 'Directora',
                school: 'Escola Samuntada, Sabadell',
              },
              {
                quote: "Hem automatitzat la feina repetitiva i hem recuperat hores per a allò que importa. Els docents nous s'incorporen en dies, no en setmanes. El sistema queda, no depèn de cap persona.",
                author: 'Jordi Gálvez',
                role: 'Mestre',
                school: 'Escola Riera Alta, Santa Coloma de Gramenet',
              },
              {
                quote: "Unificar la manera de treballar les situacions d'aprenentatge de ciències era un repte constant: cada mestra tenia el seu enfocament. Ara tenim un assistent que guia cada docent en el disseny d'aquestes programacions amb un criteri comú de centre.",
                author: 'M. Àngels Puig',
                role: 'Cap d\'estudis, Badalona',
                school: '',
              },
            ].map((test, i) => (
              <FadeItem
                key={i}
                delay={i * 150}
                className="p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 transition-all flex flex-col"
              >
                <p className="text-lg text-slate-900 mb-8 italic flex-1">"{test.quote}"</p>
                <div className="border-t border-slate-100 pt-5">
                  <p className="font-black text-slate-900">{test.author}</p>
                  <p className="text-sm text-blue-900 font-medium">{test.role}</p>
                  {test.school && <p className="text-sm text-slate-500">{test.school}</p>}
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-4">Preguntes freqüents</h2>
          <div className="mb-14" />

          <div className="bg-white border-2 border-slate-200 rounded-2xl px-8">
            {[
              {
                question: 'Quant costa el programa?',
                answer: "La inversió varia segons la mida del centre i les fases que s'implementen. En la sessió diagnòstica gratuïta t'expliquem les opcions i fem una proposta a mida. No hi ha sorpreses: el preu és tancat des del primer dia.",
              },
              {
                question: 'Ja fem formació en IA. Per a qué necessitem això?',
                answer: "La formació ensenya a usar eines. Nosaltres implementem sistemes. La diferència: amb formació, cada docent fa el que vol. Amb Centre IA en Marxa, el claustre té un protocol, plantilles i assistents configurats que tothom usa igual. El resultat és coherència i temps recuperat, no coneixement individual.",
              },
              {
                question: 'Tindrà el claustre temps per implementar-ho?',
                answer: "La càrrega sobre el claustre és mínima. Treballem amb un grup impulsor de 3-5 persones que ja estan motivades. La resta del claustre rep el sistema fet: accés als assistents, plantilles i un manual clar. No és un projecte de formació, és una implementació que el centre adopta de manera progressiva.",
              },
              {
                question: 'Les dades dels alumnes estan segures?',
                answer: "Sí. Establim des del primer dia els criteris de quines dades es poden usar i com anonimitzar-les. Treballem sota criteris RGPD i el centre manté en tot moment el control de la informació. Cap dada surt del vostre entorn sense protocol explícit.",
              },
              {
                question: "Què passa quan acabem el programa? El centre queda sol?",
                answer: "El programa inclou un manual operatiu, l'entorn web del centre i assistents configurats que queden en propietat del centre. A més, oferim suport continu en la fase d'Expansió per afegir nous fluxos quan el centre ho necessiti. No desapareixem.",
              },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL — formulari de contacte */}
      <section id="contacte" className="py-24 px-6 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 border border-blue-700 rounded-full opacity-20" />
        <div className="absolute bottom-10 left-10 w-64 h-64 border border-blue-700 rounded-3xl opacity-10" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: copy */}
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-6">Voleu explorar si encaixa?</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                En parlem durant 20 minuts durant els quals identifiquem els 3 punts on el vostre centre perd més temps. Sense compromís. Diagnòstic gratuït.
              </p>
              <div className="space-y-3 text-blue-200 text-sm">
                <p>mestreambtemps@gmail.com</p>
                <p>+34 639 525 092</p>
                <a
                  href="https://wa.me/639525092?text=Hola%20Rubén%2C%20m%27interessa%20saber%20més%20sobre%20Centre%20IA%20en%20Marxa"
                  className="inline-flex items-center gap-2 mt-2 text-white font-black hover:text-blue-200 transition"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escriu per WhatsApp
                </a>
              </div>
              <p className="text-xs text-blue-300 mt-8">Rubén Fabri · +15 anys de docència · Secretari de l'escola · Automatitzant la feina a les escoles</p>
            </div>

            {/* Right: form */}
            <div className="bg-white rounded-2xl p-8">
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Missatge rebut!</h3>
                  <p className="text-slate-600">Ens posarem en contacte amb vosaltres en menys de 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Sol·licita el diagnòstic gratuït</h3>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nom i cognoms *</label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={e => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 transition"
                      placeholder="Maria Garcia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Centre educatiu *</label>
                    <input
                      type="text"
                      required
                      value={formData.centre}
                      onChange={e => setFormData({ ...formData, centre: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 transition"
                      placeholder="Escola Exemple, Barcelona"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Càrrec *</label>
                    <input
                      type="text"
                      required
                      value={formData.carrec}
                      onChange={e => setFormData({ ...formData, carrec: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 transition"
                      placeholder="Directora / Cap d'estudis / Mestre/a"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Explica'ns la situació del centre</label>
                    <textarea
                      rows={3}
                      value={formData.missatge}
                      onChange={e => setFormData({ ...formData, missatge: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 transition resize-none"
                      placeholder="Quin és el principal problema que voleu resoldre?"
                    />
                  </div>
                  {formStatus === 'error' && (
                    <p className="text-red-600 text-sm">Hi ha hagut un error. Escriu-nos directament a mestreambtemps@gmail.com</p>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full py-4 bg-blue-900 text-white rounded-lg font-black hover:bg-blue-950 transition flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {formStatus === 'sending' ? 'Enviant...' : 'Sol·licitar diagnòstic gratuït'}
                    {formStatus !== 'sending' && <ArrowRight size={20} />}
                  </button>
                  <p className="text-xs text-slate-400 text-center">Sense compromís. Us contactem en menys de 24h.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-400 text-center">
        <p className="text-sm">© 2026 Mestre amb Temps. Tota la informació es gestiona sota criteris RGPD.</p>
      </footer>
    </div>
  );
}
