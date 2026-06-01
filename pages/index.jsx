import Head from "next/head";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import OverviewCards from "../components/OverviewCards";
import ComparisonSection from "../components/ComparisonSection";
import TopicDistribution from "../components/TopicDistribution";
import FOMOSection from "../components/FOMOSection";
import TopicCards from "../components/TopicCards";
import ConclusionSection from "../components/ConclusionSection";
import PyLDAVisSection from "../components/PyLDAVisSection";
import IntertopicDistanceSection from "../components/IntertopicDistanceSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Research Dashboard — Analisis Percakapan Olahraga Lari</title>
        <meta
          name="description"
          content="Dashboard penelitian skripsi: Analisis Percakapan Olahraga Lari menggunakan Topic Modeling (LDA vs BERTopic)"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sticky Nav */}
      <StickyNav />

      <main>
        <HeroSection />
        <OverviewCards />
        <ComparisonSection />
        <TopicDistribution />
        <PyLDAVisSection />
        <IntertopicDistanceSection />
        <FOMOSection />
        <TopicCards />
        <ConclusionSection />
        <Footer />
      </main>
    </>
  );
}

function StickyNav() {
  const navItems = [
    { href: "#overview", label: "Overview" },
    { href: "#comparison", label: "LDA vs BERTopic" },
    { href: "#topics", label: "Distribusi Topik" },
    { href: "#pyldavis", label: "pyLDAvis" },
    { href: "#intertopic", label: "Intertopic Map" },
    { href: "#fomo", label: "FOMO" },
    { href: "#topic-cards", label: "Tema Utama" },
    { href: "#conclusion", label: "Kesimpulan" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">🏃</span>
          <span className="font-display text-sm font-bold text-gray-800 hidden sm:block">
            Running Research Dashboard
          </span>
          <div className="flex items-center gap-2 ml-3">
            <span className="w-2 h-2 rounded-full bg-lda-600" />
            <span className="text-xs text-gray-500 hidden md:block">LDA</span>
            <span className="text-gray-300">|</span>
            <span className="w-2 h-2 rounded-full bg-bert-600" />
            <span className="text-xs text-gray-500 hidden md:block">BERTopic</span>
          </div>
        </div>
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono hidden md:block">Des 2024 – Des 2025</span>
          <span className="px-2.5 py-1 bg-fomo-50 text-fomo-600 border border-red-200 rounded-full text-xs font-medium">
            FOMO 28.6%
          </span>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl">🏃</span>
          <span className="font-display text-white font-semibold">
            Analisis Percakapan Olahraga Lari
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Perbandingan LDA dan BERTopic · Platform X/Twitter · Des 2024 – Des 2025
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <span>
            LDA Coherence:{" "}
            <span className="text-lda-400 font-mono font-semibold">0.4846</span>
          </span>
          <span className="text-gray-700">·</span>
          <span>
            BERTopic Coherence:{" "}
            <span className="text-bert-400 font-mono font-semibold">0.5835</span>
          </span>
          <span className="text-gray-700">·</span>
          <span>
            FOMO C_v:{" "}
            <span className="text-red-400 font-mono font-semibold">1.0000</span>
          </span>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-xs text-gray-600">
          Skripsi · Topic Modeling · Bahasa Indonesia · NLP · Running Community Digital
        </div>
      </div>
    </footer>
  );
}
