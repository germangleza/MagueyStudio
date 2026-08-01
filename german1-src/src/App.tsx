import { useRef } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';

const CARD_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const ICON_STORYBOARD = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85';

const ICON_CRITIQUES = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85';

const ICON_CAPSULE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85';

const CREAM = '#E1E0CC';
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CARD: [number, number, number, number] = [0.22, 1, 0.36, 1];

const navItems = ['Our story', 'Collective', 'Workshops', 'Programs', 'Inquiries'];

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
    </div>
  );
}
