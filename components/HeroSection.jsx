import { motion } from "framer-motion";
import { fomoData } from "../data/research";

const floatingTweets = fomoData.tweetExamples;

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lda-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-bert-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div>
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lda-100 text-lda-800 text-xs font-medium font-display border border-lda-200">
              <span className="w-2 h-2 rounded-full bg-lda-600 animate-pulse-soft" />
              LDA — Probabilistik
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bert-100 text-bert-800 text-xs font-medium font-display border border-bert-200">
              <span className="w-2 h-2 rounded-full bg-bert-600 animate-pulse-soft" />
              BERTopic — Semantik
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4"
          >
            Analisis Percakapan{" "}
            <span className="text-gradient-lda">Olahraga Lari</span>{" "}
            di Media Sosial
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 mb-4 font-medium"
          >
            Perbandingan LDA dan BERTopic
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-500 mb-8 leading-relaxed"
          >
            Pendekatan Probabilistik vs Pendekatan Semantik dalam Memahami
            Budaya Lari Digital di Indonesia.{" "}
            <span className="text-gray-700 font-medium">
              Platform X/Twitter · Des 2024 – Des 2025
            </span>
          </motion.p>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { label: "Tweet dikumpulkan", value: "6.591", color: "lda" },
              { label: "Topik teridentifikasi", value: "14", color: "bert" },
              { label: "FOMO dominan", value: "28.6%", color: "fomo" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`px-4 py-3 rounded-xl border bg-white/70 backdrop-blur-sm shadow-card`}
              >
                <div
                  className={`font-display text-2xl font-bold ${
                    stat.color === "lda"
                      ? "text-lda-600"
                      : stat.color === "bert"
                      ? "text-bert-600"
                      : "text-fomo-600"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Illustration + Floating Tweets */}
        <div className="relative hidden lg:block">
          {/* Runner SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center animate-float"
          >
            <RunnerIllustration />
          </motion.div>

          {/* Floating Tweet Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="absolute -left-8 top-8 float-card-1"
          >
            <TweetCard tweet={floatingTweets[0]} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="absolute -right-4 bottom-16 float-card-2"
          >
            <TweetCard tweet={floatingTweets[2]} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="absolute right-8 top-4 float-card-3"
          >
            <TweetCard tweet={floatingTweets[3]} mini />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}

function TweetCard({ tweet, mini = false }) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-card-lg p-4 ${
        mini ? "max-w-[180px]" : "max-w-[220px]"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lda-400 to-bert-400 flex items-center justify-center text-white text-xs font-bold">
          X
        </div>
        <span className="text-xs text-gray-500 font-mono">{tweet.user}</span>
      </div>
      <p className="text-xs text-gray-700 leading-relaxed">{tweet.text}</p>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-fomo-50 text-fomo-600 border border-fomo-100 font-medium">
          FOMO
        </span>
        <span className="text-[10px] text-gray-400">#larimulu</span>
      </div>
    </div>
  );
}

function RunnerIllustration() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-xl"
    >
      {/* Background circle */}
      <circle cx="160" cy="160" r="140" fill="url(#heroGrad)" opacity="0.12" />
      <circle cx="160" cy="160" r="110" fill="url(#heroGrad)" opacity="0.08" />

      {/* Runner body - simplified stick figure */}
      {/* Head */}
      <circle cx="180" cy="80" r="22" fill="#1D4ED8" />
      <circle cx="180" cy="80" r="18" fill="#3B82F6" />

      {/* Torso */}
      <path d="M180 102 L165 155" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round" />

      {/* Arms - running pose */}
      <path d="M175 118 L140 100" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
      <path d="M168 130 L210 115" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />

      {/* Legs - running stride */}
      <path d="M165 155 L140 190 L120 220" stroke="#1D4ED8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M165 155 L195 185 L225 175" stroke="#1D4ED8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

      {/* Shoes */}
      <ellipse cx="118" cy="222" rx="16" ry="8" fill="#EA580C" />
      <ellipse cx="227" cy="175" rx="16" ry="8" fill="#EA580C" />

      {/* Speed lines */}
      <path d="M70 190 L100 190" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M60 200 L95 200" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M75 210 L105 210" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* Data dots floating around */}
      <circle cx="90" cy="130" r="5" fill="#3B82F6" opacity="0.7" />
      <circle cx="240" cy="100" r="4" fill="#EA580C" opacity="0.7" />
      <circle cx="250" cy="230" r="6" fill="#7C3AED" opacity="0.5" />
      <circle cx="80" cy="260" r="4" fill="#DC2626" opacity="0.6" />

      {/* Gradient def */}
      <defs>
        <radialGradient id="heroGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
      </defs>
    </svg>
  );
}
