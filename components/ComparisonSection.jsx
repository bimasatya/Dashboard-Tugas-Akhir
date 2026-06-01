import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { modelMetrics } from "../data/research";

const radarData = [
  { metric: "Coherence Score",       LDA: 48.46, BERTopic: 58.35 },
  { metric: "Topic Diversity",       LDA: 85.24, BERTopic: 85.71 },
  { metric: "Stabilitas",            LDA: 90,    BERTopic: 60    },
  { metric: "Kemudahan Impl.",       LDA: 85,    BERTopic: 55    },
  { metric: "Representasi Semantik", LDA: 50,    BERTopic: 90    },
  { metric: "Efisiensi Komputasi",   LDA: 90,    BERTopic: 55    },
];

// [FIX-9] Outlier row: "38.9% → 2.4%" → "38.6% → 2.6%"
// [FIX-2] Dataset row BERTopic: "4.152" → "4.142"
// [FIX-6] Topik BERTopic: "14" → "20 final (15 valid)"
const comparisonRows = [
  { aspect: "Pendekatan",          lda: "Bag-of-Words (probabilistik)",       bert: "Embedding semantik (SBERT)"          },
  { aspect: "Library",             lda: "Gensim",                             bert: "BERTopic + SBERT"                    },
  { aspect: "Coherence (C_v)",     lda: "0.4846",                             bert: "0.5835 ✅"                           },
  { aspect: "Topic Diversity",     lda: "0.8524",                             bert: "0.8571 ✅"                           },
  // [FIX-1,2] dataset size
  { aspect: "Dataset",             lda: "4.890 tweet",                        bert: "4.142 tweet"                         },
  // [FIX-6] topik BERTopic
  { aspect: "Topik Final",         lda: "14 topik (K=14)",                    bert: "20 topik (15 valid, 5 noise)"        },
  // [FIX-9] outlier percentages
  { aspect: "Outlier",             lda: "0% (semua dialokasikan)",            bert: "38.6% → 2.6% (direduksi) ✅"        },
  { aspect: "Post-processing",     lda: "Tidak diperlukan ✅",                bert: "Wajib (2 tahap reduksi)"             },
  { aspect: "Interpretabilitas",   lda: "Lebih mudah & jelas ✅",            bert: "Sebagian sangat spesifik"            },
  { aspect: "Teks pendek informal",lda: "Lebih andal ✅",                    bert: "Rentan outlier tinggi"               },
  { aspect: "Bigram support",      lda: "Tidak",                              bert: "Ya (ngram 1–2) ✅"                  },
];

export default function ComparisonSection() {
  const { lda, bertopic } = modelMetrics;

  return (
    <section className="py-20 bg-gray-50" id="comparison">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-gray-400 uppercase">
            Perbandingan Metode
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            LDA vs BERTopic
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Dua pendekatan topic modeling dengan karakteristik yang berbeda namun saling melengkapi.
          </p>
        </motion.div>

        {/* Model cards side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* LDA Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-lda-200 shadow-lda p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lda-600 to-lda-400 rounded-t-3xl" />
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-lda-50 rounded-full opacity-50" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-lda-800">LDA</h3>
                  <p className="text-sm text-gray-500">{lda.fullName}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-lda-100 text-lda-700 text-xs font-medium border border-lda-200">
                  Probabilistik
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricBox
                  label="Coherence Score"
                  value="0.4846"
                  sub="C_v — Cukup (lazim untuk Twitter)"
                  color="lda"
                />
                <MetricBox
                  label="Topic Diversity"
                  value="0.8524"
                  sub="Tinggi — kosakata antartopik beragam"
                  color="lda"
                />
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-2">Keunggulan</p>
                <ul className="space-y-1.5">
                  {lda.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-lda-100 text-lda-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-2">Keterbatasan</p>
                <ul className="space-y-1.5">
                  {lda.weaknesses.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-gray-300 flex-shrink-0 mt-0.5">—</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* BERTopic Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl border border-bert-200 shadow-bert p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-bert-600 to-bert-400 rounded-t-3xl" />
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-bert-50 rounded-full opacity-50" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-bert-800">BERTopic</h3>
                  <p className="text-sm text-gray-500">{bertopic.fullName}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-bert-100 text-bert-700 text-xs font-medium border border-bert-200">
                  Semantik
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricBox label="Coherence Score" value="0.5835" sub="C_v — Baik / Cukup ✅" color="bert" winner />
                <MetricBox label="Topic Diversity" value="0.8571" sub="Diversitas Tinggi ✅"   color="bert" winner />
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-2">Keunggulan</p>
                <ul className="space-y-1.5">
                  {bertopic.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-bert-100 text-bert-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-2">Keterbatasan</p>
                <ul className="space-y-1.5">
                  {bertopic.weaknesses.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-gray-300 flex-shrink-0 mt-0.5">—</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insight highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-lda-50 via-white to-bert-50 border border-gray-200 rounded-2xl p-6 text-center mb-12 shadow-card"
        >
          <p className="font-display text-lg font-semibold text-gray-800 italic">
            "Coherence Score tinggi tidak selalu menghasilkan interpretasi topik yang lebih baik."
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Evaluasi kuantitatif dan inspeksi manual bersifat komplementer — tidak bisa salah satunya diabaikan.
          </p>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 shadow-card p-8"
        >
          <h3 className="font-display text-lg font-semibold text-gray-800 mb-1 text-center">
            Profil Perbandingan Multi-Dimensi
          </h3>
          <p className="text-sm text-gray-500 text-center mb-8">
            Coherence & Diversity dari data penelitian · Dimensi lain: penilaian kualitatif dinormalisasi ke 0–100
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={140}>
              <PolarGrid stroke="#F3F4F6" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#6B7280", fontSize: 11, fontFamily: "DM Sans" }}
              />
              <Radar name="LDA"      dataKey="LDA"      stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="BERTopic" dataKey="BERTopic" stroke="#EA580C" fill="#EA580C" fillOpacity={0.15} strokeWidth={2} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: value === "LDA" ? "#2563EB" : "#EA580C", fontWeight: 600, fontFamily: "Sora, sans-serif" }}>
                    {value}
                  </span>
                )}
              />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detail comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-display text-lg font-semibold text-gray-800">
              Tabel Perbandingan Karakteristik
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium w-1/4">Aspek</th>
                  <th className="text-left px-6 py-3 text-lda-700 font-semibold w-[37.5%]">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-lda-500" />LDA</span>
                  </th>
                  <th className="text-left px-6 py-3 text-bert-700 font-semibold w-[37.5%]">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-bert-500" />BERTopic</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.aspect}
                    className={`border-t border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/30 transition-colors`}
                  >
                    <td className="px-6 py-3 text-gray-500 font-medium font-mono text-xs">{row.aspect}</td>
                    <td className="px-6 py-3 text-gray-700">{row.lda}</td>
                    <td className="px-6 py-3 text-gray-700">{row.bert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricBox({ label, value, sub, color, winner }) {
  const colors = {
    lda:  { bg: "bg-lda-50",  border: "border-lda-200",  text: "text-lda-700",  val: "text-lda-800" },
    bert: { bg: "bg-bert-50", border: "border-bert-200", text: "text-bert-700", val: "text-bert-800" },
  };
  const c = colors[color];
  return (
    <div className={`rounded-xl ${c.bg} border ${c.border} p-4 relative`}>
      {winner && (
        <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">✓</span>
      )}
      <div className={`font-display text-2xl font-bold ${c.val}`}>{value}</div>
      <div className={`text-[10px] font-mono uppercase tracking-wide ${c.text} mb-1`}>{label}</div>
      <div className="text-[10px] text-gray-400 leading-snug">{sub}</div>
    </div>
  );
}
