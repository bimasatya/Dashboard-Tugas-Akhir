import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// [FIX-1] Tweet LDA: 6591 → 4890 (setelah dedup, sesuai catatan notebook LDA)
// [FIX-2] Tweet BERTopic: 4152 → 4142
// [FIX-6] Total Topik: diperjelas LDA=14, BERTopic=20 final
const stats = [
  {
    label: "Platform",
    value: "X / Twitter",
    sub: "Media Sosial",
    icon: "🐦",
    color: "bg-sky-50 border-sky-200",
    textColor: "text-sky-700",
    isText: true,
  },
  {
    label: "Dataset LDA",
    // [FIX-1] 6591 → 4890
    value: 4890,
    sub: "tweet (setelah dedup)",
    icon: "📊",
    color: "bg-lda-50 border-lda-200",
    textColor: "text-lda-700",
    suffix: " tweet",
  },
  {
    label: "Dataset BERTopic",
    // [FIX-2] 4152 → 4142
    value: 4142,
    sub: "tweet (filter bahasa id+en)",
    icon: "🤖",
    color: "bg-bert-50 border-bert-200",
    textColor: "text-bert-700",
    suffix: " tweet",
  },
  {
    label: "Periode Data",
    value: "Des 2024",
    sub: "– Des 2025",
    icon: "📅",
    color: "bg-violet-50 border-violet-200",
    textColor: "text-violet-700",
    isText: true,
  },
  {
    label: "Topik LDA Final",
    value: 14,
    // [FIX-6] sub diperjelas agar tidak disalahbaca sebagai jumlah topik BERTopic
    sub: "topik (K=14) · BERTopic: 20",
    icon: "🗂️",
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-700",
    suffix: " topik",
  },
  {
    label: "Dominan: FOMO",
    value: 28.63,
    sub: "dari total dokumen LDA",
    icon: "😱",
    color: "bg-fomo-50 border-red-200",
    textColor: "text-fomo-600",
    suffix: "%",
    isFloat: true,
  },
];

function AnimatedCounter({ target, suffix = "", isFloat = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(current);
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = isFloat
    ? count.toFixed(2)
    : Math.round(count).toLocaleString("id-ID");

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function OverviewCards() {
  return (
    <section className="py-20 bg-white" id="overview">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-gray-400 uppercase">
            Ringkasan Penelitian
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            Overview Dataset & Metrik
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Penelitian menggunakan data tweet berbahasa Indonesia dari platform X,
            dikumpulkan selama satu tahun penuh dengan dua pendekatan berbeda.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-2xl border p-5 ${stat.color} shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className={`font-display text-xl font-bold ${stat.textColor} leading-tight`}>
                {stat.isText ? (
                  stat.value
                ) : (
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    isFloat={stat.isFloat}
                  />
                )}
              </div>
              {stat.isText && stat.sub && (
                <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>
              )}
              {!stat.isText && (
                <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
              )}
              <div className="text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-400 mt-6 font-mono"
        >
          * LDA: 4.890 tweet setelah deduplication → 4.516 dokumen terproses (setelah hapus doc &lt;3 token).
          BERTopic: filter non-Latin + langdetect id+en. BERTopic menghasilkan 20 topik final (15 valid setelah exclude noise).
        </motion.p>
      </div>
    </section>
  );
}
