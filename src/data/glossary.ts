/**
 * Static glossary data for the Belajar (Learn) page, per PRD.md FR-04.
 *
 * Content rules (per PRD.md and design.md):
 * - Each term includes: plain definition, a concrete numeric/example
 *   scenario, how to interpret it, a common misconception, and related terms.
 * - Community slang (HAKA, HAKI, serok, "gorengan") is explicitly labeled
 *   as informal slang, not official exchange terminology.
 * - Examples are illustrative only — they are not investment recommendations.
 */

export type GlossaryCategory = 'dasar' | 'teknikal' | 'fundamental' | 'slang';

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  isSlang?: boolean;
  definition: string;
  example: string;
  interpretation: string;
  misconception: string;
  relatedTermIds: string[];
}

export const GLOSSARY_CATEGORY_LABEL: Record<GlossaryCategory, string> = {
  dasar: 'Dasar Trading',
  teknikal: 'Teknikal & Harga',
  fundamental: 'Fundamental',
  slang: 'Istilah Komunitas (Slang)',
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'bid',
    term: 'Bid',
    category: 'dasar',
    definition: 'Harga tertinggi yang bersedia dibayar pembeli untuk suatu saham saat ini.',
    example:
      'Jika bid tertinggi untuk saham X adalah Rp1.200, artinya ada pembeli yang siap membeli di harga itu sekarang.',
    interpretation:
      'Bid menunjukkan minat beli pada level harga tertentu. Semakin banyak lot di bid, semakin besar potensi dukungan harga di level itu — tapi dukungan ini bisa ditarik kapan saja.',
    misconception:
      'Bid besar bukan jaminan harga akan naik. Order bisa dibatalkan sebelum tereksekusi (lihat juga: "serok" sebagai istilah slang terkait).',
    relatedTermIds: ['ask', 'spread', 'order-book'],
  },
  {
    id: 'ask',
    term: 'Ask (Offer)',
    category: 'dasar',
    definition: 'Harga terendah yang bersedia diterima penjual untuk melepas suatu saham saat ini.',
    example: 'Jika ask terendah saham X adalah Rp1.210, penjual bersedia melepas sahamnya mulai dari harga itu.',
    interpretation:
      'Ask menunjukkan minat jual pada level harga tertentu. Jarak antara bid dan ask (spread) mencerminkan likuiditas saham tersebut.',
    misconception: 'Ask bukan "harga pasti" saham — ini hanya penawaran, bisa berubah sebelum ada transaksi.',
    relatedTermIds: ['bid', 'spread', 'order-book'],
  },
  {
    id: 'spread',
    term: 'Spread',
    category: 'dasar',
    definition: 'Selisih antara harga bid tertinggi dan harga ask terendah.',
    example: 'Jika bid tertinggi Rp1.200 dan ask terendah Rp1.210, maka spread-nya Rp10.',
    interpretation:
      'Spread yang sempit biasanya menandakan saham lebih likuid (mudah ditransaksikan). Spread yang lebar bisa menandakan likuiditas rendah.',
    misconception: 'Spread kecil tidak otomatis berarti saham tersebut "aman" — likuiditas dan risiko adalah hal yang berbeda.',
    relatedTermIds: ['bid', 'ask', 'likuiditas'],
  },
  {
    id: 'order-book',
    term: 'Order Book (Antrian Order)',
    category: 'dasar',
    definition: 'Daftar seluruh order beli (bid) dan jual (ask) yang belum tereksekusi pada suatu saham, tersusun berdasarkan harga.',
    example: 'Order book menampilkan beberapa level harga bid dan ask beserta jumlah lot di masing-masing level.',
    interpretation:
      'Order book membantu melihat sebaran minat beli/jual pada berbagai level harga, bukan hanya harga terbaik saat ini.',
    misconception:
      'Order book yang terlihat ramai di satu sisi bukan bukti pasti arah harga selanjutnya — order besar bisa saja dibatalkan.',
    relatedTermIds: ['bid', 'ask', 'volume'],
  },
  {
    id: 'lot',
    term: 'Lot',
    category: 'dasar',
    definition: 'Satuan standar jumlah saham dalam satu transaksi di BEI. 1 lot = 100 lembar saham.',
    example: 'Membeli 5 lot saham berarti membeli 500 lembar saham.',
    interpretation: 'Lot digunakan agar penawaran harga dan volume transaksi memiliki satuan yang konsisten.',
    misconception: 'Harga yang ditampilkan di layar biasanya per lembar saham, bukan per lot — perhatikan baik-baik saat menghitung total nilai transaksi.',
    relatedTermIds: ['volume'],
  },
  {
    id: 'volume',
    term: 'Volume',
    category: 'dasar',
    definition: 'Jumlah total lembar saham (atau lot) yang diperdagangkan dalam suatu periode, misalnya satu hari perdagangan.',
    example: 'Jika volume saham X hari ini 10 juta lembar, berarti total 10 juta lembar saham X berpindah tangan hari itu.',
    interpretation:
      'Volume tinggi disertai perubahan harga signifikan sering dianggap sebagai sinyal minat pasar yang kuat terhadap suatu saham.',
    misconception:
      'Volume tinggi saja tidak menjelaskan alasan di baliknya — perlu konteks tambahan (berita, laporan keuangan, dll) untuk interpretasi yang lebih lengkap.',
    relatedTermIds: ['likuiditas', 'order-book'],
  },
  {
    id: 'likuiditas',
    term: 'Likuiditas',
    category: 'dasar',
    definition: 'Kemudahan suatu saham untuk dibeli atau dijual tanpa menyebabkan perubahan harga yang signifikan.',
    example: 'Saham dengan volume harian besar dan spread sempit umumnya lebih likuid dibanding saham dengan volume kecil dan spread lebar.',
    interpretation: 'Likuiditas penting dipertimbangkan karena mempengaruhi seberapa mudah posisi dapat dibuka/ditutup.',
    misconception: 'Saham yang populer dibahas bukan otomatis likuid — periksa volume dan spread aktualnya.',
    relatedTermIds: ['volume', 'spread'],
  },
  {
    id: 'bullish',
    term: 'Bullish',
    category: 'teknikal',
    definition: 'Pandangan atau kondisi pasar yang mengindikasikan ekspektasi harga akan naik.',
    example: 'Analis menyebut saham X "bullish" jika pola harga dan indikator teknikalnya cenderung menunjukkan tren naik.',
    interpretation:
      'Bullish adalah penilaian berbasis data historis dan pola yang terlihat, bukan kepastian. Pasar tetap bisa bergerak berlawanan dari ekspektasi ini.',
    misconception: '"Bullish" bukan jaminan harga pasti naik — ini interpretasi berbasis bukti yang masih mengandung ketidakpastian.',
    relatedTermIds: ['bearish'],
  },
  {
    id: 'bearish',
    term: 'Bearish',
    category: 'teknikal',
    definition: 'Pandangan atau kondisi pasar yang mengindikasikan ekspektasi harga akan turun.',
    example: 'Analis menyebut saham Y "bearish" jika indikator teknikal dan tren harganya menunjukkan kecenderungan turun.',
    interpretation: 'Sama seperti bullish, bearish adalah interpretasi berbasis data yang masih bisa salah.',
    misconception: '"Bearish" tidak berarti saham tersebut "buruk" secara fundamental — ini murni soal ekspektasi arah harga jangka pendek/menengah.',
    relatedTermIds: ['bullish'],
  },
  {
    id: 'ara',
    term: 'ARA (Auto Reject Atas)',
    category: 'teknikal',
    definition: 'Batas kenaikan harga maksimum suatu saham dalam satu hari perdagangan, ditetapkan oleh bursa.',
    example: 'Jika suatu saham mencapai ARA, order beli di atas batas tersebut akan otomatis ditolak sistem.',
    interpretation: 'ARA adalah mekanisme pengendalian volatilitas bursa, bukan indikator kualitas suatu saham.',
    misconception: 'Saham yang sering ARA tidak otomatis merupakan investasi yang baik — persentase kenaikan besar bisa terjadi pada saham dengan likuiditas rendah dan risiko tinggi.',
    relatedTermIds: ['arb'],
  },
  {
    id: 'arb',
    term: 'ARB (Auto Reject Bawah)',
    category: 'teknikal',
    definition: 'Batas penurunan harga maksimum suatu saham dalam satu hari perdagangan, ditetapkan oleh bursa.',
    example: 'Jika suatu saham mencapai ARB, order jual di bawah batas tersebut akan otomatis ditolak sistem.',
    interpretation: 'Sama seperti ARA, ARB adalah mekanisme pengendalian volatilitas, bukan sinyal fundamental.',
    misconception: 'ARB berulang tidak otomatis berarti perusahaan dalam masalah serius — perlu diperiksa alasan dan konteksnya lebih lanjut.',
    relatedTermIds: ['ara'],
  },
  {
    id: 'per',
    term: 'PER (Price to Earnings Ratio)',
    category: 'fundamental',
    definition: 'Rasio yang membandingkan harga saham saat ini dengan laba per saham (EPS) perusahaan.',
    example: 'Jika harga saham Rp2.000 dan EPS Rp200, maka PER = 2.000 / 200 = 10x.',
    interpretation:
      'PER sering dipakai untuk membandingkan valuasi relatif antar perusahaan sejenis, tapi harus dibandingkan dalam industri dan periode yang sama.',
    misconception: 'PER rendah tidak otomatis berarti saham "murah" dan PER tinggi tidak otomatis berarti "mahal" — perlu dibandingkan dengan rata-rata industri dan prospek pertumbuhan perusahaan.',
    relatedTermIds: ['pbv', 'roe'],
  },
  {
    id: 'pbv',
    term: 'PBV (Price to Book Value)',
    category: 'fundamental',
    definition: 'Rasio yang membandingkan harga saham dengan nilai buku (aset bersih) per saham perusahaan.',
    example: 'Jika harga saham Rp1.500 dan nilai buku per saham Rp1.000, maka PBV = 1.500 / 1.000 = 1,5x.',
    interpretation: 'PBV membantu melihat apakah harga pasar mencerminkan premi atau diskon dibanding nilai aset bersih perusahaan.',
    misconception: 'PBV di bawah 1 tidak selalu berarti saham "murah" — bisa jadi mencerminkan masalah mendasar pada bisnis perusahaan tersebut.',
    relatedTermIds: ['per', 'roe'],
  },
  {
    id: 'roe',
    term: 'ROE (Return on Equity)',
    category: 'fundamental',
    definition: 'Rasio yang mengukur seberapa efisien perusahaan menghasilkan laba dari modal (ekuitas) pemegang saham.',
    example: 'Jika laba bersih Rp100 miliar dan ekuitas Rp1 triliun, maka ROE = 100 / 1.000 = 10%.',
    interpretation: 'ROE yang tinggi secara konsisten bisa menandakan efisiensi penggunaan modal, tapi perlu dibandingkan dengan tingkat utang dan rata-rata industri.',
    misconception: 'ROE tinggi bisa juga disebabkan oleh tingkat utang yang tinggi (leverage), bukan semata efisiensi operasional — selalu periksa rasio utang bersamaan.',
    relatedTermIds: ['per', 'pbv'],
  },
  {
    id: 'cash-flow-operasi',
    term: 'Arus Kas Operasi (Operating Cash Flow)',
    category: 'fundamental',
    definition: 'Kas yang dihasilkan atau digunakan dari aktivitas operasional utama perusahaan, terpisah dari aktivitas investasi dan pendanaan.',
    example: 'Perusahaan bisa melaporkan laba bersih positif namun arus kas operasi negatif, misalnya karena banyak penjualan belum tertagih (piutang).',
    interpretation:
      'Arus kas operasi yang sehat dan konsisten sering dianggap tanda kualitas laba yang lebih baik dibanding laba akuntansi semata.',
    misconception: 'Laba bersih positif tidak otomatis berarti perusahaan punya kas yang cukup — periksa arus kas operasi untuk gambaran yang lebih utuh.',
    relatedTermIds: ['per'],
  },
  {
    id: 'haka',
    term: 'HAKA',
    category: 'slang',
    isSlang: true,
    definition:
      'Istilah slang komunitas investor untuk kondisi order beli yang "menyerbu" ke harga ask (hajar kanan), biasanya menyebabkan harga naik cepat.',
    example: 'Trader menyebut "HAKA" ketika banyak order beli dieksekusi langsung di harga ask secara beruntun.',
    interpretation: 'Istilah ini menggambarkan pola order agresif, bukan metrik resmi yang diterbitkan oleh bursa.',
    misconception: 'HAKA bukan terminologi resmi BEI — ini bahasa gaul komunitas yang maknanya bisa bervariasi antar pengguna.',
    relatedTermIds: ['haki', 'bid', 'ask'],
  },
  {
    id: 'haki',
    term: 'HAKI',
    category: 'slang',
    isSlang: true,
    definition:
      'Istilah slang komunitas investor untuk kondisi order jual yang "menyerbu" ke harga bid (hajar kiri), biasanya menyebabkan harga turun cepat.',
    example: 'Trader menyebut "HAKI" ketika banyak order jual dieksekusi langsung di harga bid secara beruntun.',
    interpretation: 'Sama seperti HAKA, ini pola order agresif dari sisi jual — bukan metrik atau klasifikasi resmi bursa.',
    misconception: 'HAKI bukan indikasi otomatis adanya manipulasi pasar — pola ini bisa muncul dari banyak sebab, termasuk aksi profit taking wajar.',
    relatedTermIds: ['haka', 'bid', 'ask'],
  },
  {
    id: 'serok',
    term: 'Serok',
    category: 'slang',
    isSlang: true,
    definition: 'Istilah slang untuk aksi membeli saham dalam jumlah signifikan, biasanya saat harga dianggap sudah turun cukup dalam.',
    example: 'Trader menyebut "serok di harga bawah" ketika membeli saham setelah penurunan harga yang tajam.',
    interpretation: 'Istilah ini menggambarkan strategi atau sentimen trader, bukan sinyal atau rekomendasi yang terverifikasi.',
    misconception: '"Serok" bukan strategi yang pasti berhasil — membeli saat harga turun tidak menjamin harga akan kembali naik.',
    relatedTermIds: ['bid'],
  },
  {
    id: 'saham-gorengan',
    term: 'Saham "Gorengan"',
    category: 'slang',
    isSlang: true,
    definition:
      'Istilah slang untuk saham yang dicurigai mengalami pergerakan harga/volume tidak wajar, sering dikaitkan dengan dugaan manipulasi oleh sekelompok pelaku pasar.',
    example: 'Komunitas investor menyebut suatu saham "gorengan" ketika harganya naik sangat tajam dalam waktu singkat tanpa didukung perubahan fundamental yang jelas.',
    interpretation:
      'Label ini mencerminkan kecurigaan komunitas, bukan kesimpulan hukum atau faktual. Pergerakan harga/volume tidak wajar perlu dianalisis lebih lanjut dengan data dan konteks yang memadai.',
    misconception:
      'Menyebut saham sebagai "gorengan" bukan bukti manipulasi — NAEK tidak akan melabeli saham sebagai dimanipulasi hanya berdasarkan pola harga/volume semata. Lihat juga "Aktivitas Tidak Biasa" sebagai istilah yang lebih netral.',
    relatedTermIds: ['volume', 'ara', 'arb'],
  },
];

export function getGlossaryTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((term) => term.id === id);
}
