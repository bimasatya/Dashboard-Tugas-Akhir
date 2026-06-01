import { motion } from "framer-motion";
import { conclusions, grandQuote } from "../data/research";

const iconEmojis = {
  award: "🏅",
  "shield-check": "🛡️",
  "arrows-join": "🔀",
  "trending-up": "📈",
};

export default function ConclusionSection() {
  return (
    <section className="py-24 bg-white" id="conclusion">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-gray-400 uppercase">
            Kesimpulan
          </span>
          <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-3">
            Poin-Poin Utama Penelitian
          </h2>
        </motion.div>

        {/* Conclusion cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {conclusions.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 flex gap-5 hover:shadow-card-lg transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: c.color + "15" }}
              >
                {iconEmojis[c.icon]}
              </div>
              <div>
                <h3
                  className="font-display text-base font-bold mb-2"
                  style={{ color: c.color }}
                >
                  {c.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Research questions answered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-3xl border border-gray-200 p-8 mb-16"
        >
          <h3 className="font-display text-xl font-semibold text-gray-800 mb-6 text-center">
            Jawaban Rumusan Masalah
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                no: "RM 1",
                q: "Topik utama percakapan lari?",
                a: "Empat tema dominan: FOMO/sosial, perlengkapan olahraga, event & komunitas, dan latihan fisik. FOMO menjadi yang terkuat (LDA: 28.63%; BERTopic C_v=1.0).",
                color: "#2563EB",
              },
              {
                no: "RM 2",
                q: "Efektivitas LDA vs BERTopic?",
                a: "BERTopic unggul secara kuantitatif (C_v lebih tinggi), namun LDA lebih andal untuk distribusi, kemudahan implementasi, dan interpretabilitas. Keduanya saling melengkapi.",
                color: "#EA580C",
              },
              {
                no: "RM 3",
                q: "Implementasi visualisasi?",
                a: "Hasil topic modeling diimplementasikan ke dalam infografis/poster yang menyederhanakan temuan menjadi sajian komunikatif untuk komunitas lari, penyelenggara event, dan pengembang aplikasi.",
                color: "#7C3AED",
              },
            ].map((rm, i) => (
              <motion.div
                key={rm.no}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card"
              >
                <div
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-full inline-block mb-3"
                  style={{ backgroundColor: rm.color + "15", color: rm.color }}
                >
                  {rm.no}
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-2">{rm.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{rm.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-display text-xl font-semibold text-gray-800 mb-6 text-center">
            Kontribusi Penelitian
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                no: "01",
                title: "Peta Percakapan Komunitas Lari Indonesia",
                body: "Referensi untuk komunitas lari, penyelenggara event, dan pengembang aplikasi olahraga berbasis data nyata dari media sosial.",
                color: "#2563EB",
              },
              {
                no: "02",
                title: "Perbandingan Empiris LDA vs BERTopic",
                body: "Pada bahasa Indonesia informal domain olahraga — domain dan bahasa yang masih jarang diteliti dalam literature topic modeling.",
                color: "#EA580C",
              },
              {
                no: "03",
                title: "Refleksi Metodologis Topic Modeling",
                body: "Keterbatasan Coherence Score, perilaku outlier BERTopic pada teks pendek, dan sensitivitas preprocessing — referensi untuk peneliti berikutnya.",
                color: "#7C3AED",
              },
            ].map((c, i) => (
              <motion.div
                key={c.no}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-lg transition-all duration-300"
              >
                <div
                  className="font-display text-4xl font-black mb-3 opacity-20"
                  style={{ color: c.color }}
                >
                  {c.no}
                </div>
                <h4
                  className="font-display text-sm font-bold mb-2"
                  style={{ color: c.color }}
                >
                  {c.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Grand Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 md:p-14 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-lda-600 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-bert-600 rounded-full opacity-10 translate-x-1/2 translate-y-1/2" />

          <div className="relative">
            <div className="text-5xl mb-4 opacity-40">"</div>
            <blockquote className="font-display text-xl md:text-2xl font-semibold text-white leading-relaxed mb-6 max-w-4xl mx-auto">
              {grandQuote}
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-white/20" />
              <p className="text-sm text-gray-400 font-medium">
                Kesimpulan Penelitian
              </p>
              <div className="h-px w-16 bg-white/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
