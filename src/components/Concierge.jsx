import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

/* ──────────────────────────────────────────────────────────────
   CONCIERGE — multi-step intake modal
   Opens via: window.dispatchEvent(new CustomEvent('open-concierge'))
   ────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    type: 'intro',
    title: 'Concierge',
    body: 'A private channel to a MINUS 1 principal. Five questions. Then we contact you.',
    cta: 'Begin',
  },
  {
    type: 'choice',
    key: 'environment',
    label: '01 / Environment',
    q: 'Which environment interests you?',
    options: ['The Vault', 'The Citadel', 'The Ark', 'A Dome', 'Bespoke combination'],
  },
  {
    type: 'choice',
    key: 'region',
    label: '02 / Location',
    q: 'Where will the project be sited?',
    options: ['United Arab Emirates', 'GCC region', 'Mediterranean', 'Africa', 'Elsewhere'],
  },
  {
    type: 'choice',
    key: 'timeline',
    label: '03 / Timing',
    q: 'When do you intend to begin?',
    options: ['Immediately', 'Within 6 months', 'Within 12 months', 'Exploratory'],
  },
  {
    type: 'choice',
    key: 'investment',
    label: '04 / Range',
    q: 'Estimated investment?',
    options: ['$250K — $1M', '$1M — $5M', '$5M — $20M', '$20M+', 'Undisclosed'],
  },
  {
    type: 'form',
    label: '05 / Contact',
    q: 'How may we reach you, discreetly?',
  },
  {
    type: 'confirm',
    title: 'Brief received.',
    body: 'A principal will contact you within 48 hours via the channel you specified. All correspondence is held under NDA.',
  },
];

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    environment: '',
    region: '',
    timeline: '',
    investment: '',
    name: '',
    mobile: '',
    email: '',
    notes: '',
  });
  const [time, setTime] = useState('');
  const nameRef = useRef(null);

  // expose global opener
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep(0);
    };
    window.addEventListener('open-concierge', handler);
    return () => window.removeEventListener('open-concierge', handler);
  }, []);

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // live timecode
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const current = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const pickChoice = (val) => {
    setAnswers((a) => ({ ...a, [current.key]: val }));
    setTimeout(next, 250);
  };

  const submit = () => {
    const body = encodeURIComponent(
      `MINUS 1 — Concierge Brief

` +
      `Environment: ${answers.environment}
` +
      `Location: ${answers.region}
` +
      `Timing: ${answers.timeline}
` +
      `Investment: ${answers.investment}

` +
      `Name: ${answers.name}
` +
      `Mobile: ${answers.mobile}
` +
      `Email: ${answers.email}

` +
      `Notes:
${answers.notes || '—'}
`
    );
    const subject = encodeURIComponent(`Concierge Brief — ${answers.name || 'Prospective Principal'}`);
    window.location.href = `mailto:vault@minus1.studio?subject=${subject}&body=${body}`;
    next();
  };

  const formValid = answers.name.trim() && answers.email.trim() && answers.mobile.trim();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="concierge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[150] bg-ink overflow-y-auto"
        >
          {/* GRAIN OVERLAY */}
          <div className="absolute inset-0 grain pointer-events-none" />

          {/* TOP BAR */}
          <div className="sticky top-0 z-10 bg-ink/95 backdrop-blur-md border-b border-bone/10">
            <div className="px-6 md:px-12 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3 label text-bone/60">
                <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                <span className="text-orange">CONCIERGE</span>
                <span className="hidden md:inline text-bone/30">·</span>
                <span className="hidden md:inline tabular-nums text-bone/30">{time} UTC</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="label text-bone/60 hover:text-orange transition-colors flex items-center gap-2"
              >
                <span className="hidden md:inline">CLOSE</span>
                <span className="text-lg">✕</span>
              </button>
            </div>
            {/* PROGRESS */}
            <div className="h-px bg-bone/10 relative overflow-hidden">
              <motion.div
                className="h-full bg-orange"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* STEP CONTENT */}
          <div className="px-6 md:px-12 py-12 md:py-20 min-h-[calc(100vh-80px)] flex flex-col justify-center max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.label && (
                  <div className="label text-orange mb-6 md:mb-8 flex items-center gap-3">
                    <span className="w-6 h-px bg-orange" />
                    {current.label}
                  </div>
                )}

                {current.type === 'intro' && (
                  <>
                    <h2 className="display text-5xl md:text-7xl text-bone leading-[0.95] mb-8">
                      {current.title}
                    </h2>
                    <p className="text-pale text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
                      {current.body}
                    </p>
                    <Magnetic strength={0.25}>
                      <button
                        onClick={next}
                        className="label bg-orange text-ink px-8 py-4 hover:bg-orange-bright transition-colors inline-flex items-center gap-3"
                      >
                        {current.cta}
                        <span>→</span>
                      </button>
                    </Magnetic>
                  </>
                )}

                {current.type === 'choice' && (
                  <>
                    <h2 className="display text-4xl md:text-6xl text-bone leading-[1.05] mb-10 md:mb-14 max-w-3xl">
                      {current.q}
                    </h2>
                    <div className="grid gap-2 md:gap-3 max-w-2xl">
                      {current.options.map((opt, i) => (
                        <motion.button
                          key={opt}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                          onClick={() => pickChoice(opt)}
                          className={`group text-left border border-bone/15 hover:border-orange px-5 py-4 md:px-6 md:py-5 transition-all flex items-center justify-between ${
                            answers[current.key] === opt ? 'bg-orange text-ink border-orange' : 'text-bone hover:bg-coal'
                          }`}
                        >
                          <span className="text-base md:text-lg">{opt}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}

                {current.type === 'form' && (
                  <>
                    <h2 className="display text-4xl md:text-6xl text-bone leading-[1.05] mb-10 md:mb-14 max-w-3xl">
                      {current.q}
                    </h2>
                    <div className="grid gap-5 max-w-2xl">
                      <Field label="Name" value={answers.name} onChange={(v) => setAnswers({ ...answers, name: v })} ref={nameRef} placeholder="As you wish to be addressed" />
                      <Field label="Mobile" value={answers.mobile} onChange={(v) => setAnswers({ ...answers, mobile: v })} placeholder="+971 ..." type="tel" />
                      <Field label="Email" value={answers.email} onChange={(v) => setAnswers({ ...answers, email: v })} placeholder="discreet@channel.com" type="email" />
                      <Field label="Notes (optional)" value={answers.notes} onChange={(v) => setAnswers({ ...answers, notes: v })} placeholder="Anything we should know" textarea />

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Magnetic strength={0.25}>
                          <button
                            onClick={submit}
                            disabled={!formValid}
                            className={`label px-6 py-4 transition-colors inline-flex items-center gap-3 ${
                              formValid
                                ? 'bg-orange text-ink hover:bg-orange-bright cursor-pointer'
                                : 'bg-bone/10 text-bone/30 cursor-not-allowed'
                            }`}
                          >
                            Send Brief
                            <span>→</span>
                          </button>
                        </Magnetic>
                        <button
                          onClick={back}
                          className="label text-bone/50 hover:text-bone px-4 py-4 transition-colors"
                        >
                          ← BACK
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {current.type === 'confirm' && (
                  <>
                    <div className="display text-orange text-6xl md:text-8xl mb-8">✓</div>
                    <h2 className="display text-4xl md:text-6xl text-bone leading-[1.05] mb-6 max-w-3xl">
                      {current.title}
                    </h2>
                    <p className="text-pale text-lg leading-relaxed mb-12 max-w-xl">
                      {current.body}
                    </p>
                    <button
                      onClick={() => { setOpen(false); setStep(0); }}
                      className="label border border-bone/30 text-bone hover:border-orange hover:text-orange px-6 py-4 transition-all"
                    >
                      CLOSE
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* BACK button for choice steps */}
            {current.type === 'choice' && step > 1 && (
              <button
                onClick={back}
                className="label text-bone/40 hover:text-bone mt-8 self-start transition-colors"
              >
                ← BACK
              </button>
            )}
          </div>

          {/* BOTTOM BAR */}
          <div className="px-6 md:px-12 pb-6 border-t border-bone/10 pt-4 flex items-center justify-between label text-bone/30">
            <span>STEP {step + 1} / {STEPS.length}</span>
            <span className="hidden md:inline">vault@minus1.studio</span>
            <span>HELD UNDER NDA</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* FIELD INPUT */
const Field = forwardRef(function Field({ label, value, onChange, placeholder, type = 'text', textarea = false }, ref) {
  return (
    <label className="block">
      <span className="label text-bone/40 mb-2 block">{label}</span>
      {textarea ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent border-b border-bone/20 focus:border-orange text-bone text-lg py-3 outline-none transition-colors placeholder-bone/25 resize-none"
        />
      ) : (
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="w-full bg-transparent border-b border-bone/20 focus:border-orange text-bone text-lg py-3 outline-none transition-colors placeholder-bone/25"
        />
      )}
    </label>
  );
});
