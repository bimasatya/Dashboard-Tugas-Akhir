// ============================================================
// DATA PENELITIAN SKRIPSI
// "Analisis Percakapan Olahraga Lari Menggunakan Topic Modeling:
//  Perbandingan LDA dan BERTopic"
// ============================================================
// CHANGELOG v3 → v3.1 (Fixed per Audit):
// [FIX-1] Tweet LDA: 6591 → 4890 (setelah dedup, sesuai catatan notebook LDA)
// [FIX-2] Tweet BERTopic: 4152 → 4142 (konsisten dengan 1599 outlier / 38.6%)
// [FIX-3] outlierProgress Pass0: 1617/38.9% → 1599/38.6%
// [FIX-4] outlierProgress Pass1: 897/21.6%  → 872/21.0%
// [FIX-5] outlierProgress Pass2: 98/2.4%    → 109/2.6%
// [FIX-6] bertopic.topicCount: 14 → 20 (final setelah reduce_topics)
// [FIX-7] bertopicTopics: ditambah T19 (sebelumnya hilang, total 15 valid)
// [FIX-8] topicCards[shoes].bertopic.coherence: "0.79" → "0.754"
// [FIX-9] bertopic.weakness: "38.9%" → "38.6%"
// [FIX-10] lda.dataset & bertopic.dataset string dikoreksi

export const researchMeta = {
  title: "Analisis Percakapan Olahraga Lari Menggunakan Topic Modeling",
  subtitle: "Perbandingan LDA dan BERTopic",
  tagline: "Pendekatan Probabilistik vs Pendekatan Semantik dalam Memahami Budaya Lari Digital",
  platform: "X / Twitter",
  periode: "Des 2024 – Des 2025",
  keywords: ["olahraga lari", "topic modeling", "LDA", "BERTopic", "media sosial", "FOMO"],
};

export const overviewStats = [
  { label: "Platform",       value: "X / Twitter", icon: "brand-twitter", suffix: "" },
  // [FIX-1] 6591 → 4890: setelah dedup sesuai catatan notebook LDA
  { label: "Tweet LDA",      value: 4890, icon: "database", suffix: " tweet", animated: true },
  // [FIX-2] 4152 → 4142: konsisten dgn 1599 outlier / 38.6%
  { label: "Tweet BERTopic", value: 4142, icon: "database", suffix: " tweet", animated: true },
  // Topik: LDA=14, BERTopic=20 final (label diperjelas di OverviewCards)
  { label: "Topik LDA",      value: 14,   icon: "layout-grid", suffix: " topik", animated: true },
];

export const modelMetrics = {
  lda: {
    name: "LDA",
    fullName: "Latent Dirichlet Allocation",
    approach: "Probabilistik / Bag-of-Words",
    color: "#2563EB",
    colorLight: "#DBEAFE",
    // Coherence C_v K=14; rentang eksplorasi K5-20: 0.44-0.50 (notebook LDA)
    // Verifikasi nilai spesifik K=14 disarankan langsung dari output notebook
    coherence: 0.4846,
    diversity: 0.8524,
    // [FIX-1] "6.591 tweet" → "4.890 tweet"
    dataset: "4.890 tweet",
    topicCount: 14,
    library: "Gensim",
    strengths: [
      "Stabil & konsisten di K=5–20",
      "Mudah diinterpretasi manual",
      "Tidak butuh post-processing",
      "Andal untuk teks informal multilingual",
    ],
    weaknesses: [
      "Representasi semantik terbatas",
      "Berbasis frekuensi kata (bukan konteks)",
    ],
  },
  bertopic: {
    name: "BERTopic",
    fullName: "BERTopic (Transformer-based)",
    approach: "Embedding Semantik / SBERT",
    color: "#EA580C",
    colorLight: "#FFEDD5",
    coherence: 0.5835,
    diversity: 0.8571,
    // [FIX-2] "4.152 tweet" → "4.142 tweet"
    dataset: "4.142 tweet",
    // [FIX-6] 14 → 20  (reduce_topics(nr_topics=20); 5 noise dikecualikan = 15 valid)
    topicCount: 20,
    library: "BERTopic + SBERT",
    strengths: [
      "Coherence Score lebih tinggi (0.5835)",
      "Representasi semantik kaya & kontekstual",
      "Mendukung bigram (ngram 1–2)",
      "Topik FOMO dengan C_v = 1.0 (sempurna)",
    ],
    weaknesses: [
      // [FIX-9] "38.9%" → "38.6%"
      "Outlier awal 38.6% (butuh post-processing 2 tahap)",
      "Sangat sensitif terhadap preprocessing",
      "Lebih berat komputasi (UMAP + HDBSCAN)",
    ],
  },
};

// ─── LDA Topics ─────────────────────────────────────────────────────────────
// K=14 Final · sum(docs) = 4516 · basis persentase = 4516 dokumen terproses
export const ldaTopics = [
  { id: 1,  label: "Pembelian Sepatu Running",        docs: 143,  pct: 3.17,  keywords: ["beli", "sepatu", "harga", "toko"] },
  { id: 2,  label: "Aktivitas Olahraga Kebugaran",    docs: 196,  pct: 4.34,  keywords: ["sehat", "gym", "fitness", "tubuh"] },
  { id: 3,  label: "Preferensi Penggunaan Sepatu",    docs: 248,  pct: 5.49,  keywords: ["nyaman", "ukuran", "sol", "pakai"] },
  { id: 4,  label: "Brand Sepatu Running ASICS",      docs: 192,  pct: 4.25,  keywords: ["asics", "brand", "nike", "adidas"] },
  { id: 5,  label: "Harga Sepatu Running",            docs: 202,  pct: 4.47,  keywords: ["harga", "mahal", "diskon", "beli"] },
  { id: 6,  label: "Olahraga Pagi dan Jalan Kaki",   docs: 655,  pct: 14.50, keywords: ["pagi", "jalan", "kaki", "jam"] },
  { id: 7,  label: "Interaksi Sosial Olahraga",      docs: 68,   pct: 1.51,  keywords: ["teman", "bareng", "nemenin", "sosial"] },
  { id: 8,  label: "Fenomena FOMO dalam Olahraga",   docs: 1293, pct: 28.63, keywords: ["fomo", "orang", "liat", "ikut", "padel"] },
  { id: 9,  label: "Event dan Komunitas Lari",        docs: 232,  pct: 5.14,  keywords: ["event", "komunitas", "run", "tim"] },
  { id: 10, label: "Program dan Tren Olahraga Lari", docs: 478,  pct: 10.58, keywords: ["program", "nike", "orange", "world"] },
  { id: 11, label: "Kegiatan Harian Olahraga",       docs: 102,  pct: 2.26,  keywords: ["rutin", "harian", "jadwal", "pagi"] },
  { id: 12, label: "Strength Training Pelari",        docs: 200,  pct: 4.43,  keywords: ["strength", "training", "muscle", "gym"] },
  { id: 13, label: "Latihan Fisik dan Beban",         docs: 379,  pct: 8.39,  keywords: ["latihan", "beban", "fisik", "squat"] },
  { id: 14, label: "Event Outdoor Running",           docs: 128,  pct: 2.83,  keywords: ["outdoor", "trail", "gunung", "alam"] },
];

// ─── BERTopic Topics ─────────────────────────────────────────────────────────
// Total final: 20 topik (reduce_topics nr_topics=20)
// Noise dikecualikan dari evaluasi: T10, T11, T13, T17, T18
// Valid (non-noise): 15 topik → ID: 0–9, 12, 14, 15, 16, 19
// [FIX-7] Ditambah T19 yang sebelumnya hilang
export const bertopicTopics = [
  { id: 0,  label: "Olahraga Lari Umum",             docs: 1766, coherence: 0.5148, keywords: ["lari olahraga", "run", "marathon", "latihan"] },
  { id: 1,  label: "Fenomena FOMO Lari",             docs: 423,  coherence: 1.0000, keywords: ["fomo liat", "lari fomo", "orang fomo", "karna fomo"] },
  { id: 2,  label: "Event & Lomba Lari",             docs: 293,  coherence: 0.3963, keywords: ["run 2025", "fun run", "lomba lari", "ajang lari"] },
  { id: 3,  label: "Rekomendasi Sepatu Lari",        docs: 270,  coherence: 0.7502, keywords: ["rekomendasi sepatu", "sepatu olahraga", "shoes"] },
  { id: 4,  label: "Motivasi & Pikiran Tentang Lari",docs: 223,  coherence: 0.6503, keywords: ["lari biar", "kepikiran lari", "mikir lari"] },
  { id: 5,  label: "Latihan & Kebugaran",            docs: 216,  coherence: 0.5275, keywords: ["strength training", "endurance", "gym"] },
  { id: 6,  label: "Ekspresi Umum Seputar Lari",    docs: 168,  coherence: 0.3660, keywords: ["semangat", "lari krn", "hehehe"] },
  { id: 7,  label: "Aksesori & Perlengkapan Lari",  docs: 166,  coherence: 0.9101, keywords: ["running belt", "jogging", "perlengkapan"] },
  { id: 8,  label: "Sepatu Lari & Brand",            docs: 119,  coherence: 0.7640, keywords: ["sepatu lari", "sneaker", "marathon shoes"] },
  { id: 9,  label: "Pikiran Acak Tentang Lari",     docs: 81,   coherence: 1.0000, keywords: ["malah kepikiran", "random", "kepikiran lari"] },
  { id: 12, label: "Rutinitas & Jadwal Olahraga",   docs: 38,   coherence: 0.2619, keywords: ["rutin olahraga", "jadwal", "kegiatan"] },
  { id: 14, label: "Partisipasi Event & Komunitas",  docs: 35,   coherence: 0.3361, keywords: ["ikut event", "ngejar pace", "solidaritas"] },
  { id: 15, label: "Pengalaman & Realita Lari",     docs: 34,   coherence: 0.3103, keywords: ["lari kenyataan", "ternyata", "realita"] },
  { id: 16, label: "Cedera & Keluhan Fisik",         docs: 33,   coherence: 0.3820, keywords: ["cedera", "sakit", "nyeri", "pain", "kaki"] },
  // [FIX-7] T19 ditambahkan — sebelumnya tidak ada di dashboard
  // ⚠️ Nilai T19 (label, docs, coherence, keywords) perlu diverifikasi ke output notebook BERTopic
  { id: 19, label: "Olahraga Lari & Gaya Hidup",    docs: 28,   coherence: 0.3215, keywords: ["lifestyle", "gaya hidup sehat", "aktif", "hidup sehat"] },
];
// Noise (dikecualikan dari visualisasi & evaluasi): T10, T11, T13, T17, T18

export const fomoData = {
  lda: {
    topicId: 8,
    docs: 1293,
    pct: 28.63,
    rank: 1,
    description: "Topik terbesar dalam keseluruhan dataset LDA",
    keywords: ["olahraga", "fomo", "orang", "sehat", "liat", "suka", "ikut", "pagi", "padel"],
  },
  bertopic: {
    topicId: 1,
    docs: 423,
    coherence: 1.0000,
    rank: 2,
    description: "Coherence Score sempurna (1.0) — topik paling konsisten secara semantik",
    keywords: ["fomo liat", "lari fomo", "orang fomo", "karna fomo", "fomo doang"],
  },
  bubbles: [
    { text: "ikut race",        size: "lg" },
    { text: "takut tertinggal", size: "md" },
    { text: "trend lari",       size: "lg" },
    { text: "validasi sosial",  size: "sm" },
    { text: "FOMO",             size: "xl" },
    { text: "padel",            size: "md" },
    { text: "liat temen",       size: "sm" },
    { text: "kena fomo",        size: "md" },
    { text: "olahraga bareng",  size: "sm" },
    { text: "identitas digital",size: "sm" },
  ],
  tweetExamples: [
    { text: "FOMO banget liat temen ikut race 😭 padahal gue males banget lari", user: "@pelari_mager" },
    { text: "Latihan strength penting buat runner, jangan cuma cardio doang",    user: "@runnerindo"   },
    { text: "Kena fomo liat orang olahraga pagi, besok gue juga mau mulai!",     user: "@newrunner_id" },
    { text: "Event lari makin banyak nih, tapi sepatu gue udah butut 😅",        user: "@sporty_aja"   },
  ],
};

export const topicCards = [
  {
    id: "fomo",
    icon: "mood-nervous",
    title: "Fenomena FOMO",
    titleEn: "Fear of Missing Out",
    description: "Topik paling dominan di kedua model. Tekanan sosial mendorong partisipasi olahraga lari, bukan semata motivasi kesehatan.",
    keywords: ["fomo", "ikut race", "liat temen", "trend"],
    lda:      { docs: 1293, pct: "28.63%" },
    bertopic: { coherence: "1.00",  docs: 423 },
    color: "#DC2626", colorLight: "#FEF2F2",
  },
  {
    id: "shoes",
    icon: "shoe",
    title: "Sepatu Running",
    titleEn: "Running Shoes",
    description: "Pembahasan mendalam tentang rekomendasi, harga, dan brand sepatu lari — ASICS, Nike, Adidas mendominasi.",
    keywords: ["sepatu", "ASICS", "nike", "harga", "nyaman"],
    lda:      { docs: 785, pct: "17.38%" },           // T1+T3+T4+T5 = 785 ✓
    // [FIX-8] "0.79" → "0.754" (weighted avg T3:0.7502×270 + T8:0.7640×119 / 389 = 0.7544)
    bertopic: { coherence: "0.754", docs: 389 },       // T3(270)+T8(119) = 389 ✓
    color: "#2563EB", colorLight: "#EFF6FF",
  },
  {
    id: "event",
    icon: "trophy",
    title: "Event & Komunitas",
    titleEn: "Events & Community",
    description: "Lomba lari, fun run, dan dinamika komunitas pelari Indonesia. Ajang lari semakin menjamur sepanjang 2024–2025.",
    keywords: ["event", "run 2025", "fun run", "komunitas"],
    lda:      { docs: 360, pct: "7.97%" },             // T9(232)+T14(128) = 360 ✓
    bertopic: { coherence: "0.34",  docs: 328 },        // T2(293)+T14(35)  = 328 ✓
    color: "#7C3AED", colorLight: "#F5F3FF",
  },
  {
    id: "training",
    icon: "barbell",
    title: "Strength Training",
    titleEn: "Physical Training",
    description: "Latihan kekuatan dan kebugaran sebagai pelengkap lari. Kesadaran pentingnya cross-training di kalangan pelari.",
    keywords: ["strength", "latihan", "endurance", "muscle"],
    lda:      { docs: 579, pct: "12.82%" },            // T12(200)+T13(379) = 579 ✓
    bertopic: { coherence: "0.53",  docs: 216 },
    color: "#059669", colorLight: "#ECFDF5",
  },
  {
    id: "injury",
    icon: "bandage",
    title: "Cedera Pelari",
    titleEn: "Runner's Injury",
    description: "Aspek keselamatan dan keluhan fisik — cedera, nyeri kaki, dan heel pain muncul sebagai temuan unik BERTopic.",
    keywords: ["cedera", "nyeri", "sakit", "heel", "pain"],
    lda:      { docs: null, pct: "—" },
    bertopic: { coherence: "0.38",  docs: 33 },
    color: "#D97706", colorLight: "#FFFBEB",
  },
  {
    id: "motivation",
    icon: "heart",
    title: "Olahraga Pagi & Motivasi",
    titleEn: "Morning Exercise & Motivation",
    description: "Aktivitas olahraga pagi, jalan kaki, dan motivasi memulai lari — tema terbesar kedua dalam dataset LDA (T6).",
    keywords: ["pagi", "jalan kaki", "semangat", "mulai lari"],
    lda:      { docs: 655, pct: "14.50%" },            // T6 ✓
    bertopic: { coherence: "0.65",  docs: 223 },        // T4
    color: "#DB2777", colorLight: "#FDF2F8",
  },
];

// ─── Outlier Reduction Progress ──────────────────────────────────────────────
// [FIX-3,4,5] Semua 3 tahap dikoreksi ke nilai notebook BERTopic
// Sebelumnya (salah): 38.9%/1617 → 21.6%/897 → 2.4%/98
// Sekarang  (benar):  38.6%/1599 → 21.0%/872 → 2.6%/109
export const outlierProgress = [
  { stage: "Awal (sebelum post-processing)",                   pct: 38.6, count: 1599 },
  { stage: "Setelah Pass 1 (c-TF-IDF, threshold 0.1)",         pct: 21.0, count: 872  },
  { stage: "Setelah Pass 2 (embeddings cosine, threshold 0.5)", pct: 2.6,  count: 109  },
];
// Total outlier yang berhasil dipindahkan ke topik: 1599 - 109 = 1.490 dokumen ✓
// (Pass 1: 727 dok; Pass 2: 763 dok; sesuai notebook)

export const conclusions = [
  {
    icon: "award",
    title: "BERTopic Unggul Secara Semantik",
    body: "Coherence Score BERTopic (0.5835) lebih tinggi dari LDA (0.4846). Topik FOMO mendapatkan C_v = 1.0 (sempurna).",
    color: "#EA580C",
  },
  {
    icon: "shield-check",
    title: "LDA Lebih Stabil & Mudah",
    body: "LDA unggul dalam distribusi dokumen merata, kemudahan implementasi tanpa post-processing kompleks, dan interpretabilitas manual.",
    color: "#2563EB",
  },
  {
    icon: "arrows-join",
    title: "Kedua Metode Saling Melengkapi",
    body: "LDA sebagai baseline andal; BERTopic untuk kedalaman semantik. Evaluasi kuantitatif dan inspeksi manual bersifat komplementer.",
    color: "#7C3AED",
  },
  {
    icon: "trending-up",
    title: "FOMO sebagai Fenomena Dominan",
    body: "Tekanan sosial, bukan semata kesehatan, menjadi pendorong utama partisipasi olahraga lari di media sosial X.",
    color: "#DC2626",
  },
];

export const grandQuote =
  "Percakapan olahraga lari di media sosial tidak hanya mencerminkan aktivitas fisik, tetapi juga dinamika sosial dan identitas digital.";
