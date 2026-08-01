import { useEffect, useRef, useState, type ReactNode } from 'react';

const HERO_VIDEO = 'https://cdn.sceneai.art/Hero%20Section%20Video/50b4f304-cdca-4e12-8735-580d225834be.mp4';
const CHAT_VIDEO = 'https://cdn.sceneai.art/Hero%20Section%20Video/1bcc8fa3-37f6-4c53-8591-0347e4c7f8ac.mp4';
const TRANSCRIPTION_VIDEO = 'https://cdn.sceneai.art/Hero%20Section%20Video/736fd4a0-70ac-4f44-9633-55769ead6aca.mp4';

/* ───────────── Scroll reveal ───────────── */

function FadeInUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ───────────── Logo ───────────── */

function PletyLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 26V9a3 3 0 0 1 3-3h9a7 7 0 0 1 0 14h-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="24" r="3" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

/* ───────────── Botones ───────────── */

function PrimaryButton({ children = 'Get started' }: { children?: ReactNode }) {
  return (
    <button className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors">
      {children}
    </button>
  );
}

function SecondaryButton({ children = 'Learn more' }: { children?: ReactNode }) {
  return (
    <button className="bg-[#1F1F22] hover:bg-[#2A2A2D] text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/5 transition-colors">
      {children}
    </button>
  );
}

/* ───────────── Navbar ───────────── */

const navLinks = [
  { label: 'About', id: 'about' },
  { label: 'Features', id: 'features' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <a href="#about" onClick={(e) => { e.preventDefault(); go('about'); }} className="flex items-center gap-2 text-white">
            <PletyLogo />
            <span className="text-lg font-semibold tracking-tight">Plety</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); go(link.id); }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button className="bg-[#1F1F22] hover:bg-[#2A2A2D] text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/5 transition-colors">
              Get started
            </button>
          </div>

          <button
            className="md:hidden w-10 h-10 -mr-2 inline-flex items-center justify-center text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className="relative w-5 h-4 block">
              <span className={`absolute left-0 h-[1.5px] w-5 bg-white rounded transition-all duration-300 ${open ? 'top-[7px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-white rounded transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-[1.5px] w-5 bg-white rounded transition-all duration-300 ${open ? 'top-[7px] -rotate-45' : 'top-[14px]'}`} />
            </span>
          </button>
        </div>

        {/* Menú móvil */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-80 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); go(link.id); }}
                className="text-sm font-medium text-gray-300 hover:text-white py-2.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button className="mt-3 bg-[#1F1F22] hover:bg-[#2A2A2D] text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/5 w-full transition-colors">
              Get started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ───────────── Marcas del marquee ───────────── */

function BrandSpringfield() {
  return (
    <svg viewBox="0 0 120 24" fill="none" className="h-5 w-auto text-gray-500" aria-hidden="true">
      <path d="M4 18V6l6 8 6-8v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="24" y="17" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Springfield</text>
    </svg>
  );
}
function BrandOrbitc() {
  return (
    <svg viewBox="0 0 100 24" fill="none" className="h-5 w-auto text-gray-500" aria-hidden="true">
      <circle cx="11" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="11" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.6" transform="rotate(-25 11 12)" />
      <text x="26" y="17" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Orbitc</text>
    </svg>
  );
}
function BrandCloud() {
  return (
    <svg viewBox="0 0 96 24" fill="none" className="h-5 w-auto text-gray-500" aria-hidden="true">
      <path d="M6 16h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.4 1.6A3.4 3.4 0 0 0 6 16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <text x="26" y="17" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Cloud</text>
    </svg>
  );
}
function BrandAmster() {
  return (
    <svg viewBox="0 0 104 24" fill="none" className="h-5 w-auto text-gray-500" aria-hidden="true">
      <path d="M4 18 11 5l7 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 14h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <text x="24" y="17" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Amster</text>
    </svg>
  );
}
function BrandNexus() {
  return (
    <svg viewBox="0 0 98 24" fill="none" className="h-5 w-auto text-gray-500" aria-hidden="true">
      <path d="M5 18V6l11 12V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="24" y="17" fill="currentColor" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Nexus</text>
    </svg>
  );
}

const brands = [BrandSpringfield, BrandOrbitc, BrandCloud, BrandAmster, BrandNexus];

function Marquee() {
  // 4 copias → dos mitades idénticas para que translateX(-50%) sea perfecto
  const sequence = [...brands, ...brands, ...brands, ...brands];
  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div className="flex w-max items-center animate-[marquee_30s_linear_infinite]">
        {sequence.map((Brand, i) => (
          <div key={i} className="flex-shrink-0 px-8">
            <Brand />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Hero ───────────── */

function Hero() {
  return (
    <section id="about" className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative z-0 px-6">
      <video
        autoPlay
        loop
        muted
        playsInline
        src={HERO_VIDEO}
        className="absolute inset-0 -z-10 object-cover min-w-full min-h-full w-full h-full opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black" />

      <FadeInUp>
        <span className="inline-block px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 backdrop-blur-sm">
          ✨ Announcing API 2.0
        </span>
      </FadeInUp>

      <FadeInUp delay={100}>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-center">
          The intelligence layer
          <br />
          for clear <span className="font-serif italic font-normal">decisions.</span>
        </h1>
      </FadeInUp>

      <FadeInUp delay={200}>
        <p className="text-[16px] text-gray-400 max-w-2xl text-center mx-auto">
          Our platform integrates seamlessly into your stack to deliver real-time
          understanding, not just predictions.
        </p>
      </FadeInUp>

      <FadeInUp delay={300}>
        <div className="flex flex-row items-center justify-center gap-3 mt-10">
          <PrimaryButton />
          <SecondaryButton />
        </div>
      </FadeInUp>

      <FadeInUp delay={400} className="w-full max-w-5xl">
        <p className="text-sm text-gray-500 font-medium mb-8 text-center mt-24">
          Trusted by industry leaders
        </p>
        <Marquee />
      </FadeInUp>
    </section>
  );
}

/* ───────────── Feature 1 · AI chat ───────────── */

const chatChips = ['Create image', 'Summarize', 'Analyze data', 'Brainstorm'];

function FeatureChat() {
  return (
    <section id="features" className="grid lg:grid-cols-2 gap-16 py-24 px-6 max-w-7xl mx-auto items-center">
      <FadeInUp>
        <span className="inline-block text-xs font-medium text-yellow-400 mb-5">✨ AI chat</span>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Where speed meets intelligent conversation.
        </h2>
        <p className="text-[16px] text-gray-400 mb-8 max-w-xl">
          A conversational AI assistant that understands your questions, provides
          intelligent answers, and helps you get things done fast from casual chats to
          complex tasks.
        </p>
        <PrimaryButton />
      </FadeInUp>

      <FadeInUp delay={150}>
        <div className="rounded-3xl overflow-hidden p-8 border border-white/10 relative min-h-[420px] flex items-end">
          <video
            autoPlay
            loop
            muted
            playsInline
            src={CHAT_VIDEO}
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {chatChips.map((chip) => (
                <span key={chip} className="text-xs text-gray-300 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4 py-3">
              <span className="flex-1 text-sm text-gray-500">Ask anything...</span>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2M21 12h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}

/* ───────────── Feature 2 · AI transcription ───────────── */

function FeatureTranscription() {
  const bars = [10, 18, 28, 16, 34, 22, 40, 26, 14, 30, 20, 36, 24, 12, 28, 18, 32, 22, 16, 26, 34, 14, 24, 30, 18];
  return (
    <section className="grid lg:grid-cols-2 gap-16 py-24 px-6 max-w-7xl mx-auto items-center">
      <FadeInUp className="order-2 lg:order-1">
        <div className="rounded-3xl overflow-hidden p-8 border border-white/10 relative min-h-[420px] flex items-end">
          <video
            autoPlay
            loop
            muted
            playsInline
            src={TRANSCRIPTION_VIDEO}
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-white text-black inline-flex items-center justify-center shrink-0" aria-label="Play">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1.5">11:06 AM – Chris</p>
                <div className="flex items-center gap-[3px] h-8">
                  {bars.map((h, i) => (
                    <span
                      key={i}
                      className={`w-[3px] rounded-full ${i < 11 ? 'bg-white/80' : 'bg-white/25'}`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mt-4 pt-4 border-t border-white/10">
              "Let's move the launch review to Thursday so the data team can finish the
              benchmark. I'll send the updated deck tonight and we can walk through the
              numbers together."
            </p>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={150} className="order-1 lg:order-2">
        <span className="inline-block text-xs font-medium text-green-400 mb-5">✨ AI transcription</span>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Turn speech into text with speed and precision.
        </h2>
        <p className="text-[16px] text-gray-400 mb-8 max-w-xl">
          Automatically convert speech into accurate, editable text in real time. Perfect
          for meetings, interviews, voice notes, and more, powered by advanced speech
          recognition technology.
        </p>
        <PrimaryButton />
      </FadeInUp>
    </section>
  );
}

/* ───────────── FAQ ───────────── */

const faqs = [
  {
    q: 'Is my data safe when using Plety?',
    a: 'Yes. Every request is encrypted in transit and at rest, and your data is never used to train shared models. You can delete your workspace history at any time from the dashboard.',
  },
  {
    q: 'How does Plety integrate with my existing stack?',
    a: 'Plety ships with a REST API, webhooks, and native SDKs for TypeScript and Python. Most teams are live in an afternoon without changing their infrastructure.',
  },
  {
    q: 'Which languages does the transcription support?',
    a: 'Transcription currently supports 34 languages with automatic language detection, including regional variants for Spanish, English, and Portuguese.',
  },
  {
    q: 'Can I use Plety with my own model?',
    a: 'You can bring your own model endpoint or use ours. Routing rules let you send sensitive workloads to a private deployment and everything else to the shared cluster.',
  },
  {
    q: 'What happens when I hit my plan limits?',
    a: 'Nothing breaks. Requests keep flowing and you are billed for the overage at the same per-unit rate, so you never lose data during a traffic spike.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6 max-w-3xl mx-auto">
      <FadeInUp>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12 text-center">
          We've got answers
        </h2>
      </FadeInUp>

      <FadeInUp delay={100}>
        <div className="border border-white/10 rounded-xl bg-transparent overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className={i < faqs.length - 1 ? 'border-b border-white/10' : ''}>
                <button
                  className="w-full flex items-center justify-between gap-6 text-left py-6 px-6"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base text-white font-medium">{faq.q}</span>
                  <span className={`relative shrink-0 w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <span className="absolute top-1/2 left-0 w-4 h-[1.5px] -translate-y-1/2 bg-current rounded" />
                    <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-current rounded" />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-400 text-sm pb-6 px-6">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeInUp>
    </section>
  );
}

/* ───────────── Footer ───────────── */

const footerCols = [
  { title: 'Product', links: ['About', 'Pricing', 'Changelog', 'Contact'] },
  { title: 'Legal', links: ['Terms of service', 'Privacy policy', '404'] },
  { title: 'Connect', links: ['Instagram', 'YouTube', 'LinkedIn', 'Twitter / X'] },
];

function Footer() {
  return (
    <footer id="contact" className="relative z-0 pt-32 pb-10 px-6 border-t border-white/5 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        src={HERO_VIDEO}
        className="absolute inset-0 object-cover w-full h-full opacity-40 -z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-black/60 to-black" />

      <FadeInUp>
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-center">
          Ready to automate <span className="font-serif italic font-normal">everything?</span>
        </h2>
        <div className="flex flex-row items-center justify-center gap-3 mt-10 mb-32">
          <PrimaryButton />
          <SecondaryButton />
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-24">
        <div>
          <div className="flex items-center gap-2 mb-3 text-white">
            <PletyLogo />
            <span className="text-xl font-bold tracking-tight">Plety</span>
          </div>
          <p className="text-sm text-gray-400 max-w-[24ch]">Speed, scale, and smarts — deployed.</p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium text-white mb-4">{col.title}</p>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-gray-500 border-t border-white/5 pt-8">
        <span>© 2026 Plety. All rights reserved</span>
        <span className="hidden md:inline">·</span>
        <span>
          by <span className="text-gray-300">Re-text</span>
        </span>
        <span className="hidden md:inline">·</span>
        <span>
          Made in <span className="text-gray-300">Gemini</span>
        </span>
      </div>
    </footer>
  );
}

/* ───────────── App ───────────── */

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <FeatureChat />
      <FeatureTranscription />
      <FAQ />
      <Footer />
    </div>
  );
}
