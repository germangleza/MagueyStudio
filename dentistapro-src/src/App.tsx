import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';

const HERO_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_113640_ccf3cf97-d447-425b-a134-d7b09fc743fc.png&w=1280&q=85';

const SECTION2_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114219_414dfe80-f15c-4e25-bf52-b13721f4bd88.png&w=1280&q=85';

const SECTION3_IMG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85';

const SECTION3_IMG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85';

const SECTION3_BG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85';

const featureBars = ['Odontología avanzada', 'Equipo de alta calidad', 'Trato amable'];

const services = [
  { name: 'Carillas\ndentales', num: '01', active: true },
  { name: 'Coronas\ndentales', num: '02', active: false },
  { name: 'Blanqueamiento\ndental', num: '03', active: false },
  { name: 'Implantes\ndentales', num: null, active: false },
];

/* ───────────────────────── Hooks ───────────────────────── */

interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

/** Offset de un elemento relativo a un ancestro, inmune a transforms (usa offsetLeft/offsetTop). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function useMaskPositions(
  sectionRef: React.MutableRefObject<HTMLElement | null>,
  cardsRef: React.MutableRefObject<(HTMLElement | null)[]>,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const sw = section.clientWidth;
    const sh = section.clientHeight;
    const next = cardsRef.current.map((card) => {
      if (!card) return { x: 0, y: 0, sw, sh };
      const { x, y } = offsetWithin(card, section);
      return { x, y, sw, sh };
    });
    setPositions(next);
  }, [sectionRef, cardsRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, sectionRef]);

  return positions;
}

function useImageWidth(src: string, sectionHeight: number) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  if (!natural || !sectionHeight) return 0;
  return natural.w * (sectionHeight / natural.h);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
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
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getAnimStyle = useCallback(
    (index: number): CSSProperties => ({
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
    }),
    [visible],
  );

  void count;
  return { containerRef, getAnimStyle };
}

/* ───────────────────────── MaskedCard ───────────────────────── */

interface MaskedCardProps {
  bgImage: string;
  position?: MaskPosition;
  imageWidth: number;
  focalX: number;
  className?: string;
  children?: ReactNode;
  cardRef?: Ref<HTMLDivElement>;
  style?: CSSProperties;
}

function MaskedCard({
  bgImage,
  position,
  imageWidth,
  focalX,
  className = '',
  children,
  cardRef,
  style,
}: MaskedCardProps) {
  const pos = position ?? { x: 0, y: 0, sw: 0, sh: 0 };
  const overflow = imageWidth > pos.sw ? imageWidth - pos.sw : 0;
  const focalOffset = overflow * focalX;

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: `auto ${pos.sh}px`,
        backgroundPosition: `-${pos.x + focalOffset}px -${pos.y}px`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Splash ───────────────────────── */

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= 100) {
          clearInterval(interval);
          return 100;
        }
        return c + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count < 100) return;
    const exitTimer = setTimeout(() => setExiting(true), 200);
    const doneTimer = setTimeout(onComplete, 900);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [count, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <span className="text-black text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none">
        {count}
      </span>
    </div>
  );
}

/* ───────────────────────── Navbar ───────────────────────── */

const navLinks = ['Inicio', 'Servicios', 'Nosotros', 'Galería', 'Contacto'];

function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-black">Dental</span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-black -mt-1.5 md:-mt-2">Health</span>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2 text-black">salud de calidad</span>
        </div>

        <div className="hidden md:block">
          <button className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200">
            Menú
          </button>
        </div>
        <span className="hidden md:block text-sm font-semibold text-black">Urgencias dentales</span>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center relative"
          aria-label="Abrir o cerrar menú"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}
          />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 z-40 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <nav className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={() => setOpen(false)}
                className={`text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
              >
                {link}
              </a>
            ))}
            <div
              className={`mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: open ? '450ms' : '0ms' }}
            >
              <p className="text-sm font-semibold text-black mb-4">Urgencias dentales</p>
              <button className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200">
                Agendar cita
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

/* ───────────────────────── Arrow icon ───────────────────────── */

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`rotate-[-45deg] ${className}`}
    >
      <path
        d="M1 7h12m0 0L8 2m5 5L8 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ───────────────────────── App ───────────────────────── */

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();

  const section1Ref = useRef<HTMLElement | null>(null);
  const s1Cards = useRef<(HTMLElement | null)[]>([]);
  const s1Positions = useMaskPositions(section1Ref, s1Cards);
  const s1Height = s1Positions[0]?.sh ?? 0;
  const s1ImageWidth = useImageWidth(HERO_IMAGE, s1Height);
  const s1Focal = isMobile ? 0.7 : 0.8;
  const s1Reveal = useStaggeredReveal(4);

  const section2Ref = useRef<HTMLElement | null>(null);
  const s2Cards = useRef<(HTMLElement | null)[]>([]);
  const s2Positions = useMaskPositions(section2Ref, s2Cards);
  const s2Height = s2Positions[0]?.sh ?? 0;
  const s2ImageWidth = useImageWidth(SECTION2_IMAGE, s2Height);
  const s2Focal = isMobile ? 0.65 : 0.8;
  const s2Reveal = useStaggeredReveal(4);

  const s3Reveal = useStaggeredReveal(4);

  const setSection1Ref = useCallback(
    (el: HTMLElement | null) => {
      section1Ref.current = el;
      s1Reveal.containerRef.current = el;
    },
    [s1Reveal.containerRef],
  );

  const setSection2Ref = useCallback(
    (el: HTMLElement | null) => {
      section2Ref.current = el;
      s2Reveal.containerRef.current = el;
    },
    [s2Reveal.containerRef],
  );

  const setSection3Ref = useCallback(
    (el: HTMLElement | null) => {
      s3Reveal.containerRef.current = el;
    },
    [s3Reveal.containerRef],
  );

  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <Navbar />

      {/* ── SECTION 1 · HERO ── */}
      <section
        ref={setSection1Ref}
        className="relative h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        {featureBars.map((bar, i) => (
          <MaskedCard
            key={bar}
            bgImage={HERO_IMAGE}
            position={s1Positions[i]}
            imageWidth={s1ImageWidth}
            focalX={s1Focal}
            cardRef={(el) => { s1Cards.current[i] = el; }}
            className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
            style={s1Reveal.getAnimStyle(i)}
          >
            <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
              {bar}
            </span>
          </MaskedCard>
        ))}

        <MaskedCard
          bgImage={HERO_IMAGE}
          position={s1Positions[3]}
          imageWidth={s1ImageWidth}
          focalX={s1Focal}
          cardRef={(el) => { s1Cards.current[3] = el; }}
          className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          style={s1Reveal.getAnimStyle(3)}
        >
          <p className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
            Ofrecemos servicios dentales profesionales
            <br />
            con la tecnología más actual
          </p>
          <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
            <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
              Tu dentista de confianza en México
            </span>
            <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
              Cuidado
              <br />
              Dental
            </h1>
          </div>
          <span className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10">
            Valoración sin costo
          </span>
        </MaskedCard>
      </section>

      {/* ── SECTION 2 · SMILE GALLERY ── */}
      <section
        ref={setSection2Ref}
        className="relative min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[0]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => { s2Cards.current[0] = el; }}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
            style={s2Reveal.getAnimStyle(0)}
          >
            <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10">
              Galería de sonrisas
            </h2>
            <p className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">
              Nuestro trabajo de odontología estética
            </p>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[1]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => { s2Cards.current[1] = el; }}
            className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
            style={s2Reveal.getAnimStyle(1)}
          >
            <p className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
              Si quieres una sonrisa espectacular,
              <br />
              llámanos y pregunta por el diseño de sonrisa.
            </p>
            <button className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform">
              Llámanos
            </button>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[2]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => { s2Cards.current[2] = el; }}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
            style={s2Reveal.getAnimStyle(2)}
          >
            <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">
              Diseño de
              <br />
              sonrisa
            </h2>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[3]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => { s2Cards.current[3] = el; }}
            className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
            style={s2Reveal.getAnimStyle(3)}
          >
            <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between ${svc.active ? 'bg-white/90 backdrop-blur-md' : 'bg-white/20 backdrop-blur-xl'}`}
                >
                  <h3
                    className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line ${svc.active ? 'text-black' : 'text-white'}`}
                  >
                    {svc.name}
                  </h3>
                  {svc.num && (
                    <span
                      className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${svc.active ? 'border-black text-black' : 'border-white text-white'}`}
                    >
                      {svc.num}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </MaskedCard>
        </div>
      </section>

      {/* ── SECTION 3 · IMPLANT DENTISTRY ── */}
      <section
        ref={setSection3Ref}
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          {/* Left column */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div
              className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
              style={s3Reveal.getAnimStyle(0)}
            >
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
                Implantes
                <br />
                Dentales
              </h2>
              <p className="text-xs md:text-sm font-semibold text-black">Recupera los dientes que te faltan</p>
            </div>

            <div
              className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0"
              style={s3Reveal.getAnimStyle(1)}
            >
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img src={SECTION3_IMG1} alt="Procedimiento de implante dental" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img src={SECTION3_IMG2} alt="Restauración dental" className="w-full h-full object-cover" />
              </div>
            </div>

            <div
              className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
              style={s3Reveal.getAnimStyle(2)}
            >
              <div>
                <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">Valoración</p>
                <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                  Servicios de
                  <br />
                  restauración
                  <br />
                  dental
                </h3>
              </div>
              <button className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform">
                Agenda en línea
              </button>
            </div>
          </div>

          {/* Right column */}
          <div
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0"
            style={s3Reveal.getAnimStyle(3)}
          >
            <img src={SECTION3_BG} alt="Paciente sonriendo" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
              <div className="flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
                <h4 className="text-lg md:text-2xl font-bold text-black leading-5 md:leading-7">
                  El proceso de
                  <br />
                  colocación de
                  <br />
                  implantes
                </h4>
                <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center">
                  <ArrowIcon />
                </span>
              </div>
              <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
                <h4 className="text-lg md:text-2xl font-bold text-white leading-5 md:leading-7">
                  Cuidado de
                  <br />
                  los implantes
                  <br />
                  dentales
                </h4>
                <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center">
                  <ArrowIcon className="text-white" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
