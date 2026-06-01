import { motion } from "framer-motion";
import { fomoData } from "../data/research";

const bubbleSizes = {
  xl: "text-lg font-bold px-5 py-2.5",
  lg: "text-base font-semibold px-4 py-2",
  md: "text-sm font-medium px-3.5 py-1.5",
  sm: "text-xs font-medium px-3 py-1.5",
};

export default function FOMOSection() {
  const { lda, bertopic, bubbles, tweetExamples } = fomoData;

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-rose-50 to-fuchsia-50" id="fomo">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-red-400 uppercase">
            Temuan Utama
          </span>
          <h2 className="font-display text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
            Fenomena FOMO Menjadi
            <br />
            <span className="text-gradient-fomo">Topik Paling Dominan</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fear of Missing Out terbukti konsisten sebagai fenomena sosial terkuat —
            ditemukan secara independen oleh kedua model. Tekanan sosial menjadi pendorong
            utama partisipasi lari di media sosial, bukan semata motivasi kesehatan.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* LDA FOMO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 border-2 border-lda-200 shadow-lda relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-lda-100 text-lda-700 text-xs font-mono rounded-full border border-lda-200">
                LDA · Topik 8
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-lda-50 rounded-full" />

            <div className="relative">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                Fenomena FOMO dalam Olahraga
              </p>
              <div className="font-display text-7xl font-extrabold text-lda-600 leading-none mb-2">
                {lda.pct}
                <span className="text-4xl">%</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                dari total dokumen LDA ({lda.docs.toLocaleString("id-ID")} tweet)
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🥇</span>
                <span className="text-sm font-semibold text-gray-700">
                  Topik terbesar di keseluruhan dataset LDA
                </span>
              </div>

              {/* Keywords */}
              <div className="mt-5 flex flex-wrap gap-2">
                {lda.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 text-xs rounded-full bg-lda-50 text-lda-700 border border-lda-200 font-medium font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* BERTopic FOMO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border-2 border-bert-200 shadow-bert relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-bert-100 text-bert-700 text-xs font-mono rounded-full border border-bert-200">
                BERTopic · Topik 1
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-bert-50 rounded-full" />

            <div className="relative">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                Fenomena FOMO Lari
              </p>
              <div className="font-display text-7xl font-extrabold text-bert-600 leading-none mb-2">
                1.00
                <span className="text-4xl"> C_v</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Coherence Score sempurna ({bertopic.docs.toLocaleString("id-ID")} dokumen)
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">⭐</span>
                <span className="text-sm font-semibold text-gray-700">
                  Topik paling konsisten secara semantik
                </span>
              </div>

              {/* Keywords */}
              <div className="mt-5 flex flex-wrap gap-2">
                {bertopic.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 text-xs rounded-full bg-bert-50 text-bert-700 border border-bert-200 font-medium font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Validation note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-red-200 p-5 mb-12 flex items-start gap-4 shadow-card"
        >
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🔬</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">
              Validasi Silang Dua Model
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Topik FOMO teridentifikasi secara independen oleh kedua model (LDA T8 dan BERTopic T1),
              memperkuat validitas temuan bahwa tekanan sosial merupakan fenomena nyata dalam
              komunitas pelari digital Indonesia. Temuan ini konsisten meski menggunakan pendekatan
              yang sangat berbeda — probabilistik vs semantik.
            </p>
          </div>
        </motion.div>

        {/* Keyword Bubbles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="font-display text-xl font-semibold text-gray-700 mb-8">
            Kata Kunci Ekosistem FOMO
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {bubbles.map((b, i) => (
              <motion.span
                key={b.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`
                  ${bubbleSizes[b.size]}
                  rounded-full cursor-default border transition-all duration-200
                  ${
                    b.size === "xl"
                      ? "bg-fomo-600 text-white border-fomo-700 shadow-fomo"
                      : b.size === "lg"
                      ? "bg-red-100 text-fomo-800 border-red-200"
                      : b.size === "md"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-pink-50 text-pink-700 border-pink-200"
                  }
                `}
              >
                {b.text}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Sample tweets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {tweetExamples.map((tweet, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fomo-600 to-bert-600 flex items-center justify-center text-white text-sm font-bold">
                  𝕏
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-500">{tweet.user}</p>
                  <p className="text-[10px] text-gray-400">X / Twitter</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{tweet.text}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-fomo-50 text-fomo-600 border border-red-100 font-medium">
                  #fomo
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  #larimulu
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
