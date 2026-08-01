import { useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Archive,
  ChevronRight,
  FileText,
  Forward,
  Inbox,
  Menu,
  MoreHorizontal,
  Paperclip,
  Reply,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4';

/* ───────────── Primitives ───────────── */

function AppleLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className} aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="#fff" className={className} aria-hidden="true">
      <path d="M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z" />
    </svg>
  );
}

function AppleButton({ label = 'Download Aura', full = false }: { label?: string; full?: boolean }) {
  return (
    <button
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] ${full ? 'w-full' : ''}`}
    >
      <AppleLogo />
      {label}
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
    </button>
  );
}

function SectionEyebrow({ label, tag }: { label: string; tag?: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 text-sm text-white/70">
      <span className="w-1.5 h-1.5 rounded-full bg-white" />
      {label}
      {tag && (
        <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/50 text-xs">{tag}</span>
      )}
    </div>
  );
}

const gradientStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'url(#c3-noise)',
};

/* ───────────── Navbar ───────────── */

const navLinks = ['Solutions', 'Pricing', 'Blog', 'Documentation', 'Careers'];

function Navbar() {
  return (
    <motion.nav
      className="relative z-10 max-w-6xl mx-auto px-6 h-20 flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <LogoMark />
      <div className="hidden md:flex gap-8">
        {navLinks.map((link, i) => (
          <motion.a
            key={link}
            href="#"
            className="text-white/70 text-sm font-medium hover:text-white transition-colors"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
          >
            {link}
          </motion.a>
        ))}
      </div>
      <div className="hidden md:block">
        <AppleButton />
      </div>
      <button className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 inline-flex items-center justify-center" aria-label="Menu">
        <Menu className="w-5 h-5" />
      </button>
    </motion.nav>
  );
}

/* ───────────── Hero ───────────── */

function Hero() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-28 pb-20 text-center flex flex-col items-center">
      <motion.h1
        className="text-4xl md:text-7xl font-semibold tracking-tight leading-[0.9]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="block">Your email.</span>
        <span className="block animate-shiny" style={gradientStyle}>
          Revitalized
        </span>
      </motion.h1>
      <motion.p
        className="mt-8 text-white/60 max-w-md text-base leading-[1.5]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Aura is the premier inbox platform for the current era. It leverages powerful AI
        to organize, prioritize, and refine your messages into total clarity.
      </motion.p>
      <motion.div
        className="mt-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <AppleButton />
        <span className="text-xs text-white/40">Download for Intel / Apple Silicon</span>
      </motion.div>
    </section>
  );
}

/* ───────────── macOS menu bar ───────────── */

const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

function MenuBar() {
  return (
    <motion.div
      className="relative z-10 h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-white/70">
          <AppleLogo className="w-3.5 h-3.5" />
          <span className="font-bold text-white">Aura</span>
          {menuItems.map((item, i) => (
            <span
              key={item}
              className={`${i > 3 ? 'hidden md:inline' : i > 2 ? 'hidden sm:inline' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-white/70">
          <Search className="w-3.5 h-3.5" />
          <span>Wed May 6 1:09 PM</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────── Inbox mockup ───────────── */

const sidebarItems = [
  { icon: Inbox, label: 'Inbox', count: 12, active: true },
  { icon: Star, label: 'Starred', count: 3, active: false },
  { icon: Send, label: 'Sent', count: null, active: false },
  { icon: FileText, label: 'Drafts', count: 2, active: false },
  { icon: Archive, label: 'Archive', count: null, active: false },
  { icon: Trash2, label: 'Trash', count: null, active: false },
];

const labels = [
  { name: 'Work', color: '#00d2ff' },
  { name: 'Personal', color: '#A4F4FD' },
  { name: 'Travel', color: '#f59e0b' },
  { name: 'Finance', color: '#10b981' },
];

const messages = [
  { name: 'Linear', subject: 'Weekly product digest', preview: 'Your team shipped 23 issues this week...', time: '9:41 AM', unread: true, active: true },
  { name: 'Sophia Chen', subject: 'Re: Q3 roadmap review', preview: 'Thanks for sending the deck over. I had a few thoughts...', time: '8:12 AM', unread: true, active: false },
  { name: 'Figma', subject: 'Marcus commented on your file', preview: 'Love the new direction on the landing hero.', time: 'Yesterday', unread: false, active: false },
  { name: 'Stripe', subject: 'Payout of $12,480.00 sent', preview: 'Your payout is on its way to your bank...', time: 'Yesterday', unread: false, active: false },
  { name: 'Vercel', subject: 'Deployment ready for aura-web', preview: 'Preview is live at aura-web-g3f.vercel.app', time: 'Mon', unread: false, active: false },
  { name: 'GitHub', subject: '[aura/core] PR #482 approved', preview: 'david-lim approved your pull request.', time: 'Mon', unread: false, active: false },
];

function InboxMockup() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Title bar */}
        <div className="relative h-10 flex items-center px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white/50">Aura — Inbox</span>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-12 h-[520px] min-w-[860px]">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-white/10 bg-black/30 p-4 flex flex-col gap-4">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2">
                <Sparkles className="w-3.5 h-3.5" />
                Compose with Aura
              </button>
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs ${item.active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span className="flex-1">{item.label}</span>
                    {item.count !== null && <span className="text-white/40">{item.count}</span>}
                  </a>
                ))}
              </nav>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 px-2.5">Labels</p>
                <div className="flex flex-col gap-1">
                  {labels.map((label) => (
                    <a key={label.name} href="#" className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/5">
                      <span className="w-2 h-2 rounded-full" style={{ background: label.color }} />
                      {label.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Message list */}
            <div className="col-span-4 border-r border-white/10 flex flex-col">
              <div className="flex items-center gap-2 px-4 h-11 border-b border-white/10 text-xs text-white/40">
                <Search className="w-3.5 h-3.5" />
                Search mail
              </div>
              <div className="flex-1 overflow-hidden">
                {messages.map((msg) => (
                  <button
                    key={msg.subject}
                    className={`w-full text-left px-4 py-3 border-b border-white/5 ${msg.active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs ${msg.unread ? 'font-semibold text-white' : 'text-white/70'}`}>
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-white/40 shrink-0">{msg.time}</span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${msg.unread ? 'text-white/90 font-medium' : 'text-white/60'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5 truncate">{msg.preview}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Reader */}
            <div className="col-span-5 flex flex-col">
              <div className="flex items-center justify-between px-4 h-11 border-b border-white/10">
                <div className="flex items-center gap-1">
                  {[Reply, Forward, Archive, Trash2].map((Icon, i) => (
                    <button key={i} className="w-7 h-7 rounded-md hover:bg-white/5 inline-flex items-center justify-center text-white/60">
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
                <button className="w-7 h-7 rounded-md hover:bg-white/5 inline-flex items-center justify-center text-white/60">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-5">
                <h3 className="text-base font-semibold">Weekly product digest</h3>
                <div className="flex items-center gap-2.5 mt-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] inline-flex items-center justify-center text-[11px] font-bold">
                    L
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">Linear</p>
                    <p className="text-[11px] text-white/40">to me · 9:41 AM</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/60">Work</span>
                </div>

                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#A4F4FD' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Summary by Aura
                  </div>
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                    Your team closed 23 issues, merged 14 PRs, and shipped 2 features. Top
                    contributor: Marcus. No action needed.
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3 text-xs text-white/70 leading-relaxed">
                  <p>Hi team,</p>
                  <p>
                    Here is your weekly digest of everything happening across your projects.
                    This was a strong week with significant progress on the Q3 roadmap.
                  </p>
                  <p>
                    Twenty-three issues were closed, fourteen pull requests were merged, and
                    two customer-facing features went out. The velocity trend continues to
                    climb.
                  </p>
                  <p>Let me know if you would like a deeper breakdown by project or contributor.</p>
                  <p className="text-white/50">— The Linear team</p>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                  <Paperclip className="w-3.5 h-3.5" />
                  digest-may-6.pdf
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────── FeatureTriage ───────────── */

const triageChips = ['Auto-categorize', 'Snooze for later', 'Silent newsletters', 'One-tap unsubscribe'];

const triageGroups = [
  { name: 'Priority', count: 4, color: '#ffffff', items: ['Sophia Chen — Q3 review', 'David Lim — contract signoff'] },
  { name: 'Follow-up', count: 7, color: '#e5e5e5', items: ['Marcus — design review', 'Figma — comment thread'] },
  { name: 'Updates', count: 18, color: '#a3a3a3', items: ['Vercel — deploy ready', 'GitHub — PR #482 merged'] },
  { name: 'Archived', count: 13, color: '#525252', items: ['Stripe payout · Newsletter · Receipts'] },
];

function FeatureTriage() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <SectionEyebrow label="Triage" tag="AI-native" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Clear your inbox
            <br />
            in a single pass.
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            Aura reads every message, understands intent, and routes the noise away from
            the signal. Focus on what moves your day forward — the rest handles itself.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {triageChips.map((chip) => (
              <span key={chip} className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="liquid-glass rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-xs text-white/50 mb-4">Today · 42 messages triaged</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {triageGroups.map((group) => (
              <div key={group.name} className="liquid-glass rounded-lg p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold" style={{ color: group.color }}>
                    {group.name}
                  </span>
                  <span className="text-[10px] text-white/40">{group.count}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <p key={item} className="text-[11px] text-white/60 truncate">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── LogoCloud ───────────── */

const logos = ['Linear', 'Vercel', 'Figma', 'Stripe', 'Ramp', 'Notion', 'Loom', 'Arc'];

function LogoCloud() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-20">
      <p className="text-center text-xs uppercase tracking-widest text-white/40">
        Trusted by the world's most thoughtful teams
      </p>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
        {logos.map((logo, i) => (
          <motion.span
            key={logo}
            className="text-center text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors cursor-default"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            {logo}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Testimonials ───────────── */

const testimonials = [
  {
    quote: 'Aura gave our leadership team four hours of their week back. It reads like email from the future.',
    name: 'Parker Wilf',
    role: 'Group Product Manager',
    company: 'MERCURY',
  },
  {
    quote: "The command palette alone has changed how I process messages. I can't imagine going back to a traditional client.",
    name: 'Andrew von Rosenbach',
    role: 'Senior Engineering Program Manager',
    company: 'COHERE',
  },
  {
    quote: 'Triage that actually understands context. Our team stopped dreading Monday morning inboxes.',
    name: 'Mathies Christensen',
    role: 'Engineering Manager',
    company: 'LUNAR',
  },
];

function Testimonials() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            className="liquid-glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <blockquote className="text-sm text-white/80 leading-[1.6]">"{t.quote}"</blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-white/50">{t.role}</p>
              <p className="text-xs text-white font-semibold tracking-wide mt-1">{t.company}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Pricing ───────────── */

interface Plan {
  tier: string;
  monthly: string;
  yearly: string;
  desc: string;
  features: string[];
  pro?: boolean;
}

const plans: Plan[] = [
  {
    tier: 'Free',
    monthly: 'Free',
    yearly: 'Free',
    desc: 'For creators taking their first steps with Forma.',
    features: [
      'Up to 3 projects in the cloud',
      'Image export up to 1080p',
      'Basic editing tools',
      'Free templates and icons',
      'Access via web and mobile app',
    ],
  },
  {
    tier: 'Standard',
    monthly: '$9,99/m',
    yearly: '$99,99/y',
    desc: 'For freelancers and small teams who need more freedom and flexibility.',
    features: [
      'Up to 50 projects in the cloud',
      'Export up to 4K',
      'Advanced editing toolkit',
      'Team collaboration (up to 5 members)',
      'Access to premium template library',
    ],
  },
  {
    tier: 'Pro',
    monthly: '$19,99/m',
    yearly: '$199,99/y',
    desc: 'For studios, agencies, and professional creators working with brands.',
    features: [
      'Unlimited projects',
      'Export up to 8K + animations',
      'AI-powered content generation tools',
      'Unlimited team members',
      'Brand customization',
    ],
    pro: true,
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="c3-pricing-section relative z-10">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.075" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
        </filter>
      </svg>

      <div className="c3-watermark-container">
        <div className="c3-watermark-main">
          <span className="c3-watermark-line-1">Your email.</span>
          <span className="c3-watermark-line-2">Revitalized</span>
        </div>
      </div>

      <div className="c3-grid">
        {plans.map((plan) => (
          <div key={plan.tier} className={`c3-card ${plan.pro ? 'c3-card-pro' : ''}`}>
            <span className="c3-tier-small">{plan.tier}</span>
            <span className="c3-tier-large">{yearly ? plan.yearly : plan.monthly}</span>
            <p className="c3-desc">{plan.desc}</p>
            <ul className="c3-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className="c3-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="c3-btn">Choose Plan</button>
          </div>
        ))}
      </div>

      <div className="c3-toggle-wrap">
        <span className="text-sm text-white/70">Yearly</span>
        <button
          className={`c3-toggle ${yearly ? 'active' : ''}`}
          onClick={() => setYearly((y) => !y)}
          aria-pressed={yearly}
          aria-label="Toggle yearly pricing"
        >
          <span className="c3-toggle-knob" />
        </button>
      </div>
    </section>
  );
}

/* ───────────── FinalCTA ───────────── */

function FinalCTA() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
      <motion.div
        className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)',
            opacity: 0.3,
          }}
        />
        <h2 className="relative text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
          Close the tabs.
          <br />
          Open your day.
        </h2>
        <p className="relative mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
          Join thousands of builders, founders, and operators who treat email like a tool
          — not an obligation.
        </p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <AppleButton label="Download Aura" />
          <button className="group inline-flex items-center gap-2 rounded-full border border-white/15 text-white text-sm font-medium px-5 py-3 hover:bg-white/5 transition-colors">
            Talk to sales
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────── App ───────────── */

function RootNoiseFilter(): ReactNode {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="c3-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        <feComposite in2="SourceGraphic" operator="in" result="noise" />
        <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
      </filter>
    </svg>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white font-sans">
      {/* Video de fondo global */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
          src={BG_VIDEO}
        />
      </div>

      {/* Guías verticales */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      <RootNoiseFilter />

      <Navbar />
      <Hero />
      <MenuBar />
      <InboxMockup />
      <FeatureTriage />
      <LogoCloud />
      <Testimonials />
      <Pricing />
      <FinalCTA />
    </div>
  );
}
