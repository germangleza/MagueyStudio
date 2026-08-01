import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Globe, Instagram, Twitter } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';

const CARD_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const ICON_STORYBOARD = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85';

const ICON_CRITIQUES = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85';

const ICON_CAPSULE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85';

const CREAM = '#E1E0CC';
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CARD: [number, number, number, number] = [0.22, 1, 0.36, 1];

const navItems = ['Our story', 'Collective', 'Workshops', 'Programs', 'Inquiries'];

const ASME_HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';
const FEATURED_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4';
const PHILOSOPHY_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';
const SERVICE_VIDEO_1 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';
const SERVICE_VIDEO_2 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

/* ───────────── WordsPullUp ───────────── */

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

function WordsPullUp({ text, className = '', showAsterisk = false, style }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block relative"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_OUT }}
          >
            {word}
            {isLast && showAsterisk && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
            {!isLast && ' '}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ───────────── WordsPullUpMultiStyle ───────────── */

interface Segment {
  text: string;
  className?: string;
}

function WordsPullUpMultiStyle({
  segments,
  className = '',
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true });

  const words = segments.flatMap((seg) =>
    seg.text.split(' ').map((word) => ({ word, className: seg.className ?? '' })),
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map(({ word, className: wordClass }, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block ${wordClass}`}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_OUT }}
        >
          {word}
          {i < words.length - 1 && ' '}
        </motion.span>
      ))}
    </div>
  );
}

/* ───────────── AnimatedLetter (reveal ligado al scroll) ───────────── */

function AnimatedLetter({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const charProgress = index / total;
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1],
  );
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

function ScrollRevealParagraph({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const chars = text.split('');

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <AnimatedLetter
          key={i}
          char={char}
          index={i}
          total={chars.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

/* ───────────── Feature cards ───────────── */

interface FeatureItem {
  title: string;
  desc: string;
}

function FeatureCard({
  icon,
  title,
  num,
  items,
}: {
  icon: string;
  title: string;
  num: string;
  items: FeatureItem[];
}) {
  return (
    <div className="bg-[#212121] rounded-2xl p-5 sm:p-6 flex flex-col h-full min-h-[380px]">
      <img src={icon} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover" />
      <h3 className="mt-4 sm:mt-5 text-primary text-lg sm:text-xl font-normal">
        {title} <sup className="text-gray-500 text-xs align-super">{num}</sup>
      </h3>
      <ul className="mt-4 sm:mt-5 flex flex-col gap-3 flex-1">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-gray-400 text-xs sm:text-sm leading-snug">
              <span className="text-primary/90">{item.title}</span> {item.desc}
            </span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="mt-5 inline-flex items-center gap-1.5 text-primary text-sm group w-max"
      >
        Learn more
        <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:rotate-0" />
      </a>
    </div>
  );
}

/* ───────────── Asme · Hero con liquid glass ───────────── */

function AsmeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let fading = false;

    const animateOpacity = (from: number, to: number, dur: number) => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        v.style.opacity = String(from + (to - from) * p);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const onCanPlay = () => {
      v.play().catch(() => {});
      animateOpacity(0, 1, 500);
    };
    const onTimeUpdate = () => {
      if (!fading && v.duration && v.duration - v.currentTime <= 0.55) {
        fading = true;
        animateOpacity(parseFloat(v.style.opacity || '1'), 0, 500);
      }
    };
    const onEnded = () => {
      v.style.opacity = '0';
      setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
        fading = false;
        animateOpacity(0, 1, 500);
      }, 100);
    };

    v.addEventListener('canplay', onCanPlay, { once: true });
    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('ended', onEnded);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <section className="min-h-screen overflow-hidden relative flex flex-col bg-black">
      <video
        ref={videoRef}
        src={ASME_HERO_VIDEO}
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
      />

      {/* Navbar */}
      <div className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Globe className="w-6 h-6" style={{ color: CREAM }} />
            <span className="ml-2 font-semibold text-lg" style={{ color: CREAM }}>Asme</span>
            <div className="hidden md:flex items-center gap-8 ml-8">
              {['Features', 'Pricing', 'About'].map((item) => (
                <a key={item} href="#" className="text-primary/80 hover:text-primary text-sm font-medium transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium" style={{ color: CREAM }}>Sign Up</button>
            <button className="liquid-glass rounded-full px-6 py-2 text-sm font-medium" style={{ color: CREAM }}>
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h2
          className="font-serif text-7xl md:text-8xl lg:text-9xl tracking-tight whitespace-nowrap"
          style={{ color: CREAM }}
        >
          Know it <em className="italic">all</em>.
        </h2>
        <div className="liquid-glass rounded-full max-w-xl w-full mt-8 pl-6 pr-2 py-2 flex items-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent outline-none text-primary placeholder:text-primary/40 text-sm"
          />
          <button className="bg-white rounded-full p-3 text-black shrink-0" aria-label="Subscribe">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-primary/80 text-sm leading-relaxed px-4 mt-6 max-w-md">
          Stay updated with the latest news and insights. Subscribe to our newsletter
          today and never miss out on exciting updates.
        </p>
        <button className="liquid-glass rounded-full px-8 py-3 text-sm font-medium mt-6 hover:bg-white/5 transition-colors" style={{ color: CREAM }}>
          Manifesto
        </button>
      </div>

      {/* Social icons */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        {[Instagram, Twitter, Globe].map((Icon, i) => (
          <button
            key={i}
            className="liquid-glass rounded-full p-4 text-primary/80 hover:text-primary hover:bg-white/5 transition-all"
            aria-label="Social link"
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Asme · About ───────────── */

function AboutSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.p
          className="text-primary/40 text-sm tracking-widest uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.p>
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
          style={{ color: CREAM }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Pioneering <em className="font-serif italic text-primary/60">ideas</em> for
          <br className="hidden md:block" /> minds that{' '}
          <em className="font-serif italic text-primary/60">create, build, and inspire.</em>
        </motion.h2>
      </div>
    </section>
  );
}

/* ───────────── Asme · Featured video ───────────── */

function FeaturedVideoSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <motion.div
        ref={ref}
        className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-video"
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
      >
        <video
          src={FEATURED_VIDEO}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
            <p className="text-primary/50 text-xs tracking-widest uppercase mb-3">Our Approach</p>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: CREAM }}>
              We believe in the power of curiosity-driven exploration. Every project
              starts with a question, and every answer opens a new door to innovation.
            </p>
          </div>
          <motion.button
            className="liquid-glass rounded-full px-8 py-3 text-sm font-medium w-max"
            style={{ color: CREAM }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore more
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────── Asme · Philosophy ───────────── */

function PhilosophySection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl tracking-tight mb-16 md:mb-24"
          style={{ color: CREAM }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Innovation <em className="font-serif italic text-primary/40">x</em> Vision.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            className="rounded-3xl overflow-hidden aspect-[4/3]"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <video
              src={PHILOSOPHY_VIDEO}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div>
              <p className="text-primary/40 text-xs tracking-widest uppercase mb-4">Choose your space</p>
              <p className="text-primary/70 text-base md:text-lg leading-relaxed">
                Every meaningful breakthrough begins at the intersection of disciplined
                strategy and remarkable creative vision. We operate at that crossroads,
                turning bold thinking into tangible outcomes that move people and
                reshape industries.
              </p>
            </div>
            <div className="w-full h-px bg-white/10 my-8" />
            <div>
              <p className="text-primary/40 text-xs tracking-widest uppercase mb-4">Shape the future</p>
              <p className="text-primary/70 text-base md:text-lg leading-relaxed">
                We believe that the best work emerges when curiosity meets conviction.
                Our process is designed to uncover hidden opportunities and translate
                them into experiences that resonate long after the first impression.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Asme · Services ───────────── */

const asmeServices = [
  {
    video: SERVICE_VIDEO_1,
    tag: 'Strategy',
    title: 'Research & Insight',
    desc: 'We dig deep into data, culture, and human behavior to surface the insights that drive meaningful, lasting change.',
  },
  {
    video: SERVICE_VIDEO_2,
    tag: 'Craft',
    title: 'Design & Execution',
    desc: 'From concept to launch, we obsess over every detail to deliver experiences that feel effortless and look extraordinary.',
  },
];

function ServicesSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          className="flex items-end justify-between mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl tracking-tight" style={{ color: CREAM }}>
            What we do
          </h2>
          <p className="hidden md:block text-primary/40 text-sm">Our services</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {asmeServices.map((svc, i) => (
            <motion.div
              key={svc.title}
              className="liquid-glass rounded-3xl overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <div className="relative aspect-video overflow-hidden">
                <video
                  src={svc.video}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="uppercase tracking-widest text-primary/40 text-xs">{svc.tag}</p>
                  <span className="liquid-glass rounded-full p-2">
                    <ArrowUpRight className="w-4 h-4" style={{ color: CREAM }} />
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl mb-3 tracking-tight" style={{ color: CREAM }}>
                  {svc.title}
                </h3>
                <p className="text-primary/50 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═════════════ PORTFOLIO (Michael Smith) ═════════════ */

const MP_HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

function useHlsVideo(src: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  }, [src]);
  return videoRef;
}

/** Pill con anillo de gradiente animado al hover */
function GradientRingButton({
  children,
  href,
  className = '',
  innerClassName = '',
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  innerClassName?: string;
}) {
  const Tag = (href ? 'a' : 'button') as 'a';
  return (
    <Tag href={href} className={`relative group inline-flex rounded-full ${className}`}>
      <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      <span className={`relative rounded-full ${innerClassName}`}>{children}</span>
    </Tag>
  );
}

/* ── Intro (loading adaptado a sección) ── */

const introWords = ['Design', 'Create', 'Inspire'];

function MpIntro({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 2700, 1);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onComplete, 400);
    };
    raf = requestAnimationFrame(tick);
    const wordTimer = setInterval(() => setWordIndex((i) => (i + 1) % introWords.length), 900);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(wordTimer);
    };
  }, [active, onComplete]);

  return (
    <div className="absolute inset-0 z-40 bg-bg flex flex-col justify-between p-6 md:p-10">
      <motion.p
        className="text-xs text-muted uppercase tracking-[0.3em]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Portfolio
      </motion.p>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {introWords[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="self-end text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
        {String(count).padStart(3, '0')}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <div
          className="h-full accent-gradient origin-left"
          style={{ transform: `scaleX(${count / 100})`, boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)' }}
        />
      </div>
    </div>
  );
}

/* ── Hero del portfolio ── */

const mpRoles = ['Creative', 'Fullstack', 'Founder', 'Scholar'];
const mpNavLinks = [
  { label: 'Home', href: '#mp-hero', active: true },
  { label: 'Work', href: '#mp-work', active: false },
  { label: 'Resume', href: '#mp-stats', active: false },
];

function MpHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-20%' });
  const [introDone, setIntroDone] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const videoRef = useHlsVideo(MP_HLS_SRC);
  const onIntroComplete = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    const timer = setInterval(() => setRoleIndex((i) => (i + 1) % mpRoles.length), 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!introDone || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 });
      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        0.3,
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [introDone]);

  return (
    <section ref={sectionRef} id="mp-hero" className="relative min-h-screen overflow-hidden bg-bg flex flex-col">
      {/* Video HLS de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {!introDone && <MpIntro active={inView} onComplete={onIntroComplete} />}

      {/* Navbar píldora */}
      <div className="relative z-30 flex justify-center pt-4 md:pt-6 px-4">
        <div className="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2">
          <span className="relative group w-9 h-9 rounded-full accent-gradient p-[2px] inline-flex transition-transform hover:scale-110">
            <span className="w-full h-full rounded-full bg-bg flex items-center justify-center font-display italic text-[13px] text-text-primary">
              JA
            </span>
          </span>
          <span className="hidden sm:block w-px h-5 bg-stroke mx-1" />
          {mpNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${link.active ? 'text-text-primary bg-stroke/50' : 'text-muted hover:text-text-primary hover:bg-stroke/50'}`}
            >
              {link.label}
            </a>
          ))}
          <span className="hidden sm:block w-px h-5 bg-stroke mx-1" />
          <GradientRingButton
            href="#mp-contact"
            innerClassName="bg-surface backdrop-blur-md text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 text-text-primary inline-flex items-center gap-1"
          >
            Say hi <span aria-hidden="true">↗</span>
          </GradientRingButton>
        </div>
      </div>

      {/* Contenido central */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8" style={{ opacity: introDone ? undefined : 0 }}>
          COLLECTION '26
        </p>
        <h2
          className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6"
          style={{ opacity: introDone ? undefined : 0 }}
        >
          Michael Smith
        </h2>
        <p className="blur-in text-base md:text-lg text-text-primary/90 mb-4" style={{ opacity: introDone ? undefined : 0 }}>
          A{' '}
          <span key={roleIndex} className="font-display italic text-text-primary animate-role-fade-in inline-block">
            {mpRoles[roleIndex]}
          </span>{' '}
          lives in Chicago.
        </p>
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12" style={{ opacity: introDone ? undefined : 0 }}>
          Designing seamless digital interactions by focusing on the unique nuances
          which bring systems to life.
        </p>
        <div className="blur-in inline-flex gap-4" style={{ opacity: introDone ? undefined : 0 }}>
          <a
            href="#mp-work"
            className="relative group rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg font-medium transition-all hover:scale-105 hover:bg-bg hover:text-text-primary"
          >
            <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity -z-10" aria-hidden="true" />
            See Works
          </a>
          <a
            href="#mp-contact"
            className="relative group rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary font-medium transition-all hover:scale-105 hover:border-transparent"
          >
            <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity -z-10" aria-hidden="true" />
            Reach out...
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-8">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">SCROLL</span>
        <span className="relative w-px h-10 bg-stroke overflow-hidden">
          <span className="absolute inset-x-0 h-1/2 bg-text-primary animate-scroll-down" />
        </span>
      </div>
    </section>
  );
}

/* ── Header de sección reutilizable ── */

function MpSectionHeader({
  eyebrow,
  title,
  italicWord,
  subtext,
  buttonLabel,
}: {
  eyebrow: string;
  title: string;
  italicWord: string;
  subtext: string;
  buttonLabel?: string;
}) {
  return (
    <motion.div
      className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">{eyebrow}</span>
        </div>
        <h2 className="text-3xl md:text-5xl text-text-primary mb-3">
          {title} <em className="font-display italic">{italicWord}</em>
        </h2>
        <p className="text-sm md:text-base text-muted max-w-md">{subtext}</p>
      </div>
      {buttonLabel && (
        <GradientRingButton
          href="#"
          className="hidden md:inline-flex"
          innerClassName="bg-surface border border-stroke text-sm px-6 py-3 text-text-primary inline-flex items-center gap-2"
        >
          {buttonLabel} <ArrowRight className="w-4 h-4" />
        </GradientRingButton>
      )}
    </motion.div>
  );
}

/* ── Placeholder visual monocromo-azul (la spec no incluye URLs de imagen) ── */

function MpArt({ seed }: { seed: number }) {
  const angles = [155, 20, 210, 320, 80, 260];
  const angle = angles[seed % angles.length];
  return (
    <div
      className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
      style={{
        background: `linear-gradient(${angle}deg, #1b2531 0%, #0b0d10 55%, #131a22 100%),
          radial-gradient(60% 50% at ${20 + (seed * 23) % 60}% ${25 + (seed * 31) % 50}%, rgba(137,170,204,0.28), transparent 70%)`,
        backgroundBlendMode: 'screen',
      }}
    />
  );
}

/* ── Selected Works ── */

const mpProjects = [
  { title: 'Automotive Motion', span: 'md:col-span-7', aspect: 'aspect-[16/10]' },
  { title: 'Urban Architecture', span: 'md:col-span-5', aspect: 'aspect-[4/3]' },
  { title: 'Human Perspective', span: 'md:col-span-5', aspect: 'aspect-[4/3]' },
  { title: 'Brand Identity', span: 'md:col-span-7', aspect: 'aspect-[16/10]' },
];

function MpWorks() {
  return (
    <section id="mp-work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <MpSectionHeader
          eyebrow="Selected Work"
          title="Featured"
          italicWord="projects"
          subtext="A selection of projects I've worked on, from concept to launch."
          buttonLabel="View all work"
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {mpProjects.map((project, i) => (
            <motion.article
              key={project.title}
              className={`group relative overflow-hidden bg-surface border border-stroke rounded-3xl ${project.span} ${project.aspect}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <MpArt seed={i} />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}
              />
              <div className="absolute inset-0 bg-bg/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="relative inline-flex rounded-full">
                  <span className="absolute -inset-[2px] rounded-full accent-gradient-animated" aria-hidden="true" />
                  <span className="relative bg-text-primary text-bg text-sm rounded-full px-6 py-3">
                    View — <em className="font-display italic">{project.title}</em>
                  </span>
                </span>
              </div>
              <div className="absolute bottom-5 left-6 text-text-primary text-sm group-hover:opacity-0 transition-opacity">
                {project.title}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Journal ── */

const mpJournal = [
  { title: 'Designing calm interfaces in a loud world', read: '6 min read', date: 'Jan 2026' },
  { title: 'What motion design taught me about restraint', read: '4 min read', date: 'Dec 2025' },
  { title: 'Systems thinking for solo builders', read: '8 min read', date: 'Nov 2025' },
  { title: 'Notes on typography at extreme sizes', read: '5 min read', date: 'Oct 2025' },
];

function MpJournal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <MpSectionHeader
          eyebrow="Journal"
          title="Recent"
          italicWord="thoughts"
          subtext="Writing about design, systems and the craft in between."
          buttonLabel="View all"
        />
        <div className="flex flex-col gap-4">
          {mpJournal.map((entry, i) => (
            <motion.a
              key={entry.title}
              href="#"
              className="group flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-3xl sm:rounded-full overflow-hidden border border-stroke">
                <MpArt seed={i + 2} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-text-primary text-sm sm:text-base truncate group-hover:underline underline-offset-4">
                  {entry.title}
                </span>
                <span className="block text-muted text-xs mt-1">{entry.read}</span>
              </span>
              <span className="hidden sm:block text-muted text-xs shrink-0">{entry.date}</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-text-primary shrink-0 mr-2 transition-colors" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Explorations (galería parallax con pin) ── */

function MpExplorations() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const colLeftRef = useRef<HTMLDivElement | null>(null);
  const colRightRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinRef.current,
        pinSpacing: false,
      });
      gsap.to(colLeftRef.current, {
        yPercent: -34,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.to(colRightRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-[300vh] bg-bg">
      {/* Capa central fijada */}
      <div ref={pinRef} className="h-screen flex items-center justify-center z-10">
        <div className="text-center px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Explorations</span>
            <span className="w-8 h-px bg-stroke" />
          </div>
          <h2 className="text-3xl md:text-5xl text-text-primary mb-3">
            Visual <em className="font-display italic">playground</em>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-sm mx-auto mb-8">
            Experiments, sketches and studies that never made it to a case study.
          </p>
          <GradientRingButton
            href="#"
            innerClassName="bg-surface border border-stroke text-sm px-6 py-3 text-text-primary inline-flex items-center gap-2"
          >
            Dribbble <ArrowUpRight className="w-4 h-4" />
          </GradientRingButton>
        </div>
      </div>

      {/* Columnas parallax */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-full grid grid-cols-2 gap-12 md:gap-40">
          <div ref={colLeftRef} className="flex flex-col items-start gap-24 pt-[60vh]">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={`group relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border border-stroke pointer-events-auto ${i % 2 ? '-rotate-2' : 'rotate-2'} transition-transform hover:rotate-0 hover:scale-105`}
                aria-label={`Exploration ${i + 1}`}
              >
                <MpArt seed={i} />
              </button>
            ))}
          </div>
          <div ref={colRightRef} className="flex flex-col items-end gap-24 pt-[110vh]">
            {[3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={`group relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border border-stroke pointer-events-auto ${i % 2 ? 'rotate-2' : '-rotate-2'} transition-transform hover:rotate-0 hover:scale-105`}
                aria-label={`Exploration ${i + 1}`}
              >
                <MpArt seed={i} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[90] bg-bg/90 backdrop-blur-lg flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl aspect-square rounded-3xl overflow-hidden border border-stroke"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <MpArt seed={lightbox} />
              <span className="absolute bottom-5 left-6 text-text-primary text-sm">
                Exploration {String(lightbox + 1).padStart(2, '0')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Stats ── */

const mpStats = [
  { value: '20+', label: 'Years Experience' },
  { value: '95+', label: 'Projects Done' },
  { value: '200%', label: 'Satisfied Clients' },
];

function MpStats() {
  return (
    <section id="mp-stats" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-stroke rounded-3xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-stroke">
          {mpStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-surface/30 p-10 md:p-14 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="text-5xl md:text-6xl font-display text-text-primary mb-2">{stat.value}</div>
              <div className="text-xs text-muted uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact / Footer ── */

const mpSocials = ['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'];

function MpContact() {
  const videoRef = useHlsVideo(MP_HLS_SRC);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const tween = gsap.to(el, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    return () => {
      tween.kill();
    };
  }, []);

  const marqueeText = Array.from({ length: 10 }, () => 'BUILDING THE FUTURE • ').join('');

  return (
    <section id="mp-contact" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="overflow-hidden whitespace-nowrap mb-12 md:mb-16" aria-hidden="true">
          <div ref={marqueeRef} className="inline-block text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/20">
            {marqueeText}
            {marqueeText}
          </div>
        </div>

        <div className="text-center px-6 mb-16 md:mb-24">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-6">Got a project in mind?</p>
          <GradientRingButton
            href="mailto:hello@michaelsmith.com"
            innerClassName="bg-text-primary text-bg text-base md:text-lg px-10 py-4 inline-flex items-center gap-2 font-medium"
          >
            hello@michaelsmith.com <ArrowUpRight className="w-5 h-5" />
          </GradientRingButton>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-wrap items-center justify-between gap-6 border-t border-stroke/60 pt-6">
          <nav className="flex flex-wrap gap-5">
            {mpSocials.map((social) => (
              <a key={social} href="#" className="text-xs text-muted hover:text-text-primary uppercase tracking-[0.15em] transition-colors">
                {social}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available for projects
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── App ───────────── */

export default function App() {
  const featuresGridRef = useRef<HTMLDivElement | null>(null);
  const featuresInView = useInView(featuresGridRef, { once: true, margin: '-100px' });

  const cardAnim = (i: number) => ({
    initial: { opacity: 0, scale: 0.95 },
    animate: featuresInView ? { opacity: 1, scale: 1 } : {},
    transition: { duration: 0.7, delay: i * 0.15, ease: EASE_CARD },
  });

  return (
    <div className="bg-black min-h-screen">
      {/* ── SECTION 1 · HERO ── */}
      <section className="h-screen p-4 md:p-6">
        <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
          <video
            src={HERO_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

          {/* Navbar */}
          <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8">
              <ul className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
                {navItems.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-colors"
                      style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)'; }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 md:pb-8">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 lg:col-span-8">
                <WordsPullUp
                  text="Prisma"
                  showAsterisk
                  className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
                  style={{ color: CREAM }}
                />
              </div>
              <div className="col-span-12 lg:col-span-4 flex flex-col items-start gap-4 sm:gap-6 pb-2 lg:pb-6">
                <motion.p
                  className="text-primary/70 text-xs sm:text-sm md:text-base"
                  style={{ lineHeight: 1.2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
                >
                  Prisma is a worldwide network of visual artists, filmmakers and
                  storytellers bound not by place, status or labels but by passion and
                  hunger to unlock potential through our unique perspectives.
                </motion.p>
                <motion.button
                  className="group inline-flex items-center gap-2 hover:gap-3 bg-primary rounded-full pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 text-black font-medium text-sm sm:text-base transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT }}
                >
                  Join the lab
                  <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowRight className="w-4 h-4" style={{ color: CREAM }} />
                  </span>
                </motion.button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2 · ABOUT ── */}
      <section className="bg-black px-4 md:px-6 py-16 sm:py-20 md:py-28 flex justify-center">
        <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] max-w-6xl w-full text-center px-5 sm:px-10 md:px-16 py-14 sm:py-20 md:py-28">
          <p className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-6 sm:mb-10">
            Visual arts
          </p>
          <WordsPullUpMultiStyle
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]"
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal text-primary' },
              { text: 'a self-taught director.', className: 'italic font-serif text-primary' },
              {
                text: 'I have skills in color grading, visual effects, and narrative design.',
                className: 'font-normal text-primary',
              },
            ]}
          />
          <div className="max-w-2xl mx-auto mt-10 sm:mt-14">
            <ScrollRevealParagraph
              className="text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed"
              text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3 · FEATURES ── */}
      <section className="relative min-h-screen bg-black px-4 md:px-6 py-16 sm:py-20 md:py-28">
        <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-20">
            <WordsPullUpMultiStyle
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-4xl mx-auto"
              segments={[
                {
                  text: 'Studio-grade workflows for visionary creators.',
                  className: 'text-primary',
                },
                {
                  text: 'Built for pure vision. Powered by art.',
                  className: 'text-gray-500',
                },
              ]}
            />
          </div>

          <div
            ref={featuresGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:h-[480px] gap-3 sm:gap-2 md:gap-1"
          >
            {/* Card 1 — video */}
            <motion.div
              {...cardAnim(0)}
              className="relative rounded-2xl overflow-hidden min-h-[380px] lg:min-h-0"
            >
              <video
                src={CARD_VIDEO}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <p
                className="absolute bottom-5 left-5 right-5 text-base sm:text-lg font-normal"
                style={{ color: CREAM }}
              >
                Your creative canvas.
              </p>
            </motion.div>

            {/* Card 2 — Project Storyboard */}
            <motion.div {...cardAnim(1)}>
              <FeatureCard
                icon={ICON_STORYBOARD}
                title="Project Storyboard."
                num="01"
                items={[
                  { title: 'Scene-by-scene planning', desc: 'to map your whole film before the first shot.' },
                  { title: 'Drag-and-drop shot cards', desc: 'to rearrange sequences in seconds.' },
                  { title: 'Real-time collaboration', desc: 'so your crew always sees the latest cut.' },
                  { title: 'Version history', desc: 'to revisit every draft of your story.' },
                ]}
              />
            </motion.div>

            {/* Card 3 — Smart Critiques */}
            <motion.div {...cardAnim(2)}>
              <FeatureCard
                icon={ICON_CRITIQUES}
                title="Smart Critiques."
                num="02"
                items={[
                  { title: 'AI-powered analysis', desc: 'of pacing, color and composition on every upload.' },
                  { title: 'Creative notes', desc: 'from mentors and peers, threaded per frame.' },
                  { title: 'Tool integrations', desc: 'with the editing suites you already use.' },
                ]}
              />
            </motion.div>

            {/* Card 4 — Immersion Capsule */}
            <motion.div {...cardAnim(3)}>
              <FeatureCard
                icon={ICON_CAPSULE}
                title="Immersion Capsule."
                num="03"
                items={[
                  { title: 'Notification silencing', desc: 'for deep, uninterrupted creative sessions.' },
                  { title: 'Ambient soundscapes', desc: 'tuned to the mood of your project.' },
                  { title: 'Schedule syncing', desc: 'that protects your focus blocks automatically.' },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ASME · liquid glass ── */}
      <AsmeHero />
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />

      {/* ── PORTFOLIO · Michael Smith ── */}
      <div className="mp-scope bg-bg text-text-primary">
        <MpHero />
        <MpWorks />
        <MpJournal />
        <MpExplorations />
        <MpStats />
        <MpContact />
      </div>
    </div>
  );
}
