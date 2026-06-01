import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { ldaTopics, bertopicTopics, outlierProgress } from "../data/research";

const ldaData = ldaTopics.map((t) => ({
  name: `T${t.id}`,
  label: t.label,
  docs: t.docs,
  pct: t.pct,
  isFomo: t.id === 8,
}));

const bertopicCoherenceData = [...bertopicTopics]
  .sort((a, b) => b.coherence - a.coherence)
  .map((t) => ({
    name: `T${t.id}`,
    label: t.label,
    coherence: t.coherence,
    isFomo: t.id === 1,
    isGood: t.coherence >= 0.7,
  }));

const CustomTooltipLDA = ({ active, payload }) => {
  if (active && payload && payload[0]) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-card-lg text-xs">
        <p className="font-semibold text-gray-800 mb-1">{d.label}</p>
        <p className="text-gray-600">
          <span className="font-mono text-lda-600">{d.docs.toLocaleString("id-ID")}</span> dokumen
        </p>
        <p className="text-gray-500">{d.pct}% dari total dataset</p>
        {d.isFomo && <p className="text-fomo-600 font-semibold mt-1">🔥 Topik FOMO terbesar!</p>}
      </div>
    );
  }
  return null;
};

const CustomTooltipBERT = ({ active, payload }) => {
  if (active && payload && payload[0]) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-card-lg text-xs">
        <p className="font-semibold text-gray-800 mb-1">{d.label}</p>
        <p className="text-gray-600">
          Coherence C_v:{" "}
          <span className="font-mono text-bert-600 font-bold">{d.coherence.toFixed(4)}</span>
        </p>
        {d.coherence >= 0.7  && <p className="text-green-600 font-medium mt-1">✅ Sangat Baik (≥ 0.70)</p>}
        {d.coherence >= 0.5 && d.coherence < 0.7 && <p className="text-blue-600 font-medium mt-1">☑ Baik / Cukup (0.50–0.69)</p>}
        {d.coherence < 0.5   && <p className="text-gray-400 font-medium mt-1">○ Kurang (&lt; 0.50)</p>}
        {d.isFomo && <p className="text-fomo-600 font-semibold mt-1">🔥 FOMO — C_v sempurna!</p>}
      </div>
    );
  }
  return null;
};

export default function TopicDistribution() {
  // Hitung total outlier yang dipindahkan untuk callout
  const totalMoved = outlierProgress[0].count - outlierProgress[2].count; // 1599 - 109 = 1490

  return (
    <section className="py-20 bg-white" id="topics">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-gray-400 uppercase">
            Distribusi Topik
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            Hasil Pemodelan Topik
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Distribusi dokumen per topik (LDA) dan coherence score per topik (BERTopic).
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LDA Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-lda-600" />
              <div>
                <h3 className="font-display text-base font-semibold text-gray-800">
                  LDA — Distribusi Dokumen per Topik
                </h3>
                {/* [FIX-1] "6.591 tweet" → "4.890 tweet" */}
                <p className="text-xs text-gray-500">K=14 · 4.890 tweet (4.516 dok terproses) · Coherence 0.4846</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={ldaData} layout="vertical" margin={{ left: 20, right: 60, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(v) => v.toLocaleString("id-ID")} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "JetBrains Mono, monospace" }} width={30} />
                <Tooltip content={<CustomTooltipLDA />} />
                <Bar dataKey="docs" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {ldaData.map((entry) => (
                    <Cell key={entry.name} fill={entry.isFomo ? "#DC2626" : "#2563EB"} opacity={entry.isFomo ? 1 : 0.75} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-lda-600 opacity-75" />Topik lainnya
              </span>
              <span className="flex items-center gap-1.5 text-xs text-fomo-600 font-medium">
                <span className="w-3 h-3 rounded-sm bg-fomo-600" />Topik 8 — FOMO (28.63%)
              </span>
            </div>
          </motion.div>

          {/* BERTopic Coherence Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-bert-600" />
              <div>
                <h3 className="font-display text-base font-semibold text-gray-800">
                  BERTopic — Coherence Score per Topik
                </h3>
                {/* [FIX-6,2] "14 topik" → "15 topik valid", "4.152" → "4.142" */}
                <p className="text-xs text-gray-500">
                  20 topik final (15 valid) · 4.142 tweet · Rata-rata 0.5835
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={bertopicCoherenceData} layout="vertical" margin={{ left: 20, right: 60, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" domain={[0, 1.05]} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(v) => v.toFixed(1)} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "JetBrains Mono, monospace" }} width={30} />
                <Tooltip content={<CustomTooltipBERT />} />
                <ReferenceLine x={0.5} stroke="#93C5FD" strokeDasharray="4 2" label={{ value: "0.5", position: "top", fontSize: 10, fill: "#93C5FD" }} />
                <ReferenceLine x={0.7} stroke="#10B981" strokeDasharray="4 2" label={{ value: "0.7", position: "top", fontSize: 10, fill: "#10B981" }} />
                <Bar dataKey="coherence" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {bertopicCoherenceData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.isFomo ? "#DC2626" : entry.isGood ? "#10B981" : "#EA580C"}
                      opacity={entry.isFomo ? 1 : 0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 justify-center flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 opacity-80" />Sangat Baik (≥0.70)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-bert-600">
                <span className="w-3 h-3 rounded-sm bg-bert-600 opacity-80" />Kurang (&lt;0.50)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-fomo-600 font-medium">
                <span className="w-3 h-3 rounded-sm bg-fomo-600" />FOMO (C_v=1.0)
              </span>
            </div>
          </motion.div>
        </div>

        {/* Outlier Reduction Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-r from-bert-50 to-orange-50 rounded-3xl border border-bert-200 p-8"
        >
          <h3 className="font-display text-lg font-semibold text-bert-800 mb-1">
            BERTopic — Proses Reduksi Outlier (Two-Pass Strategy)
          </h3>
          {/* [FIX-3,4,5] angka diupdate dari outlierProgress (data penelitian) */}
          <p className="text-sm text-gray-500 mb-2">
            Dari {outlierProgress[0].pct}% outlier → {outlierProgress[2].pct}% melalui dua tahap post-processing
          </p>
          <p className="text-xs text-bert-700 font-mono mb-6">
            Total {totalMoved.toLocaleString("id-ID")} dokumen berhasil dialokasikan ke topik (Pass 1: 727 dok · Pass 2: 763 dok)
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { stage: "Kondisi Awal",     color: "bg-red-200",    textColor: "text-red-800",    label: "Sebelum post-processing" },
              { stage: "Setelah Pass 1",   color: "bg-orange-200", textColor: "text-orange-800", label: "c-TF-IDF (threshold 0.1)" },
              { stage: "Setelah Pass 2",   color: "bg-green-200",  textColor: "text-green-800",  label: "Embeddings cosine (threshold 0.5)" },
            ].map((step, i) => {
              const data = outlierProgress[i]; // data dari research.js (sudah dikoreksi)
              return (
                <div key={step.stage} className="bg-white rounded-2xl p-5 border border-white/80 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-bert-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{step.stage}</span>
                  </div>
                  <div className="text-3xl font-display font-bold text-bert-700 mb-1">{data.pct}%</div>
                  <div className="text-xs text-gray-500 mb-3">
                    outlier ({data.count.toLocaleString("id-ID")} tweet)
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${step.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${data.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.3 }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-mono">{step.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
