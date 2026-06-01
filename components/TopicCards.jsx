import { motion } from "framer-motion";
import { topicCards } from "../data/research";

const iconMap = {
  "mood-nervous": "😰",
  shoe: "👟",
  trophy: "🏆",
  barbell: "🏋️",
  bandage: "🩹",
  heart: "❤️",
};

export default function TopicCards() {
  return (
    <section className="py-20 bg-gray-50" id="topic-cards">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-gray-400 uppercase">
            Topik Utama
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            Tema Dominan dalam Percakapan Lari
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Empat tema besar konsisten teridentifikasi oleh kedua model, ditambah
            temuan unik dari BERTopic.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl border border-gray-100 shadow-card hover:shadow-card-lg transition-all duration-300 overflow-hidden"
            >
              {/* Color stripe */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: card.color }}
              />

              <div className="p-6">
                {/* Icon + Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: card.colorLight }}
                    >
                      {iconMap[card.icon] || "📌"}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-gray-900 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">{card.titleEn}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.description}</p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {card.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-full border font-medium"
                      style={{
                        backgroundColor: card.colorLight,
                        borderColor: card.color + "40",
                        color: card.color,
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Model comparison mini */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-lda-600 uppercase tracking-wide mb-1">LDA</p>
                    {card.lda.docs ? (
                      <>
                        <p className="font-display text-sm font-bold text-lda-700">
                          {card.lda.docs.toLocaleString("id-ID")} dok
                        </p>
                        <p className="text-[10px] text-gray-400">{card.lda.pct} dari total</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">—</p>
                    )}
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <p className="text-[10px] font-mono text-bert-600 uppercase tracking-wide mb-1">BERTopic</p>
                    <p className="font-display text-sm font-bold text-bert-700">
                      C_v {card.bertopic.coherence}
                    </p>
                    <p className="text-[10px] text-gray-400">{card.bertopic.docs} dokumen</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Four domains summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-card p-8"
        >
          <h3 className="font-display text-lg font-semibold text-gray-800 mb-6 text-center">
            Empat Domain Percakapan Konsisten (Kedua Model)
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Fenomena Sosial",
                sub: "FOMO & tekanan sosial",
                icon: "😰",
                lda: "T8 — 28.63%",
                bert: "T1 — C_v=1.0",
                color: "#DC2626",
                bg: "#FEF2F2",
              },
              {
                label: "Perlengkapan & Produk",
                sub: "Sepatu running & brand",
                icon: "👟",
                lda: "T1, T3, T4, T5",
                bert: "T3, T7, T8",
                color: "#2563EB",
                bg: "#EFF6FF",
              },
              {
                label: "Event & Komunitas",
                sub: "Lomba lari & komunitas",
                icon: "🏆",
                lda: "T9, T14",
                bert: "T2, T14",
                color: "#7C3AED",
                bg: "#F5F3FF",
              },
              {
                label: "Latihan Fisik",
                sub: "Training & kebugaran",
                icon: "🏋️",
                lda: "T12, T13",
                bert: "T5, T12",
                color: "#059669",
                bg: "#ECFDF5",
              },
            ].map((d) => (
              <div
                key={d.label}
                className="rounded-2xl p-5 border text-center"
                style={{ backgroundColor: d.bg, borderColor: d.color + "30" }}
              >
                <div className="text-3xl mb-2">{d.icon}</div>
                <h4 className="font-display text-sm font-bold mb-1" style={{ color: d.color }}>
                  {d.label}
                </h4>
                <p className="text-xs text-gray-500 mb-3">{d.sub}</p>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono bg-white/70 rounded-full px-2 py-0.5 text-lda-700">
                    LDA: {d.lda}
                  </p>
                  <p className="text-[10px] font-mono bg-white/70 rounded-full px-2 py-0.5 text-bert-700">
                    BERTopic: {d.bert}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
