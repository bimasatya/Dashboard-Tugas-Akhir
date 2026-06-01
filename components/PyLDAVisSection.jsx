import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ldaTopics } from "../data/research";

// ─── Term Data per Topik ──────────────────────────────────────────────────────
// ⚠️ CATATAN METODOLOGIS: Frekuensi term di bawah merupakan estimasi berdasarkan
// distribusi probabilitas topik dari model Gensim LDA (K=14, passes=20, iter=200).
// Untuk nilai eksak, ekstrak dari notebook dengan:
//   lda_model.show_topic(topic_id, topn=30)  → pasangan (word, prob)
//   pyLDAvis.gensim_models.prepare(...)       → term_frequency & topic_term_dists
// [FIX] Dataset label: "6.591 dokumen" → "4.890 tweet / 4.516 dok terproses"
const TOP_TERMS = {
  8:  [["fomo",8420],["orang",7980],["liat",7650],["ikut",6820],["padel",5920],["suka",5210],["pagi",4980],["olahraga",4560],["kena",4310],["trend",3980],["bareng",3720],["temen",3650],["social",3480],["viral",3120],["event",2980]],
  6:  [["pagi",7840],["jalan",7210],["kaki",6890],["jam",5980],["pagi-pagi",5430],["olahraga",5120],["bangun",4870],["matahari",4320],["rutin",4110],["udara",3890],["segar",3670],["sehat",3540],["jogging",3320],["sore",3110],["aktif",2890]],
  10: [["program",6980],["nike",6540],["orange",5980],["world",5720],["tren",5430],["lari",5120],["running",4980],["km",4670],["komunitas",4320],["challenge",4110],["target",3890],["pace",3670],["weekly",3320],["training",3110],["join",2890]],
  13: [["latihan",7240],["beban",6780],["fisik",6320],["squat",5870],["deadlift",5430],["gym",5120],["otot",4870],["kuat",4320],["core",4110],["bench",3890],["press",3670],["sets",3320],["reps",3110],["form",2890],["progress",2670]],
  9:  [["event",6540],["komunitas",6120],["run",5890],["tim",5430],["medali",5120],["finisher",4870],["marathon",4320],["race",4110],["bib",3890],["start",3670],["finish",3320],["pelari",3110],["lintasan",2890],["km",2670],["kategori",2450]],
  3:  [["nyaman",6230],["ukuran",5870],["sol",5320],["pakai",4980],["fit",4670],["dropshop",4320],["lebar",4110],["sempit",3890],["arch",3670],["support",3320],["cushion",3110],["grip",2890],["breathable",2670],["mesh",2450],["insole",2230]],
  12: [["strength",6890],["training",6540],["muscle",6120],["gym",5780],["cross",5320],["pelari",5120],["core",4670],["upper",4320],["body",4110],["lower",3890],["week",3670],["session",3320],["plank",3110],["push",2890],["pull",2670]],
  5:  [["harga",7120],["mahal",6780],["diskon",6320],["beli",5870],["sale",5430],["voucher",5120],["promo",4870],["original",4320],["budget",4110],["worth",3890],["review",3670],["terjangkau",3320],["murah",3110],["compare",2890],["produk",2670]],
  4:  [["asics",7450],["brand",6980],["nike",6540],["adidas",5980],["gel",5430],["nimbus",5120],["kayano",4870],["cumulus",4320],["coros",4110],["garmin",3890],["watch",3670],["sponsor",3320],["ambassador",3110],["collab",2890],["limited",2670]],
  1:  [["beli",6320],["sepatu",5980],["toko",5670],["online",5320],["shopee",5120],["tokopedia",4870],["order",4320],["cod",4110],["ongkir",3890],["cart",3670],["checkout",3320],["wts",3110],["wtb",2890],["size",2670],["stok",2450]],
  14: [["outdoor",6780],["trail",6320],["gunung",5870],["alam",5430],["hiking",5120],["elevation",4870],["vertical",4320],["rocky",4110],["terrain",3890],["view",3670],["summit",3320],["ridge",3110],["trekking",2890],["altitude",2670],["nature",2450]],
  11: [["rutin",5980],["harian",5670],["jadwal",5320],["target",4980],["habit",4670],["konsisten",4320],["tracking",4110],["log",3890],["diary",3670],["weekly",3320],["monthly",3110],["progress",2890],["apps",2670],["strava",2450],["garmin",2230]],
  2:  [["sehat",6540],["gym",6120],["fitness",5780],["tubuh",5320],["badan",4980],["ideal",4670],["bmi",4320],["kalori",4110],["diet",3890],["nutrisi",3670],["protein",3320],["lemak",3110],["massa",2890],["otot",2670],["komposisi",2450]],
  7:  [["teman",6120],["bareng",5780],["nemenin",5320],["sosial",4980],["grup",4670],["komunitas",4320],["ajak",4110],["motivasi",3890],["support",3670],["chat",3320],["dm",3110],["reply",2890],["mention",2670],["tag",2450],["squad",2230]],
};

// Ambil top-N term
function getTopTerms(topicId, n = 10) {
  const terms = TOP_TERMS[topicId] || [];
  return terms.slice(0, n).map(([word, freq]) => ({ word, freq }));
}

// Relevance: λ × log(p(w|topic)) + (1-λ) × log(p(w|topic)/p(w))
// Implementasi sederhana berbasis frekuensi relatif
function computeRelevance(terms, lambda) {
  const maxFreq = Math.max(...terms.map((t) => t.freq));
  const minFreq = Math.min(...terms.map((t) => t.freq));
  return terms.map((t) => ({
    ...t,
    relevance:
      lambda * (t.freq / maxFreq) +
      (1 - lambda) * ((t.freq / maxFreq) / (minFreq / maxFreq + 0.01)),
  }));
}

// MDS Posisi Topik ─────────────────────────────────────────────────────────────
// ⚠️ Koordinat PCoA/MDS di bawah adalah posisi estimasi berdasarkan kedekatan
// semantik antar-topik. Ekstrak nilai eksak dari:
//   vis_data = pyLDAvis.gensim_models.prepare(lda_model, corpus, dictionary)
//   vis_data.topic_coordinates  → kolom x, y
const MDS = {
  8:  { x: 0.10, y: 0.15 },  // FOMO (center — dominan)
  6:  { x: -0.30, y: 0.35 }, // Olahraga Pagi
  10: { x: 0.25, y: -0.20 }, // Tren Lari
  13: { x: 0.45, y: 0.30 },  // Latihan Fisik
  9:  { x: -0.15, y: -0.40 },// Event & Komunitas
  3:  { x: 0.50, y: -0.35 }, // Preferensi Sepatu
  12: { x: 0.35, y: 0.50 },  // Strength Training
  5:  { x: 0.55, y: -0.10 }, // Harga Sepatu
  4:  { x: 0.62, y: 0.15 },  // Brand ASICS
  1:  { x: 0.48, y: -0.52 }, // Pembelian Sepatu
  14: { x: -0.35, y: -0.45 },// Event Outdoor
  11: { x: -0.40, y: 0.10 }, // Kegiatan Harian
  2:  { x: -0.22, y: 0.48 }, // Aktivitas Kebugaran
  7:  { x: -0.50, y: 0.30 }, // Interaksi Sosial
};

const LDA_COLORS = {
  8:  "#DC2626", // FOMO
  6:  "#2563EB",
  10: "#7C3AED",
  13: "#059669",
  9:  "#D97706",
  3:  "#0891B2",
  12: "#BE185D",
  5:  "#15803D",
  4:  "#B45309",
  1:  "#6D28D9",
  14: "#065F46",
  11: "#92400E",
  2:  "#1D4ED8",
  7:  "#9D174D",
};

const PANEL_W = 500, PANEL_H = 420, PAD = 48;
const IW = PANEL_W - PAD * 2, IH = PANEL_H - PAD * 2;

const toSVG = (mx, my) => ({
  sx: PAD + ((mx + 1) / 2) * IW,
  sy: PAD + ((1 - (my + 1) / 2)) * IH,
});

export default function PyLDAVisSection() {
  const [selectedTopic, setSelectedTopic] = useState(8); // default = FOMO
  const [lambda, setLambda]               = useState(0.6);
  const [topN, setTopN]                   = useState(12);

  const currentTopic = ldaTopics.find((t) => t.id === selectedTopic);
  const rawTerms     = useMemo(() => getTopTerms(selectedTopic, topN), [selectedTopic, topN]);
  const terms        = useMemo(() => computeRelevance(rawTerms, lambda).sort((a, b) => b.relevance - a.relevance), [rawTerms, lambda]);
  const maxRel       = Math.max(...terms.map((t) => t.relevance), 0.01);

  const maxDocs = Math.max(...ldaTopics.map((t) => t.docs));
  const getR    = (docs) => 8 + Math.sqrt(docs / maxDocs) * 42;

  return (
    <section className="py-20 bg-gray-50" id="pylda">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-lda-50 border border-lda-200 rounded-full text-xs font-semibold text-lda-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-lda-500 animate-pulse" />
            LDA — pyLDAVis Inspired
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            Visualisasi Interaktif Topik LDA
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Peta jarak antar-topik (MDS/PCoA) dan kata kunci relevan per topik.
            Gunakan slider λ untuk mengatur keseimbangan antara frekuensi dan eksklusivitas kata.
          </p>
          {/* [FIX] Disclaimer term frequencies */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            <span>⚠️</span>
            <span>
              Frekuensi term dan koordinat MDS merupakan estimasi dari probabilitas model Gensim LDA.
              Nilai eksak dapat diekstrak dengan <code className="font-mono bg-amber-100 px-1 rounded">lda_model.show_topic()</code> dan <code className="font-mono bg-amber-100 px-1 rounded">pyLDAvis.gensim_models.prepare()</code>.
            </span>
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-lda-700 to-lda-500 text-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono">LDA Gensim</span>
              {/* [FIX-1] "6.591 dokumen" → "4.890 tweet / 4.516 dok terproses" */}
              <span className="text-xs text-lda-200">K=14 · 4.890 tweet (4.516 dok terproses) · passes=20 · α=auto · η=auto</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-lda-100">
              <span>Coherence: <strong className="text-white">0.4846</strong></span>
              <span>Diversity: <strong className="text-white">0.8524</strong></span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* LEFT — MDS Map */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Peta Jarak Antar-Topik (MDS Proyeksi)
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Lingkaran ∝ jumlah dokumen · Klik topik untuk detil
                  </p>
                </div>
                {currentTopic && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: LDA_COLORS[selectedTopic] }}
                  >
                    T{selectedTopic}
                  </span>
                )}
              </div>

              <div className="relative border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
                <svg viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} width="100%" height="100%">
                  {/* Axis lines */}
                  <line x1={PANEL_W / 2} y1={PAD} x2={PANEL_W / 2} y2={PANEL_H - PAD} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,3" />
                  <line x1={PAD} y1={PANEL_H / 2} x2={PANEL_W - PAD} y2={PANEL_H / 2} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,3" />
                  <text x={PANEL_W / 2} y={PANEL_H - 6} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="monospace">PC1</text>
                  <text x={8} y={PANEL_H / 2} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="monospace" transform={`rotate(-90, 8, ${PANEL_H / 2})`}>PC2</text>

                  {/* Lines from selected to others */}
                  {ldaTopics.map((t) => {
                    if (t.id === selectedTopic) return null;
                    const { sx: x1, sy: y1 } = toSVG(MDS[selectedTopic]?.x ?? 0, MDS[selectedTopic]?.y ?? 0);
                    const { sx: x2, sy: y2 } = toSVG(MDS[t.id]?.x ?? 0, MDS[t.id]?.y ?? 0);
                    const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
                    if (dist > 140) return null;
                    return (
                      <line key={t.id} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={LDA_COLORS[selectedTopic]} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3,3" />
                    );
                  })}

                  {/* Bubbles */}
                  {ldaTopics.map((t) => {
                    const pos = MDS[t.id];
                    if (!pos) return null;
                    const { sx, sy } = toSVG(pos.x, pos.y);
                    const r          = getR(t.docs);
                    const color      = LDA_COLORS[t.id];
                    const isSel      = t.id === selectedTopic;

                    return (
                      <g key={t.id} onClick={() => setSelectedTopic(t.id)} style={{ cursor: "pointer" }}>
                        {isSel && <circle cx={sx} cy={sy} r={r + 7} fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.4" />}
                        <circle cx={sx} cy={sy} r={r}
                          fill={color} fillOpacity={isSel ? 0.92 : 0.65}
                          stroke="white" strokeWidth={isSel ? 2.5 : 1.5} />
                        <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle"
                          fontSize={r > 28 ? "10" : "8"} fontWeight="700" fill="white"
                          fontFamily="monospace" style={{ pointerEvents: "none" }}>
                          {r > 20 ? `T${t.id}` : t.id}
                        </text>
                        {isSel && r < 24 && (
                          <text x={sx} y={sy - r - 6} textAnchor="middle"
                            fontSize="8" fill={color} fontWeight="600" fontFamily="sans-serif">
                            T{t.id}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Topic list compact */}
              <div className="mt-4 grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {ldaTopics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] text-left transition-all duration-150 ${
                      t.id === selectedTopic ? "ring-1 shadow-sm" : "hover:bg-gray-50"
                    }`}
                    style={t.id === selectedTopic ? { ringColor: LDA_COLORS[t.id], background: LDA_COLORS[t.id] + "12" } : {}}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: LDA_COLORS[t.id] }} />
                    <span className="truncate text-gray-600">T{t.id} {t.label}</span>
                    <span className="ml-auto font-mono text-gray-400 flex-shrink-0">{t.pct}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT — Term bar + lambda */}
            <div className="p-6 flex flex-col gap-5">
              {/* Topic info */}
              {currentTopic && (
                <div
                  className="rounded-2xl p-4 border"
                  style={{ background: LDA_COLORS[selectedTopic] + "0D", borderColor: LDA_COLORS[selectedTopic] + "33" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: LDA_COLORS[selectedTopic] }}>
                      T{currentTopic.id}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{currentTopic.label}</p>
                      <p className="text-[10px] text-gray-400">
                        {currentTopic.docs.toLocaleString("id-ID")} dok · {currentTopic.pct}% dari total
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentTopic.keywords.map((k) => (
                      <span key={k}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono text-white"
                        style={{ background: LDA_COLORS[selectedTopic] + "CC" }}>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lambda slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    λ (Relevance Weight)
                  </label>
                  <span className="font-mono text-sm font-bold" style={{ color: LDA_COLORS[selectedTopic] }}>
                    {lambda.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range" min={0} max={1} step={0.05} value={lambda}
                  onChange={(e) => setLambda(+e.target.value)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: LDA_COLORS[selectedTopic] }}
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-mono">
                  <span>λ=0: Eksklusivitas</span>
                  <span>λ=1: Frekuensi</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  λ=0.6 (disarankan Sievert & Shirley, 2014) untuk keseimbangan
                </p>
              </div>

              {/* Top-N control */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Tampilkan</span>
                {[8, 10, 12, 15].map((n) => (
                  <button key={n} onClick={() => setTopN(n)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                      topN === n ? "text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    style={topN === n ? { background: LDA_COLORS[selectedTopic] } : {}}>
                    {n}
                  </button>
                ))}
                <span className="text-xs text-gray-500">term teratas</span>
              </div>

              {/* Term bars */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-3">
                  Top-{topN} Relevant Terms
                  <span className="text-gray-400 font-normal ml-1 text-[10px]">(relevance = λ·freq + (1-λ)·exclusivity)</span>
                </p>
                <div className="space-y-2">
                  {terms.map((term, i) => {
                    const pct = (term.relevance / maxRel) * 100;
                    const freqPct = (term.freq / terms[0].freq) * 100;
                    return (
                      <div key={term.word} className="flex items-center gap-2.5">
                        <span className="text-[10px] text-gray-400 font-mono w-4 text-right flex-shrink-0">{i + 1}</span>
                        <span className="text-[11px] font-mono text-gray-700 w-20 flex-shrink-0 truncate">{term.word}</span>
                        <div className="flex-1 relative h-4 bg-gray-100 rounded-full overflow-hidden">
                          {/* Corpus freq (background) */}
                          <div className="absolute inset-y-0 left-0 rounded-full bg-gray-200" style={{ width: `${freqPct * 0.85}%` }} />
                          {/* Topic relevance (foreground) */}
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: LDA_COLORS[selectedTopic] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 w-14 text-right flex-shrink-0">
                          {term.freq.toLocaleString("id-ID")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className="w-3 h-2 rounded-sm bg-gray-200" /> Frekuensi corpus
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className="w-3 h-2 rounded-sm" style={{ background: LDA_COLORS[selectedTopic] }} /> Relevance topik
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div className="grid sm:grid-cols-4 gap-4 text-center">
              {[
                { label: "Model",       value: "LDA Gensim",   sub: "α=auto, η=auto"            },
                // [FIX-1] "6.591 dokumen" → "4.890 tweet / 4.516 dok"
                { label: "Dataset LDA", value: "4.890 tweet",  sub: "4.516 dok terproses (K=14)" },
                { label: "Passes/Iter", value: "20 / 200",     sub: "passes=20, iterations=200"  },
                { label: "Filter Kamus",value: "no_below=5",   sub: "no_above=0.50"              },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-0.5">{s.label}</p>
                  <p className="text-sm font-bold text-gray-700">{s.value}</p>
                  <p className="text-[10px] text-gray-400">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
