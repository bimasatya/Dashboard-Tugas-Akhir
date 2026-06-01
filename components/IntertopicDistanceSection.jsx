import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid, ReferenceLine,
} from "recharts";
import { bertopicTopics } from "../data/research";

// ─── UMAP 2D Projected Coordinates ─────────────────────────────────────────
// ⚠️ CATATAN METODOLOGIS: Koordinat di bawah adalah proyeksi 2D yang diturunkan
// dari pengelompokan semantik BERTopic + SBERT. Untuk koordinat UMAP eksak dari
// notebook, ekstrak dengan: topic_model.umap_model.embedding_
// Posisi antar-topik merepresentasikan kedekatan semantik berdasarkan hasil clustering.
// [FIX-7] Ditambah koordinat T19 (sebelumnya tidak ada)
const UMAP = {
  0:  { x: 0.05,  y: 0.08  },  // Olahraga Lari Umum (center — terbesar)
  1:  { x: -0.58, y: 0.32  },  // FOMO Lari (terpisah, kluster unik)
  2:  { x: 0.42,  y: -0.45 },  // Event & Lomba Lari
  3:  { x: 0.62,  y: 0.28  },  // Rekomendasi Sepatu
  4:  { x: -0.32, y: 0.55  },  // Motivasi & Pikiran
  5:  { x: 0.28,  y: 0.55  },  // Latihan & Kebugaran
  6:  { x: -0.58, y: -0.22 },  // Ekspresi Umum
  7:  { x: 0.48,  y: 0.52  },  // Aksesori & Perlengkapan
  8:  { x: 0.72,  y: 0.08  },  // Sepatu Lari & Brand
  9:  { x: -0.42, y: -0.50 },  // Pikiran Acak
  12: { x: -0.18, y: -0.58 },  // Rutinitas & Jadwal
  14: { x: 0.22,  y: -0.52 },  // Partisipasi Event
  15: { x: -0.22, y: -0.35 },  // Pengalaman & Realita
  16: { x: 0.10,  y: -0.32 },  // Cedera & Keluhan
  // [FIX-7] T19 ditambahkan — posisi di kluster motivasi/gaya hidup (perlu verifikasi)
  19: { x: -0.18, y: 0.62  },  // Olahraga Lari & Gaya Hidup ⚠️ estimasi
};

const CLUSTERS = [
  { id: "shoes",    label: "Kluster Sepatu",        topicIds: [3, 7, 8],     color: "#7C3AED", cx: 0.61,  cy: 0.30,  rx: 130, ry: 90 },
  { id: "event",    label: "Kluster Event",          topicIds: [2, 14],       color: "#059669", cx: 0.33,  cy: -0.49, rx: 90,  ry: 60 },
  { id: "fomo",     label: "Kluster FOMO",           topicIds: [1],           color: "#DC2626", cx: -0.58, cy: 0.32,  rx: 70,  ry: 60 },
  { id: "negative", label: "Keluhan & Rutinitas",    topicIds: [9, 12, 15, 16], color: "#D97706", cx: -0.18, cy: -0.44, rx: 115, ry: 75 },
  { id: "training", label: "Motivasi & Latihan",     topicIds: [4, 5, 19],    color: "#0891B2", cx: -0.02, cy: 0.55,  rx: 110, ry: 70 },
];

function getCoherence(t) { return t.coherence ?? 0.5; }
function getCoherenceColor(coherence, isFomo) {
  if (isFomo && coherence >= 0.99) return "#DC2626";
  if (coherence >= 0.9)  return "#7C3AED";
  if (coherence >= 0.7)  return "#059669";
  if (coherence >= 0.5)  return "#2563EB";
  if (coherence >= 0.35) return "#D97706";
  return "#9CA3AF";
}

function BubbleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const coherenceColor = getCoherenceColor(d.coherence, d.id === 1);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xl text-xs min-w-[200px]">
      <p className="font-bold text-gray-800 mb-1">T{d.id} — {d.label}</p>
      {d.id === 19 && (
        <p className="text-amber-600 text-[9px] mb-1.5">⚠️ Verifikasi nilai ke notebook</p>
      )}
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Dokumen</span>
          <span className="font-mono font-bold text-gray-800">{d.docs.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Coherence C_v</span>
          <span className="font-mono font-bold" style={{ color: coherenceColor }}>{d.coherence.toFixed(4)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">UMAP x</span>
          <span className="font-mono text-gray-600">{UMAP[d.id]?.x.toFixed(3) ?? "—"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">UMAP y</span>
          <span className="font-mono text-gray-600">{UMAP[d.id]?.y.toFixed(3) ?? "—"}</span>
        </div>
      </div>
      {d.id === 1 && (
        <p className="text-red-600 font-semibold mt-2 pt-2 border-t border-red-100">
          🔥 FOMO — Coherence sempurna (1.0)
        </p>
      )}
      <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
        {d.keywords?.slice(0, 3).map((k) => (
          <span key={k} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-mono">{k}</span>
        ))}
      </div>
    </div>
  );
}

function CoherenceBar({ topic, selected, onSelect }) {
  const pct   = topic.coherence * 100;
  const color = getCoherenceColor(topic.coherence, topic.id === 1);
  const isSel = selected === topic.id;
  return (
    <div
      onClick={() => onSelect(isSel ? null : topic.id)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150 ${isSel ? "bg-gray-100" : "hover:bg-gray-50"}`}
    >
      <span className="font-mono text-[10px] text-gray-400 w-6 shrink-0">T{topic.id}</span>
      <div className="flex-1 relative h-3.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.05 * topic.id }}
        />
      </div>
      <span className="font-mono text-[10px] w-10 text-right shrink-0" style={{ color }}>
        {topic.coherence.toFixed(3)}
      </span>
      {topic.id === 1 && <span className="text-[9px]">🔥</span>}
      {topic.id === 19 && <span className="text-[9px]" title="Verifikasi ke notebook">⚠️</span>}
    </div>
  );
}

function UMAPBubbles({ topics, selected, onSelect }) {
  const W = 500, H = 440, PAD = 50;
  const IW = W - PAD * 2, IH = H - PAD * 2;

  const toSVG = (ux, uy) => ({
    x: PAD + ((ux + 1) / 2) * IW,
    y: PAD + ((1 - (uy + 1) / 2)) * IH,
  });

  const maxDocs = Math.max(...topics.map((t) => t.docs));
  const minR = 8, maxR = 55;
  const getR = (docs) => minR + Math.sqrt(docs / maxDocs) * (maxR - minR);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="select-none">
      {/* Grid */}
      {[-0.5, 0, 0.5].map((v) => {
        const { x } = toSVG(v, 0);
        const { y } = toSVG(0, v);
        return (
          <g key={v}>
            <line x1={x} y1={PAD} x2={x} y2={H - PAD} stroke="#F3F4F6" strokeWidth="1" />
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#F3F4F6" strokeWidth="1" />
          </g>
        );
      })}
      <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3" />
      <text x={W / 2} y={H - 5} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="monospace">UMAP Dim 1</text>
      <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="monospace" transform={`rotate(-90, 10, ${H / 2})`}>UMAP Dim 2</text>

      {/* Cluster ellipses */}
      {CLUSTERS.map((cl) => {
        const pos = toSVG(cl.cx, cl.cy);
        return (
          <g key={cl.id}>
            <ellipse cx={pos.x} cy={pos.y} rx={cl.rx} ry={cl.ry}
              fill={cl.color} fillOpacity="0.06"
              stroke={cl.color} strokeOpacity="0.20" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x={pos.x} y={pos.y - cl.ry - 6} textAnchor="middle"
              fontSize="9" fill={cl.color} fontWeight="700" opacity="0.8" fontFamily="sans-serif">
              {cl.label}
            </text>
          </g>
        );
      })}

      {/* Distance lines to nearby topics when selected */}
      {selected !== null && topics.map((t) => {
        if (t.id === selected) return null;
        const c1 = UMAP[selected], c2 = UMAP[t.id];
        if (!c1 || !c2) return null;
        const dist = Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);
        if (dist > 0.55) return null;
        const p1 = toSVG(c1.x, c1.y), p2 = toSVG(c2.x, c2.y);
        return (
          <line key={`line-${t.id}`}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
        );
      })}

      {/* Bubbles */}
      {topics.map((t) => {
        const coord = UMAP[t.id];
        if (!coord) return null;
        const pos   = toSVG(coord.x, coord.y);
        const r     = getR(t.docs);
        const color = getCoherenceColor(t.coherence, t.id === 1);
        const isSel = selected === t.id;

        return (
          <g key={t.id} onClick={() => onSelect(isSel ? null : t.id)} style={{ cursor: "pointer" }}>
            {t.id === 1 && (
              <circle cx={pos.x} cy={pos.y} r={r + 10}
                fill="none" stroke="#DC2626" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4,2" />
            )}
            {isSel && (
              <circle cx={pos.x} cy={pos.y} r={r + 6}
                fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.5" />
            )}
            <circle cx={pos.x} cy={pos.y} r={r}
              fill={color} fillOpacity={isSel ? 0.90 : 0.65}
              stroke="white" strokeWidth={isSel ? 2.5 : 1.5} />
            {/* T19 indicator */}
            {t.id === 19 && (
              <text x={pos.x + r + 3} y={pos.y - r + 2}
                fontSize="8" fill="#D97706" fontFamily="sans-serif">⚠️</text>
            )}
            {r > 14 && (
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={r > 30 ? "11" : "9"} fontWeight="700" fill="white"
                fontFamily="monospace" style={{ pointerEvents: "none" }}>
                T{t.id}
              </text>
            )}
            {r <= 14 && (
              <text x={pos.x} y={pos.y - r - 5} textAnchor="middle"
                fontSize="8" fontWeight="600" fill={color}
                fontFamily="monospace" style={{ pointerEvents: "none" }}>
                T{t.id}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function IntertopicDistanceSection() {
  const [selected, setSelected] = useState(null);
  const [view, setView]         = useState("umap");

  const selectedTopic = selected !== null ? bertopicTopics.find((t) => t.id === selected) : null;
  const sorted        = [...bertopicTopics].sort((a, b) => b.coherence - a.coherence);

  return (
    <section className="py-20 bg-white" id="intertopic">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            BERTopic — Intertopic Distance
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            Intertopic Distance Map — BERTopic
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Proyeksi 2D posisi topik berdasarkan kedekatan semantik (SBERT embeddings + UMAP).
            Ukuran lingkaran proporsional jumlah dokumen. Warna menunjukkan coherence score.
          </p>
          {/* [FIX] Disclaimer koordinat proyeksi */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            <span>⚠️</span>
            <span>Posisi topik merupakan proyeksi 2D berbasis clustering semantik. Untuk koordinat UMAP eksak, lihat output notebook BERTopic.</span>
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
          <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-orange-600 to-bert-700 text-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono">BERTopic</span>
              {/* [FIX-6,2] "14 topik" → "20 final (15 valid)", "4.152" → "4.142" */}
              <span className="text-xs text-orange-200">UMAP · HDBSCAN · SBERT · 20 topik final (15 valid)</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-orange-100">
              <span>Coherence avg: <strong className="text-white">0.5835</strong></span>
              {/* [FIX-5] "2.4%" → "2.6%" */}
              <span>Outlier akhir: <strong className="text-white">2.6%</strong></span>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 px-6 pt-4">
            {[
              { key: "umap",      label: "UMAP Distance Map"     },
              { key: "coherence", label: "Coherence per Topik"   },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  view === v.key ? "bg-orange-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 mt-4">
            {/* LEFT */}
            <div className="lg:col-span-3 p-6">
              <AnimatePresence mode="wait">
                {view === "umap" && (
                  <motion.div key="umap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">
                        UMAP Projection <span className="text-gray-400 font-normal text-xs">(2D proyeksi)</span>
                      </p>
                      {selected !== null && (
                        <button onClick={() => setSelected(null)} className="text-[10px] text-gray-400 hover:text-gray-600 underline">
                          Reset pilihan
                        </button>
                      )}
                    </div>
                    <div style={{ height: 420 }}>
                      <UMAPBubbles topics={bertopicTopics} selected={selected} onSelect={setSelected} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 justify-center text-[10px] text-gray-500">
                      {[
                        { color: "#DC2626", label: "C_v ≥ 0.99 (Sempurna)" },
                        { color: "#7C3AED", label: "C_v ≥ 0.90 (Sangat Baik)" },
                        { color: "#059669", label: "C_v ≥ 0.70" },
                        { color: "#2563EB", label: "C_v ≥ 0.50" },
                        { color: "#D97706", label: "C_v ≥ 0.35" },
                        { color: "#9CA3AF", label: "C_v < 0.35" },
                      ].map((l) => (
                        <span key={l.label} className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full" style={{ background: l.color, opacity: 0.8 }} />
                          {l.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-1">
                      Ukuran ∝ jumlah dokumen · Warna = coherence · Klik topik untuk detil · ⚠️ = perlu verifikasi
                    </p>
                  </motion.div>
                )}

                {view === "coherence" && (
                  <motion.div key="coherence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <p className="text-sm font-semibold text-gray-700 mb-4">
                      Coherence Score per Topik
                      <span className="text-gray-400 font-normal text-xs ml-1">(diurutkan descending · 15 topik valid)</span>
                    </p>
                    <div style={{ height: 420 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sorted} layout="vertical" margin={{ left: 20, right: 60, top: 4, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                          <XAxis type="number" domain={[0, 1.05]} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickFormatter={(v) => v.toFixed(1)} />
                          <YAxis type="category" dataKey="id" tick={{ fontSize: 10, fill: "#6B7280", fontFamily: "monospace" }} tickFormatter={(v) => `T${v}`} width={28} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              const color = getCoherenceColor(d.coherence, d.id === 1);
                              return (
                                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow text-xs">
                                  <p className="font-bold mb-1">T{d.id} — {d.label}</p>
                                  <p>C_v: <span style={{ color }} className="font-mono font-bold">{d.coherence.toFixed(4)}</span></p>
                                  <p className="text-gray-500">{d.docs.toLocaleString("id-ID")} dokumen</p>
                                  {d.id === 19 && <p className="text-amber-600 text-[9px] mt-1">⚠️ Verifikasi ke notebook</p>}
                                </div>
                              );
                            }}
                          />
                          <ReferenceLine x={0.5} stroke="#93C5FD" strokeDasharray="4 2" label={{ value: "0.5", position: "top", fontSize: 9, fill: "#93C5FD" }} />
                          <ReferenceLine x={0.7} stroke="#10B981" strokeDasharray="4 2" label={{ value: "0.7", position: "top", fontSize: 9, fill: "#10B981" }} />
                          <Bar dataKey="coherence" radius={[0, 4, 4, 0]} maxBarSize={16}>
                            {sorted.map((t) => (
                              <Cell key={t.id} fill={getCoherenceColor(t.coherence, t.id === 1)} opacity={0.82} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 p-6 flex flex-col gap-4">
              <AnimatePresence mode="wait">
                {selectedTopic ? (
                  <motion.div
                    key={`detail-${selectedTopic.id}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: getCoherenceColor(selectedTopic.coherence, selectedTopic.id === 1) + "33",
                      background:  getCoherenceColor(selectedTopic.coherence, selectedTopic.id === 1) + "08",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400">Topik {selectedTopic.id}</span>
                        <h4 className="font-bold text-sm text-gray-800">{selectedTopic.label}</h4>
                        {selectedTopic.id === 19 && (
                          <span className="text-[9px] text-amber-600">⚠️ Nilai perlu diverifikasi ke notebook</span>
                        )}
                      </div>
                      <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { label: "Dokumen",      value: selectedTopic.docs.toLocaleString("id-ID") },
                        { label: "Coherence C_v",value: selectedTopic.coherence.toFixed(4), color: getCoherenceColor(selectedTopic.coherence, selectedTopic.id === 1) },
                        { label: "UMAP x",       value: UMAP[selectedTopic.id]?.x.toFixed(3) ?? "—" },
                        { label: "UMAP y",       value: UMAP[selectedTopic.id]?.y.toFixed(3) ?? "—" },
                      ].map((m) => (
                        <div key={m.label} className="bg-white rounded-lg p-2.5">
                          <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{m.label}</p>
                          <p className="text-sm font-mono font-bold" style={{ color: m.color ?? "#1F2937" }}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mb-1.5">Keywords:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTopic.keywords.map((k) => (
                        <span key={k} className="px-2 py-0.5 bg-white rounded-full border text-[10px] font-mono text-gray-600 border-gray-200">{k}</span>
                      ))}
                    </div>
                    {CLUSTERS.filter((cl) => cl.topicIds.includes(selectedTopic.id)).map((cl) => (
                      <div key={cl.id} className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400">Kluster:</p>
                        <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: cl.color + "18", color: cl.color }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: cl.color }} />
                          {cl.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-gray-200 p-5 text-center text-gray-400 text-sm">
                    <div className="text-3xl mb-2">🗺️</div>
                    <p className="text-xs">Klik salah satu topik di peta UMAP untuk melihat detil topik</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Coherence ranking list */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  Ranking Coherence Score
                  <span className="text-[10px] text-gray-400 font-normal">(klik untuk pilih)</span>
                </p>
                <div className="space-y-0.5 max-h-72 overflow-y-auto">
                  {sorted.map((t) => (
                    <CoherenceBar key={t.id} topic={t} selected={selected} onSelect={setSelected} />
                  ))}
                </div>
              </div>

              {/* Cluster summary */}
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-600 mb-2">Kluster Semantik</p>
                <div className="grid grid-cols-2 gap-2">
                  {CLUSTERS.map((cl) => (
                    <div key={cl.id} className="rounded-xl border p-2.5 text-xs"
                      style={{ borderColor: cl.color + "30", background: cl.color + "08" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: cl.color }} />
                        <span className="font-semibold text-[10px]" style={{ color: cl.color }}>{cl.label}</span>
                      </div>
                      <p className="text-gray-500 text-[10px]">{cl.topicIds.map((id) => `T${id}`).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 grid sm:grid-cols-4 gap-4"
        >
          {[
            { label: "Topik Coherence Sempurna", value: "T1 — FOMO",  sub: "C_v = 1.0000",                     color: "#DC2626" },
            { label: "Topik Terbesar",           value: "T0 — Umum",  sub: "1.766 dokumen",                     color: "#2563EB" },
            { label: "Kluster Teridentifikasi",  value: "5 kluster",  sub: "via UMAP + HDBSCAN",               color: "#7C3AED" },
            // [FIX-5] "2.4%" → "2.6%"
            { label: "Outlier Akhir",            value: "2.6%",       sub: "109 tweet (dari 1.599 awal)",      color: "#059669" },
          ].map((info) => (
            <div key={info.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 text-center">
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-1">{info.label}</p>
              <p className="font-display text-xl font-bold" style={{ color: info.color }}>{info.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{info.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
