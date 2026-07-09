import { useState, useEffect } from "react";
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage, googleProvider, githubProvider } from "./firebase";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Play,
  Bell,
  Mail,
  Square,
  Move,
  CheckCircle2,
  Layers,
  Plus,
  Clock,
  Wallet,
  UserCheck,
  TrendingUp,
  Lock,
  ShieldCheck,
  FileCheck,
  Building2,
  Handshake,
  Users,
  Banknote,
  CalendarCheck,
  MessageSquare,
  Sun,
  Moon,
  User,
  LogOut,
  ArrowLeft,
  Phone,
  Loader2,
  Camera,
  FileText,
  Globe,
  Briefcase,
  Trash2,
  Download,
  BellOff,
  Star,
  Save,
  X,
  AlertTriangle,
  Upload,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Base surface theme (white vs black), independent of the User/Client accent.
// ---------------------------------------------------------------------------
const THEME = {
  dark: {
    pageBg: "bg-neutral-950",
    pageText: "text-white",
    cardBg: "bg-neutral-900",
    cardBorder: "border-neutral-800",
    innerBg: "bg-neutral-800",
    innerBg2: "bg-neutral-700",
    textPrimary: "text-white",
    textMuted: "text-neutral-400",
    textMuted2: "text-neutral-500",
    textMuted3: "text-neutral-600",
    btnPrimary: "bg-white text-black hover:bg-neutral-200",
    btnSecondary: "bg-neutral-800 text-white hover:bg-neutral-700",
    btnOutline: "border-neutral-700 hover:bg-neutral-900",
    toggleTrack: "bg-neutral-900 border-neutral-800",
    toggleInactive: "text-neutral-400 hover:text-white",
    navLink: "text-neutral-300 hover:text-white",
    iconMuted: "text-neutral-500 hover:text-white",
  },
  light: {
    pageBg: "bg-white",
    pageText: "text-neutral-900",
    cardBg: "bg-neutral-50",
    cardBorder: "border-neutral-200",
    innerBg: "bg-neutral-100",
    innerBg2: "bg-neutral-200",
    textPrimary: "text-neutral-900",
    textMuted: "text-neutral-600",
    textMuted2: "text-neutral-500",
    textMuted3: "text-neutral-400",
    btnPrimary: "bg-neutral-900 text-white hover:bg-neutral-700",
    btnSecondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
    btnOutline: "border-neutral-300 hover:bg-neutral-100",
    toggleTrack: "bg-neutral-100 border-neutral-200",
    toggleInactive: "text-neutral-500 hover:text-neutral-900",
    navLink: "text-neutral-600 hover:text-neutral-900",
    iconMuted: "text-neutral-400 hover:text-neutral-900",
  },
};

// ---------------------------------------------------------------------------
// Mode-based accent config, nested per surface theme so the green/red accents
// stay legible on both a white and a black background. Kept intentionally
// subtle: only borders and the annotation texture pick up color.
// ---------------------------------------------------------------------------
const ACCENTS = {
  dark: {
    user: {
      border: "border-emerald-900/40",
      iconBorder: "border-emerald-800/50",
      navBorder: "border-emerald-500/10",
      navBg: "bg-emerald-500/10",
      textureColor: "#10b981",
      text: "text-emerald-400",
      toggleActive: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
      switchOn: "bg-emerald-500",
    },
    client: {
      border: "border-rose-900/40",
      iconBorder: "border-rose-800/50",
      navBorder: "border-rose-500/10",
      navBg: "bg-rose-500/10",
      textureColor: "#f43f5e",
      text: "text-rose-400",
      toggleActive: "bg-rose-500/15 text-rose-400 border-rose-500/40",
      switchOn: "bg-rose-500",
    },
  },
  light: {
    user: {
      border: "border-emerald-300",
      iconBorder: "border-emerald-300",
      navBorder: "border-emerald-500/10",
      navBg: "bg-emerald-500/10",
      textureColor: "#059669",
      text: "text-emerald-600",
      toggleActive: "bg-emerald-50 text-emerald-700 border-emerald-300",
      switchOn: "bg-emerald-600",
    },
    client: {
      border: "border-rose-300",
      iconBorder: "border-rose-300",
      navBorder: "border-rose-500/10",
      navBg: "bg-rose-500/10",
      textureColor: "#e11d48",
      text: "text-rose-600",
      toggleActive: "bg-rose-50 text-rose-700 border-rose-300",
      switchOn: "bg-rose-600",
    },
  },
};

// ---------------------------------------------------------------------------
// Per-mode content. Client = enterprises buying labeling services.
// User = the contributor/annotator workforce earning money on the platform.
// ---------------------------------------------------------------------------
const CONTENT = {
  client: {
    navLinks: ["Solutions", "Pricing", "Blog", "Company"],
    navCta: "Contact Sales",
    hero: {
      title: ["Enterprise Data Labeling", "for Modern AI."],
      subtitle:
        "Transform raw data into high-quality training sets for complex machine learning models. Built for enterprise AI teams.",
      cta: "Explore Platform",
    },
    commitments: {
      heading: "Why work with a new platform",
      subtext: "We're an early-stage team — here's what we commit to instead of a track record.",
      items: [
        {
          icon: Handshake,
          title: "Pilot Before You Commit",
          desc: "Start with a small paid pilot batch before any long-term agreement — see the quality firsthand.",
        },
        {
          icon: Users,
          title: "Direct Access to the Team",
          desc: "You work directly with the people building the platform, not a support queue.",
        },
        {
          icon: FileCheck,
          title: "NDA on Every Project",
          desc: "Every annotator signs a confidentiality agreement before touching your data, even on trial work.",
        },
        {
          icon: Banknote,
          title: "Usage-Based Pricing",
          desc: "Pay only for what you label — no platform fees, no long-term lock-in.",
        },
      ],
    },
    features: [
      {
        icon: Check,
        title: "Labeling",
        desc: "Simple outline annotation with the 2px strokes and rounded edges.",
        cta: "Get a Demo",
        filled: true,
      },
      {
        icon: Move,
        title: "Annotation Types",
        desc: "Image, text, audio, video and multimodal annotation in one workspace.",
        cta: "Annotation Types",
        filled: false,
      },
      {
        icon: CheckCircle2,
        title: "Quality Assurance",
        desc: "Consensus scoring and dedicated QA leads on every enterprise project.",
        cta: "View Metrics",
        filled: false,
      },
      {
        icon: Layers,
        title: "Premium Annotation",
        desc: "Advanced, high-quality labeling services and tools.",
        cta: "Explore Tiers",
        filled: true,
      },
    ],
    steps: [
      {
        title: "Define your taxonomy",
        desc: "Set annotation guidelines, label schemas, and quality thresholds tailored to your model.",
      },
      {
        title: "Get matched with experts",
        desc: "We route your project to vetted specialists with the right domain expertise.",
      },
      {
        title: "Review at scale",
        desc: "Track throughput and accuracy in real time with built-in QA and consensus scoring.",
      },
      {
        title: "Export & integrate",
        desc: "Pull labeled data directly into your pipeline via API, SDK, or bulk export.",
      },
    ],
    dashboard: {
      heading: "See the platform your team gets access to",
      subtext:
        "Manage taxonomies, review annotations, and monitor quality — all from one workspace.",
    },
    extra: {
      type: "security",
      heading: "Built for enterprise trust",
      subtext: "Security and compliance baked into every project.",
      items: [
        {
          icon: Lock,
          title: "SOC 2 Type II",
          desc: "Independently audited controls for data security and availability.",
        },
        {
          icon: ShieldCheck,
          title: "Data Privacy by Design",
          desc: "Encryption at rest and in transit, with configurable retention policies.",
        },
        {
          icon: FileCheck,
          title: "NDA-backed Workforce",
          desc: "Every annotator signs enforceable confidentiality agreements before access.",
        },
        {
          icon: Building2,
          title: "Dedicated Infrastructure",
          desc: "Isolated environments available for regulated or sensitive workloads.",
        },
      ],
    },
    faq: [
      {
        q: "What types of data can Taxon label?",
        a: "Image, text, audio, video, and multimodal data — including bounding boxes, segmentation, transcription, and RLHF preference ranking.",
      },
      {
        q: "How fast can a project start?",
        a: "Most projects begin within 48 hours of taxonomy approval, with pilot batches often ready the same week.",
      },
      {
        q: "What quality guarantees do you offer?",
        a: "We back every project with a quality SLA, consensus-based review, and dedicated QA leads for enterprise accounts.",
      },
      {
        q: "Can we bring our own annotation tool?",
        a: "Yes. Taxon integrates via API, or your team can use our native annotation workspace out of the box.",
      },
    ],
    cta: {
      title: ["Ready to scale your", "AI development?"],
      primary: "Get a Demo",
      secondary: "Read Documentation",
    },
  },

  user: {
    navLinks: ["How it Works", "Earnings", "Community", "Resources"],
    navCta: "Apply Now",
    hero: {
      title: ["Get Paid to Help", "Build Better AI."],
      subtitle:
        "Join a global network of vetted experts labeling, reviewing, and evaluating data for the world's leading AI labs — on your schedule.",
      cta: "Apply as an Expert",
    },
    commitments: {
      heading: "What we promise from day one",
      subtext: "We're a brand-new platform — these are commitments, not stats we're claiming.",
      items: [
        {
          icon: Banknote,
          title: "Every Task Is Paid",
          desc: "No unpaid trial tasks or onboarding busywork — you're paid from your very first task.",
        },
        {
          icon: CalendarCheck,
          title: "Weekly Payouts, On Time",
          desc: "Get paid every week for completed work, with no delays.",
        },
        {
          icon: MessageSquare,
          title: "Direct Feedback Loop",
          desc: "Talk directly with the team building the platform — your feedback shapes how tasks are designed.",
        },
        {
          icon: Clock,
          title: "Work On Your Terms",
          desc: "No fixed hours or quotas. Pick up tasks whenever it fits your schedule.",
        },
      ],
    },
    features: [
      {
        icon: Clock,
        title: "Flexible Hours",
        desc: "Work whenever it suits you — no minimum hours, no fixed shifts.",
        cta: "See Open Tasks",
        filled: true,
      },
      {
        icon: Wallet,
        title: "Transparent Pay",
        desc: "Know your rate before you start. Get paid weekly, with no hidden deductions.",
        cta: "View Pay Rates",
        filled: false,
      },
      {
        icon: UserCheck,
        title: "Skill-Matched Work",
        desc: "Tasks matched to your background, from general labeling to specialist review.",
        cta: "Take Skills Test",
        filled: false,
      },
      {
        icon: TrendingUp,
        title: "Grow Your Rate",
        desc: "Build a track record and unlock higher-paying, specialized projects over time.",
        cta: "Learn More",
        filled: true,
      },
    ],
    steps: [
      {
        title: "Apply in minutes",
        desc: "Tell us about your background and areas of expertise.",
      },
      {
        title: "Get vetted",
        desc: "Complete a short skills assessment matched to your domain.",
      },
      {
        title: "Start working",
        desc: "Pick up available tasks that fit your schedule and expertise.",
      },
      {
        title: "Get paid weekly",
        desc: "Track your earnings in real time and cash out every week.",
      },
    ],
    dashboard: {
      heading: "This is where you'll do the work",
      subtext:
        "A guided workspace with clear instructions, examples, and instant feedback on every task.",
    },
    extra: {
      type: "earnings",
      heading: "Transparent, tiered pay",
      subtext: "Rates scale with the skill and judgment each task requires.",
      tiers: [
        {
          title: "General Labeling",
          rate: "$12–18/hr",
          desc: "Image tagging, transcription, basic classification.",
        },
        {
          title: "Specialist Review",
          rate: "$25–45/hr",
          desc: "Domain-specific annotation, RLHF ranking, quality review.",
        },
        {
          title: "Expert Evaluation",
          rate: "$50–120/hr",
          desc: "Professional judgment tasks for medical, legal, and technical domains.",
        },
      ],
      note: "Paid weekly via direct deposit or PayPal. No minimum payout threshold.",
    },
    faq: [
      {
        q: "Do I need experience to start?",
        a: "No prior annotation experience is required for general tasks. Specialist and expert tiers may require relevant credentials.",
      },
      {
        q: "How and when do I get paid?",
        a: "Payments are issued weekly via direct deposit or PayPal, with no minimum payout threshold.",
      },
      {
        q: "How many hours do I need to work?",
        a: "There's no minimum. Pick up tasks whenever you're available — it's entirely self-paced.",
      },
      {
        q: "What equipment do I need?",
        a: "A reliable computer and internet connection. Some specialist tasks may require a webcam for verification.",
      },
    ],
    cta: {
      title: ["Ready to put your", "expertise to work?"],
      primary: "Apply Now",
      secondary: "See Open Roles",
    },
  },
};

function AnnotationBackground({ color = "#ffffff" }) {
  // Bounding-box + tag motifs, echoing a data-labeling canvas instead of a generic network graph.
  const boxes = [
    { x: 55, y: 45, w: 130, h: 95 },
    { x: 555, y: 35, w: 160, h: 115 },
    { x: 35, y: 255, w: 105, h: 85 },
    { x: 615, y: 245, w: 135, h: 100 },
    { x: 300, y: 300, w: 95, h: 70 },
  ];
  const tags = [
    { x: 75, y: 155 },
    { x: 575, y: 165 },
    { x: 315, y: 385 },
    { x: 660, y: 200 },
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none transition-colors duration-500"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
    >
      {boxes.map((b, i) => (
        <g key={`box-${i}`}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="6"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
          {[
            [b.x, b.y],
            [b.x + b.w, b.y],
            [b.x, b.y + b.h],
            [b.x + b.w, b.y + b.h],
          ].map(([cx, cy], j) => (
            <rect key={j} x={cx - 3} y={cy - 3} width="6" height="6" fill={color} />
          ))}
        </g>
      ))}
      {tags.map((t, i) => (
        <g key={`tag-${i}`}>
          <rect x={t.x} y={t.y} width="60" height="18" rx="9" fill={color} />
          <circle cx={t.x + 11} cy={t.y + 9} r="3" fill="#0a0a0a" />
        </g>
      ))}
    </svg>
  );
}

// Lucide v1.0 removed all brand icons (GitHub, Twitter, LinkedIn, etc.) for
// trademark reasons, so these are small inline replacements in the same
// stroke style — no dependency on a brand-icon package.
function GithubIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.42-.22-2.05H12v3.72h6.6c-.13 1.1-.86 2.76-2.47 3.87l-.02.15 3.59 2.78.25.02c2.28-2.1 3.57-5.18 3.57-8.49z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.78-2.93c-1.02.7-2.4 1.19-4.16 1.19-3.18 0-5.88-2.1-6.84-5h-3.9v3.02C3.3 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.16 14.37a7.2 7.2 0 0 1-.38-2.37c0-.82.14-1.62.37-2.37V6.6H1.24A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.24 5.4l3.92-3.03z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.31.61 4.54 1.79l3.4-3.4C17.94 1.19 15.23 0 12 0 7.31 0 3.3 2.7 1.24 6.6l3.92 3.03c.96-2.9 3.66-4.88 6.84-4.88z"
      />
    </svg>
  );
}

function AccountMenu({ user, theme, onOpenAuth, onOpenAccount, onSignOut }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${theme.cardBorder} ${theme.btnSecondary}`}
      >
        <User className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-lg p-2 z-50 ${theme.cardBg} ${theme.cardBorder}`}
          >
            {user ? (
              <>
                <div className={`px-3 py-2 text-xs ${theme.textMuted}`}>
                  Signed in as
                  <div className={`text-sm font-medium truncate ${theme.textPrimary}`}>
                    {user.phoneNumber || user.email || "Account"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenAccount();
                    setOpen(false);
                  }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${theme.iconMuted}`}
                >
                  Manage Account
                </button>
                <button
                  onClick={() => {
                    onSignOut();
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg transition-colors ${theme.iconMuted}`}
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth("signin");
                    setOpen(false);
                  }}
                  className={`w-full text-left text-sm font-medium px-3 py-2 rounded-lg transition-colors ${theme.btnPrimary}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth("signup");
                    setOpen(false);
                  }}
                  className={`w-full text-left text-sm px-3 py-2 mt-1 rounded-lg transition-colors ${theme.iconMuted}`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Real Firebase Auth flow: Google/GitHub OAuth via popup, then phone number
// verified with an SMS OTP (invisible reCAPTCHA required by Firebase for
// phone auth — see the #recaptcha-container div below).
const firebaseConfig = {
  apiKey: "AIzaSyAzoeRpHxYzq0Xpy9KVnXvsftktIsvNgx8",
  authDomain: "atonate-d89cf.firebaseapp.com",
  projectId: "atonate-d89cf",
  storageBucket: "atonate-d89cf.firebasestorage.app",
  messagingSenderId: "1001795101272",
  appId: "1:1001795101272:web:54c5b701d783049d7a602d",
  measurementId: "G-WFRCDKWLRM"
};

function AuthPage({ theme, mainLogo, onBack, onComplete }) {
  const [step, setStep] = useState("oauth"); // oauth | phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const handleOAuth = async (provider) => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      // OAuth alone doesn't give us a phone number, so still collect + verify one.
      setStep("phone");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  const getRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.trim().length < 7) {
      setError("Enter a valid phone number.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const appVerifier = getRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone.trim(), appVerifier);
      setConfirmation(result);
      setStep("otp");
    } catch (err) {
      // A failed attempt (rate limit, bad number, etc.) leaves the cached
      // reCAPTCHA token stale — reusing it on retry throws
      // auth/invalid-app-credential even once the underlying issue is fixed.
      // Clear it so the next attempt renders a fresh widget/token.
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError("");
    try {
      const result = await confirmation.confirm(otp.trim());
      // Pass the real Firebase user (has uid, displayName, photoURL, etc.),
      // not a placeholder — the account page can't load a profile without
      // a real uid, and a fake object here silently breaks it.
      onComplete(result.user || auth.currentUser);
    } catch (err) {
      setError("That code didn't match. Try again.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme.pageBg} ${theme.pageText}`}>
      {/* Required by Firebase for invisible phone-auth reCAPTCHA — stays empty/invisible. */}
      <div id="recaptcha-container" />
      <div className="px-8 py-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-sm transition-colors ${theme.navLink}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </button>
        <img src={mainLogo} alt="Taxon AI" className="h-7 w-7 object-contain" />
      </div>

      <div className="flex-1 flex items-center justify-center px-8 pb-16">
        <div className={`w-full max-w-sm border rounded-2xl p-8 transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}>
          {step === "oauth" && (
            <>
              <h1 className="text-xl font-bold mb-1">Welcome to Taxon</h1>
              <p className={`text-sm mb-6 ${theme.textMuted}`}>
                Sign in or create an account to continue.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleOAuth(googleProvider)}
                  className={`w-full flex items-center justify-center gap-2 border rounded-full py-2.5 text-sm font-medium transition-colors ${theme.cardBorder} ${theme.iconMuted}`}
                >
                  <GoogleIcon className="w-4 h-4" /> Continue with Google
                </button>
                <button
                  onClick={() => handleOAuth(githubProvider)}
                  className={`w-full flex items-center justify-center gap-2 border rounded-full py-2.5 text-sm font-medium transition-colors ${theme.cardBorder} ${theme.iconMuted}`}
                >
                  <GithubIcon className="w-4 h-4" /> Continue with GitHub
                </button>
              </div>
              <div className={`flex items-center gap-3 my-6 text-xs ${theme.textMuted2}`}>
                <div className={`flex-1 border-t ${theme.cardBorder}`} />
                or
                <div className={`flex-1 border-t ${theme.cardBorder}`} />
              </div>
              <button
                onClick={() => setStep("phone")}
                className={`w-full text-sm font-medium py-2.5 rounded-full transition-colors ${theme.btnPrimary}`}
              >
                Continue with phone number
              </button>
            </>
          )}

          {step === "phone" && (
            <form onSubmit={handleSendOtp}>
              <h1 className="text-xl font-bold mb-1">Verify your phone</h1>
              <p className={`text-sm mb-6 ${theme.textMuted}`}>
                We'll text you a 6-digit code to confirm it's you.
              </p>
              <label className={`text-xs font-medium ${theme.textMuted}`}>Phone number</label>
              <div className={`mt-1.5 flex items-center gap-2 border rounded-full px-4 py-2.5 ${theme.cardBorder}`}>
                <Phone className={`w-4 h-4 shrink-0 ${theme.textMuted2}`} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`flex-1 bg-transparent outline-none text-sm min-w-0 ${theme.textPrimary}`}
                />
              </div>
              {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className={`w-full mt-5 text-sm font-medium py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 ${theme.btnPrimary}`}
              >
                {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                {sending ? "Sending code..." : "Send code"}
              </button>
              <button
                type="button"
                onClick={() => setStep("oauth")}
                className={`w-full mt-3 text-xs transition-colors ${theme.navLink}`}
              >
                Back
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <h1 className="text-xl font-bold mb-1">Enter the code</h1>
              <p className={`text-sm mb-6 ${theme.textMuted}`}>
                We sent a 6-digit code to {phone}.
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className={`w-full text-center tracking-[0.5em] text-lg border rounded-full px-4 py-3 outline-none bg-transparent transition-colors ${theme.cardBorder} ${theme.textPrimary}`}
              />
              {error && <p className="text-xs text-rose-500 mt-2 text-center">{error}</p>}
              <button
                type="submit"
                className={`w-full mt-5 text-sm font-medium py-2.5 rounded-full transition-colors ${theme.btnPrimary}`}
              >
                Verify & continue
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className={`w-full mt-3 text-xs transition-colors ${theme.navLink}`}
              >
                Use a different number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const VISA_OPTIONS = [
  "U.S. Citizen",
  "Permanent Resident (Green Card)",
  "H-1B",
  "OPT / STEM OPT",
  "TN Visa",
  "Other work visa",
  "Not authorized to work in the U.S.",
  "Outside the U.S. — no visa needed",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyProfile = {
  displayName: "",
  citizenship: "",
  visaStatus: "",
  workAuthExpiry: "",
  jobTitle: "",
  yearsExperience: "",
  skills: "",
  photoUrl: "",
  resumeUrl: "",
  resumeFileName: "",
  availabilityHours: "",
  timezone: "",
  availableDays: [],
  rating: null,
  minPay: "",
  notifyEmail: true,
  notifySms: true,
  notifyProjectDigest: true,
  notificationsPaused: false,
  mutedProjects: [],
};

function Section({ theme, icon: Icon, title, children }) {
  return (
    <div className={`border rounded-2xl p-6 transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}>
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, theme, children }) {
  return (
    <div>
      <label className={`text-xs font-medium block mb-1.5 ${theme.textMuted}`}>{label}</label>
      {children}
    </div>
  );
}

function fieldClass(theme) {
  return `w-full border rounded-lg px-3 py-2 text-sm bg-transparent outline-none transition-colors ${theme.cardBorder} ${theme.textPrimary}`;
}

function Toggle({ checked, onChange, theme, accent }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${
        checked ? accent.switchOn : theme.innerBg
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ToggleRow({ label, desc, checked, onChange, theme, accent }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className={`text-xs mt-0.5 ${theme.textMuted}`}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} theme={theme} accent={accent} />
    </div>
  );
}

function ratingLabel(rating) {
  if (rating === null || rating === undefined) return null;
  if (rating >= 90) return "A+";
  if (rating >= 80) return "A";
  if (rating >= 70) return "B+";
  if (rating >= 60) return "B";
  return "C";
}

// Full account management page for the User (annotator/contributor) role.
// Reads/writes Firestore doc `profiles/{uid}` and uploads photo + resume to
// Firebase Storage under `avatars/{uid}` and `resumes/{uid}`.
function AccountPage({ theme, accent, mainLogo, firebaseUser, onBack, onSignedOut }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [newMutedProject, setNewMutedProject] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const uid = firebaseUser?.uid;

  useEffect(() => {
    if (!uid) {
      // No real uid means we were handed an incomplete user object — fail
      // loudly instead of spinning forever so this is easy to diagnose.
      console.error("AccountPage mounted without a uid. firebaseUser was:", firebaseUser);
      setMessage({
        type: "error",
        text: "No signed-in user was found (missing uid). Try signing out and back in.",
      });
      setLoading(false);
      return;
    }
    (async () => {
      try {
        // Race against a timeout so a hung network call (ad blockers and some
        // extensions silently block Firestore's long-polling requests) can
        // never leave this spinner stuck forever.
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timed out reaching Firestore after 10s.")), 10000)
        );
        const snap = await Promise.race([getDoc(doc(db, "profiles", uid)), timeout]);
        if (snap.exists()) {
          setProfile({ ...emptyProfile, ...snap.data() });
        } else {
          setProfile({
            ...emptyProfile,
            displayName: firebaseUser.displayName || "",
            photoUrl: firebaseUser.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Profile load failed:", err);
        setMessage({
          type: "error",
          text: "Couldn't load your profile. " + (err.code ? err.code + " — " : "") + err.message,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  const update = (patch) => setProfile((p) => ({ ...p, ...patch }));

  const toggleDay = (day) => {
    setProfile((p) => ({
      ...p,
      availableDays: p.availableDays.includes(day)
        ? p.availableDays.filter((d) => d !== day)
        : [...p.availableDays, day],
    }));
  };

  const addMutedProject = () => {
    const name = newMutedProject.trim();
    if (!name || profile.mutedProjects.includes(name)) return;
    update({ mutedProjects: [...profile.mutedProjects, name] });
    setNewMutedProject("");
  };

  const removeMutedProject = (name) => {
    update({ mutedProjects: profile.mutedProjects.filter((p) => p !== name) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!uid) return;
    setSaving(true);
    setMessage(null);
    try {
      let photoUrl = profile.photoUrl;
      let resumeUrl = profile.resumeUrl;
      let resumeFileName = profile.resumeFileName;

      if (photoFile) {
        const photoRef = ref(storage, `avatars/${uid}`);
        await uploadBytes(photoRef, photoFile);
        photoUrl = await getDownloadURL(photoRef);
      }
      if (resumeFile) {
        const resumeRef = ref(storage, `resumes/${uid}`);
        await uploadBytes(resumeRef, resumeFile);
        resumeUrl = await getDownloadURL(resumeRef);
        resumeFileName = resumeFile.name;
      }

      const toSave = { ...profile, photoUrl, resumeUrl, resumeFileName, updatedAt: serverTimestamp() };
      await setDoc(doc(db, "profiles", uid), toSave, { merge: true });
      setProfile(toSave);
      setPhotoFile(null);
      setResumeFile(null);
      setMessage({ type: "success", text: "Profile saved." });
    } catch (err) {
      setMessage({ type: "error", text: "Couldn't save your profile. " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      account: { uid, email: firebaseUser?.email || null, phone: firebaseUser?.phoneNumber || null },
      profile,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taxon-account-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!uid) return;
    setDeleting(true);
    setMessage(null);
    try {
      try {
        await deleteObject(ref(storage, `avatars/${uid}`));
      } catch {
        /* file may not exist — fine to ignore */
      }
      try {
        await deleteObject(ref(storage, `resumes/${uid}`));
      } catch {
        /* file may not exist — fine to ignore */
      }
      await deleteDoc(doc(db, "profiles", uid));
      await deleteUser(firebaseUser);
      onSignedOut();
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setMessage({
          type: "error",
          text: "For security, deleting your account requires a recent sign-in. Please sign out, sign back in, and try again.",
        });
      } else {
        setMessage({ type: "error", text: "Couldn't delete your account. " + err.message });
      }
      setDeleting(false);
    }
  };

  const rating = ratingLabel(profile.rating);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.pageBg} ${theme.pageText}`}>
      <div className="px-8 py-6 flex items-center justify-between">
        <button onClick={onBack} className={`flex items-center gap-2 text-sm transition-colors ${theme.navLink}`}>
          <ArrowLeft className="w-4 h-4" /> Back to site
        </button>
        <img src={mainLogo} alt="Taxon AI" className="h-7 w-7 object-contain" />
      </div>

      <div className="max-w-3xl mx-auto px-8 pb-24">
        <h1 className="text-2xl font-bold mb-1">Account</h1>
        <p className={`text-sm mb-8 ${theme.textMuted}`}>
          Manage your profile, work eligibility, availability, and notification preferences.
        </p>

        {loading ? (
          <div className={`flex items-center gap-2 text-sm ${theme.textMuted}`}>
            <Loader2 className="w-4 h-4 animate-spin" /> Loading your profile...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {message && (
              <div
                className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 border ${
                  message.type === "success"
                    ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10"
                    : "border-rose-500/40 text-rose-500 bg-rose-500/10"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                {message.text}
              </div>
            )}

            {/* Rating */}
            <div className={`border rounded-2xl p-6 flex items-center justify-between transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4" />
                  <h2 className="text-sm font-semibold">A-Rating</h2>
                </div>
                <p className={`text-xs ${theme.textMuted}`}>
                  {rating
                    ? "Based on your review history and task quality. Set by Taxon, not editable."
                    : "Not yet rated — complete a few tasks to earn your rating."}
                </p>
              </div>
              {rating && (
                <div className={`text-2xl font-bold ${accent.text}`}>{rating}</div>
              )}
            </div>

            {/* Photo + basic info */}
            <Section theme={theme} icon={Camera} title="Profile photo & name">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full overflow-hidden border flex items-center justify-center shrink-0 ${theme.cardBorder} ${theme.innerBg}`}>
                  {photoPreview || profile.photoUrl ? (
                    <img src={photoPreview || profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className={`w-6 h-6 ${theme.textMuted2}`} />
                  )}
                </div>
                <label className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors ${theme.btnSecondary}`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setPhotoFile(file);
                      setPhotoPreview(URL.createObjectURL(file));
                    }}
                  />
                  Upload photo
                </label>
              </div>
              <Field label="Full name" theme={theme}>
                <input
                  className={fieldClass(theme)}
                  value={profile.displayName}
                  onChange={(e) => update({ displayName: e.target.value })}
                  placeholder="Jane Doe"
                />
              </Field>
            </Section>

            {/* Citizenship & work authorization */}
            <Section theme={theme} icon={Globe} title="Citizenship & work authorization">
              <Field label="Country of citizenship" theme={theme}>
                <input
                  className={fieldClass(theme)}
                  value={profile.citizenship}
                  onChange={(e) => update({ citizenship: e.target.value })}
                  placeholder="e.g. United States"
                />
              </Field>
              <Field label="Work authorization status" theme={theme}>
                <select
                  className={fieldClass(theme)}
                  value={profile.visaStatus}
                  onChange={(e) => update({ visaStatus: e.target.value })}
                >
                  <option value="">Select one</option>
                  {VISA_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Work authorization expiry (if applicable)" theme={theme}>
                <input
                  type="date"
                  className={fieldClass(theme)}
                  value={profile.workAuthExpiry}
                  onChange={(e) => update({ workAuthExpiry: e.target.value })}
                />
              </Field>
            </Section>

            {/* Work info & resume */}
            <Section theme={theme} icon={Briefcase} title="Work information">
              <Field label="Job title / role" theme={theme}>
                <input
                  className={fieldClass(theme)}
                  value={profile.jobTitle}
                  onChange={(e) => update({ jobTitle: e.target.value })}
                  placeholder="e.g. Data Annotation Specialist"
                />
              </Field>
              <Field label="Years of experience" theme={theme}>
                <input
                  type="number"
                  min="0"
                  className={fieldClass(theme)}
                  value={profile.yearsExperience}
                  onChange={(e) => update({ yearsExperience: e.target.value })}
                />
              </Field>
              <Field label="Skills (comma-separated)" theme={theme}>
                <input
                  className={fieldClass(theme)}
                  value={profile.skills}
                  onChange={(e) => update({ skills: e.target.value })}
                  placeholder="e.g. Legal review, Spanish, Python"
                />
              </Field>
              <Field label="Resume" theme={theme}>
                <div className="flex items-center gap-3">
                  <label className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors ${theme.btnSecondary}`}>
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                    {resumeFile ? "Change file" : "Upload resume"}
                  </label>
                  {(resumeFile || profile.resumeUrl) && (
                    <span className={`flex items-center gap-1.5 text-xs ${theme.textMuted}`}>
                      <FileText className="w-3.5 h-3.5" />
                      {resumeFile ? resumeFile.name : profile.resumeFileName || "Resume on file"}
                    </span>
                  )}
                </div>
              </Field>
            </Section>

            {/* Availability */}
            <Section theme={theme} icon={CalendarCheck} title="Availability">
              <Field label="Hours available per week" theme={theme}>
                <input
                  type="number"
                  min="0"
                  max="168"
                  className={fieldClass(theme)}
                  value={profile.availabilityHours}
                  onChange={(e) => update({ availabilityHours: e.target.value })}
                />
              </Field>
              <Field label="Timezone" theme={theme}>
                <input
                  className={fieldClass(theme)}
                  value={profile.timezone}
                  onChange={(e) => update({ timezone: e.target.value })}
                  placeholder="e.g. America/Los_Angeles"
                />
              </Field>
              <Field label="Days available" theme={theme}>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const active = profile.availableDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          active ? accent.toggleActive : `border-transparent ${theme.toggleInactive} ${theme.innerBg}`
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </Section>

            {/* Pay preferences */}
            <Section theme={theme} icon={Banknote} title="Pay preferences">
              <Field label="Minimum acceptable pay ($/hr)" theme={theme}>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className={fieldClass(theme)}
                  value={profile.minPay}
                  onChange={(e) => update({ minPay: e.target.value })}
                  placeholder="e.g. 20"
                />
              </Field>
              <p className={`text-xs ${theme.textMuted}`}>
                You won't be shown tasks paying below this rate once matching is live.
              </p>
            </Section>

            {/* Notifications */}
            <Section theme={theme} icon={Bell} title="Notification preferences">
              <ToggleRow
                label="Pause all notifications"
                desc="Temporarily stop every notification, including new task alerts."
                checked={profile.notificationsPaused}
                onChange={(v) => update({ notificationsPaused: v })}
                theme={theme}
                accent={accent}
              />
              <div className={`h-px ${theme.cardBorder} border-t`} />
              <ToggleRow
                label="Email notifications"
                checked={profile.notifyEmail}
                onChange={(v) => update({ notifyEmail: v })}
                theme={theme}
                accent={accent}
              />
              <ToggleRow
                label="SMS notifications"
                checked={profile.notifySms}
                onChange={(v) => update({ notifySms: v })}
                theme={theme}
                accent={accent}
              />
              <ToggleRow
                label="Weekly project digest"
                desc="A summary of available projects matching your skills."
                checked={profile.notifyProjectDigest}
                onChange={(v) => update({ notifyProjectDigest: v })}
                theme={theme}
                accent={accent}
              />

              <div className={`h-px ${theme.cardBorder} border-t`} />

              <div>
                <div className="text-sm font-medium mb-1 flex items-center gap-2">
                  <BellOff className="w-3.5 h-3.5" /> Muted projects
                </div>
                <p className={`text-xs mb-3 ${theme.textMuted}`}>
                  Stop notifications from specific projects by name. Once real project data exists,
                  this list will populate from your active projects instead of manual entry.
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    className={fieldClass(theme)}
                    value={newMutedProject}
                    onChange={(e) => setNewMutedProject(e.target.value)}
                    placeholder="Project name"
                  />
                  <button
                    type="button"
                    onClick={addMutedProject}
                    className={`px-4 rounded-lg text-sm font-medium transition-colors ${theme.btnSecondary}`}
                  >
                    Add
                  </button>
                </div>
                {profile.mutedProjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.mutedProjects.map((p) => (
                      <span
                        key={p}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${theme.innerBg}`}
                      >
                        {p}
                        <button type="button" onClick={() => removeMutedProject(p)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${theme.btnPrimary}`}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleExportData}
                className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border transition-colors ${theme.cardBorder} ${theme.iconMuted}`}
              >
                <Download className="w-4 h-4" /> Export my data
              </button>
            </div>

            {/* Danger zone */}
            <div className={`border rounded-2xl p-6 mt-8 border-rose-500/30`}>
              <div className="flex items-center gap-2 mb-2 text-rose-500">
                <Trash2 className="w-4 h-4" />
                <h2 className="text-sm font-semibold">Delete account</h2>
              </div>
              <p className={`text-xs mb-4 ${theme.textMuted}`}>
                This permanently deletes your profile, resume, photo, and sign-in — it can't be undone.
              </p>
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm font-medium px-4 py-2 rounded-full border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  Delete my account
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                  >
                    {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {deleting ? "Deleting..." : "Yes, permanently delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className={`text-sm transition-colors ${theme.navLink}`}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange, accent, theme }) {
  return (
    <div className={`flex items-center border rounded-full p-1 text-xs font-medium ${theme.toggleTrack}`}>
      <button
        onClick={() => onChange("user")}
        className={`px-3 py-1.5 rounded-full border transition-colors ${
          mode === "user" ? accent.toggleActive : `border-transparent ${theme.toggleInactive}`
        }`}
      >
        User
      </button>
      <button
        onClick={() => onChange("client")}
        className={`px-3 py-1.5 rounded-full border transition-colors ${
          mode === "client" ? accent.toggleActive : `border-transparent ${theme.toggleInactive}`
        }`}
      >
        Client
      </button>
    </div>
  );
}

function ThemeToggle({ uiTheme, onChange, theme }) {
  return (
    <button
      onClick={() => onChange(uiTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light and dark theme"
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${theme.cardBorder} ${theme.btnSecondary}`}
    >
      {uiTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function Nav({ mode, onModeChange, uiTheme, onThemeChange, mainLogo, modeLogo, wordmark, accent, theme, links, authUser, onOpenAuth, onOpenAccount, onSignOut }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between border-b-2 transition-all duration-300 ${
        scrolled
          ? `px-8 py-3 ${accent.navBg} ${accent.navBorder} backdrop-blur-md`
          : `px-8 py-5 ${theme.pageBg} ${theme.cardBorder}`
      }`}
    >
      <div
        className={`flex items-center gap-3 group cursor-pointer origin-top-left transition-transform duration-300 ${
          scrolled ? "scale-90" : "scale-100"
        }`}
      >
        <div className="relative shrink-0 h-8 w-8">
          <img
            src={modeLogo}
            alt="Taxon AI"
            className="absolute inset-0 h-8 w-8 object-contain transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src={mainLogo}
            alt="Taxon AI"
            className="absolute inset-0 h-8 w-8 object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
        <img
          src={wordmark}
          alt="Taxon - Precision Data Platform"
          className="h-8 w-auto object-contain"
        />
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm">
        {links.map((link) => (
          <button key={link} className={`transition-colors ${theme.navLink}`}>
            {link}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle mode={mode} onChange={onModeChange} accent={accent} theme={theme} />
        <ThemeToggle uiTheme={uiTheme} onChange={onThemeChange} theme={theme} />
        <AccountMenu user={authUser} theme={theme} onOpenAuth={onOpenAuth} onOpenAccount={onOpenAccount} onSignOut={onSignOut} />
      </div>
    </nav>
  );
}

function Hero({ accent, theme, content }) {
  return (
    <section className="relative overflow-hidden px-8 pt-24 pb-16 text-center">
      <AnnotationBackground color={accent.textureColor} />
      <div className="relative max-w-3xl mx-auto">
        <h1 className={`text-5xl md:text-6xl font-extrabold leading-tight ${theme.textPrimary}`}>
          {content.title[0]}
          <br />
          {content.title[1]}
        </h1>
        <p className={`mt-6 text-lg max-w-xl mx-auto ${theme.textMuted}`}>{content.subtitle}</p>
        <button className={`mt-8 font-medium px-6 py-3 rounded-full transition-colors ${theme.btnPrimary}`}>
          {content.cta}
        </button>
      </div>
    </section>
  );
}

function Commitments({ content, accent, theme }) {
  return (
    <section className="px-8 pb-20 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{content.heading}</h2>
        <p className={`text-sm max-w-lg mx-auto ${theme.textMuted}`}>{content.subtext}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {content.items.map((item) => (
          <div
            key={item.title}
            className={`border rounded-2xl p-6 transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}
          >
            <div
              className={`w-11 h-11 rounded-lg border ${accent.iconBorder} flex items-center justify-center mb-5 transition-colors duration-500`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
            <p className={`text-xs ${theme.textMuted}`}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCards({ features, accent, theme }) {
  return (
    <section className="px-8 pb-20 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {features.map((f) => (
        <div
          key={f.title}
          className={`border rounded-2xl p-6 flex flex-col transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}
        >
          <div
            className={`w-11 h-11 rounded-lg border ${accent.iconBorder} flex items-center justify-center mb-6 transition-colors duration-500`}
          >
            <f.icon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold mb-2">{f.title}</h3>
          <p className={`text-sm flex-1 ${theme.textMuted}`}>{f.desc}</p>
          <button
            className={`mt-6 text-sm font-medium px-4 py-2 rounded-full w-fit transition-colors ${
              f.filled ? theme.btnPrimary : theme.btnSecondary
            }`}
          >
            {f.cta}
          </button>
        </div>
      ))}
    </section>
  );
}

function HowItWorks({ steps, accent, theme }) {
  return (
    <section className={`px-8 py-16 border-t max-w-6xl mx-auto transition-colors duration-500 ${theme.cardBorder}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="relative">
            <div
              className={`w-9 h-9 rounded-full border ${accent.iconBorder} flex items-center justify-center text-sm font-semibold mb-4 transition-colors duration-500`}
            >
              {i + 1}
            </div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className={`text-sm ${theme.textMuted}`}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// The dashboard preview is a fixed product-screenshot mockup — kept dark
// regardless of the site's light/dark theme, the way a real screenshot would be.
function DashboardPreview({ accent, theme, heading, subtext }) {
  return (
    <section className="px-8 pb-20 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{heading}</h2>
        <p className={`text-sm max-w-lg mx-auto ${theme.textMuted}`}>{subtext}</p>
      </div>
      <div
        className={`bg-neutral-900 border ${accent.border} rounded-2xl overflow-hidden flex text-sm transition-colors duration-500`}
      >
        <div className="w-48 border-r border-neutral-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded border border-neutral-600 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-xs tracking-wide text-white">TAXON AI</span>
            </div>
            <nav className="space-y-3 text-neutral-400 text-xs">
              <div className="text-white flex items-center gap-2">
                <Square className="w-3.5 h-3.5" /> Cunfiaro
              </div>
              <div>Pricing</div>
              <div>Blogs</div>
              <div>Features</div>
              <div>Settings</div>
            </nav>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <div className="w-6 h-6 rounded-full bg-neutral-700" />
            <div>
              Beld cvero
              <br />
              0/22306
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 border-r border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-500 text-xs">Platform</span>
            <div className="flex items-center gap-3 text-neutral-500">
              <Mail className="w-4 h-4" />
              <Bell className="w-4 h-4" />
              <div className="w-6 h-6 rounded-full bg-neutral-700" />
            </div>
          </div>
          <h4 className="font-semibold mb-3 text-white">Data Annotation Platform</h4>
          <div className="flex gap-4 text-xs text-neutral-500 border-b border-neutral-800 pb-2 mb-4">
            <span className="text-white border-b-2 border-white pb-2 -mb-2.5">
              Inoastes
            </span>
            <span>Data</span>
          </div>
          <div className="text-xs text-neutral-500 mb-4 flex items-center flex-wrap gap-1">
            <span>Annotation Taxonomy</span>
            <ChevronRight className="w-3 h-3" />
            <span>Image</span>
            <ChevronRight className="w-3 h-3" />
            <span>Atonet</span>
            <ChevronRight className="w-3 h-3" />
            <span>Macnat</span>
            <ChevronRight className="w-3 h-3" />
            <span>Gebort</span>
            <ChevronRight className="w-3 h-3" />
            <span className="bg-neutral-700 text-white px-1.5 rounded">
              Macastor
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[10px] text-neutral-500">
                Batky type: Name
              </label>
              <div className="bg-neutral-800 rounded px-2 py-1.5 mt-1 text-xs text-white">
                Ramster
              </div>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500">
                BatirtWoskiky Game
              </label>
              <div className="bg-neutral-800 rounded px-2 py-1.5 mt-1 text-xs">
                &nbsp;
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-neutral-500">Image</label>
              <div className="mt-1 rounded-lg overflow-hidden bg-neutral-800 h-28 flex items-center justify-center text-neutral-600 text-[10px]">
                Namstor Kojaton
              </div>
              <button className="mt-2 text-[10px] text-neutral-500 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Molcart
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-neutral-500">Text</label>
                <div className="bg-neutral-800 rounded px-2 py-1.5 mt-1 text-xs text-white">
                  Lotwot enrakpont
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500">
                  Leihe port
                </label>
                <div className="bg-neutral-800 rounded px-2 py-1.5 mt-1 text-xs text-neutral-500">
                  Spots and ooo...
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-[10px] text-neutral-500">
              Audio category
            </label>
            <div className="bg-neutral-800 rounded-full px-3 py-1.5 mt-1 flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-white" />
              <div className="flex-1 h-1 bg-neutral-700 rounded-full" />
              <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                Elpcrcft-1-Sthecioe
              </span>
            </div>
          </div>
        </div>

        <div className="w-56 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-white">Label Categories</span>
          </div>
          <div className="text-xs text-neutral-400 space-y-1.5">
            <div>Image</div>
            <div className="pl-3">Arbnal</div>
            <div className="pl-6">Material</div>
            <div className="pl-6">Deolant</div>
            <div className="pl-9 bg-neutral-800 text-white rounded px-1.5 py-0.5 w-fit">
              Rotarct
            </div>
            <div className="pl-6">Manstor</div>
            <div className="pl-6">Tcass</div>
            <div className="pl-6">Rorrdit</div>
            <div className="pl-3">Disjetal</div>
          </div>
          <div className="mt-6">
            <span className="text-xs font-medium text-white">Voice</span>
            <div className="mt-2 bg-neutral-800 rounded-lg p-3 flex flex-col items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white" />
              </button>
              <div className="w-full h-1 bg-neutral-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityGrid({ extra, accent, theme }) {
  return (
    <section className={`px-8 py-16 border-t max-w-6xl mx-auto transition-colors duration-500 ${theme.cardBorder}`}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{extra.heading}</h2>
        <p className={`text-sm ${theme.textMuted}`}>{extra.subtext}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {extra.items.map((item) => (
          <div
            key={item.title}
            className={`border rounded-2xl p-6 transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}
          >
            <div
              className={`w-11 h-11 rounded-lg border ${accent.iconBorder} flex items-center justify-center mb-5 transition-colors duration-500`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
            <p className={`text-xs ${theme.textMuted}`}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EarningsTable({ extra, accent, theme }) {
  return (
    <section className={`px-8 py-16 border-t max-w-6xl mx-auto transition-colors duration-500 ${theme.cardBorder}`}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{extra.heading}</h2>
        <p className={`text-sm ${theme.textMuted}`}>{extra.subtext}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {extra.tiers.map((tier) => (
          <div
            key={tier.title}
            className={`border rounded-2xl p-6 transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}
          >
            <h3 className="font-semibold mb-1 text-sm">{tier.title}</h3>
            <div className={`text-xl font-bold mb-3 ${accent.text}`}>{tier.rate}</div>
            <p className={`text-xs ${theme.textMuted}`}>{tier.desc}</p>
          </div>
        ))}
      </div>
      <p className={`text-center text-xs mt-8 ${theme.textMuted2}`}>{extra.note}</p>
    </section>
  );
}

function FAQSection({ faq, theme }) {
  return (
    <section className={`px-8 py-16 border-t max-w-3xl mx-auto transition-colors duration-500 ${theme.cardBorder}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {faq.map((item) => (
          <details
            key={item.q}
            className={`group border rounded-xl p-4 transition-colors duration-500 ${theme.cardBg} ${theme.cardBorder}`}
          >
            <summary className="flex items-center justify-between cursor-pointer text-sm font-medium list-none">
              {item.q}
              <ChevronDown className={`w-4 h-4 transition-transform group-open:rotate-180 ${theme.textMuted2}`} />
            </summary>
            <p className={`mt-3 text-sm ${theme.textMuted}`}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTASection({ cta, theme }) {
  return (
    <section className={`px-8 py-20 text-center border-t transition-colors duration-500 ${theme.cardBorder}`}>
      <h2 className={`text-3xl md:text-4xl font-bold ${theme.textPrimary}`}>
        {cta.title[0]}
        <br />
        {cta.title[1]}
      </h2>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button className={`font-medium px-6 py-3 rounded-full transition-colors ${theme.btnPrimary}`}>
          {cta.primary}
        </button>
        <button className={`border font-medium px-6 py-3 rounded-full transition-colors ${theme.btnOutline}`}>
          {cta.secondary}
        </button>
      </div>
    </section>
  );
}

function Footer({ theme }) {
  return (
    <footer className={`px-8 pt-16 pb-8 border-t max-w-6xl mx-auto transition-colors duration-500 ${theme.cardBorder}`}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2">
          <span className="font-bold tracking-wide text-sm">TAXON AI</span>
          <p className={`mt-3 text-xs max-w-xs ${theme.textMuted2}`}>
            Precision data labeling and expert review for teams building the next
            generation of AI. Based in San Francisco, CA.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <GithubIcon className={`w-4 h-4 transition-colors cursor-pointer ${theme.iconMuted}`} />
            <XIcon className={`w-4 h-4 transition-colors cursor-pointer ${theme.iconMuted}`} />
            <LinkedinIcon className={`w-4 h-4 transition-colors cursor-pointer ${theme.iconMuted}`} />
          </div>
        </div>
        <div>
          <h4 className={`text-xs font-semibold mb-3 ${theme.textMuted}`}>Product</h4>
          <ul className={`space-y-2 text-xs ${theme.textMuted2}`}>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Platform</li>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Pricing</li>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Security</li>
          </ul>
        </div>
        <div>
          <h4 className={`text-xs font-semibold mb-3 ${theme.textMuted}`}>Company</h4>
          <ul className={`space-y-2 text-xs ${theme.textMuted2}`}>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>About</li>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Blog</li>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Careers</li>
          </ul>
        </div>
        <div>
          <h4 className={`text-xs font-semibold mb-3 ${theme.textMuted}`}>Legal</h4>
          <ul className={`space-y-2 text-xs ${theme.textMuted2}`}>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Privacy</li>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Terms</li>
            <li className={`cursor-pointer transition-colors ${theme.iconMuted}`}>Contact</li>
          </ul>
        </div>
      </div>
      <div className={`pt-6 border-t text-xs text-center transition-colors duration-500 ${theme.cardBorder} ${theme.textMuted3}`}>
        © {new Date().getFullYear()} Taxon AI. All rights reserved.
      </div>
    </footer>
  );
}

export default function TaxonLanding({
  mainLogoSrc = "/logo-combined.png",
  userLogoSrc = "/logo-user.png",
  clientLogoSrc = "/logo-client.png",
  wordmarkSrc = "/logo2.png",
}) {
  const [mode, setMode] = useState("user");
  const [uiTheme, setUiTheme] = useState("dark");
  const [view, setView] = useState("site"); // site | auth | account
  const [authUser, setAuthUser] = useState(null);
  const theme = THEME[uiTheme];
  const accent = ACCENTS[uiTheme][mode];
  const modeLogo = mode === "user" ? userLogoSrc : clientLogoSrc;
  const content = CONTENT[mode];

  // Firebase persists sessions itself (localStorage under the hood), so this
  // restores the logged-in state on refresh instead of losing it like the
  // earlier React-state-only mock did. We keep the raw firebaseUser object
  // (not a trimmed copy) so the account page has access to uid/email/etc.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser || null);
    });
    return unsubscribe;
  }, []);

  if (view === "auth") {
    return (
      <AuthPage
        theme={theme}
        mainLogo={mainLogoSrc}
        onBack={() => setView("site")}
        onComplete={(user) => {
          setAuthUser(user);
          setView("site");
        }}
      />
    );
  }

  if (view === "account") {
    if (!authUser) {
      setView("auth");
      return null;
    }
    return (
      <AccountPage
        theme={theme}
        accent={accent}
        mainLogo={mainLogoSrc}
        firebaseUser={authUser}
        onBack={() => setView("site")}
        onSignedOut={() => {
          setAuthUser(null);
          setView("site");
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${theme.pageBg} ${theme.pageText}`}>
      <Nav
        mode={mode}
        onModeChange={setMode}
        uiTheme={uiTheme}
        onThemeChange={setUiTheme}
        mainLogo={mainLogoSrc}
        modeLogo={modeLogo}
        wordmark={wordmarkSrc}
        accent={accent}
        theme={theme}
        links={content.navLinks}
        authUser={authUser}
        onOpenAuth={() => setView("auth")}
        onOpenAccount={() => setView("account")}
        onSignOut={() => signOut(auth)}
      />
      <Hero accent={accent} theme={theme} content={content.hero} />
      <Commitments content={content.commitments} accent={accent} theme={theme} />
      <FeatureCards features={content.features} accent={accent} theme={theme} />
      <HowItWorks steps={content.steps} accent={accent} theme={theme} />
      <DashboardPreview
        accent={accent}
        theme={theme}
        heading={content.dashboard.heading}
        subtext={content.dashboard.subtext}
      />
      {content.extra.type === "security" ? (
        <SecurityGrid extra={content.extra} accent={accent} theme={theme} />
      ) : (
        <EarningsTable extra={content.extra} accent={accent} theme={theme} />
      )}
      <FAQSection faq={content.faq} theme={theme} />
      <CTASection cta={content.cta} theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}
