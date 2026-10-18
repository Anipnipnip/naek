import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import { MarketOverview } from './pages/MarketOverview';
import { StockDetail } from './pages/StockDetail';
import { Watchlist } from './pages/Watchlist';
import { NaekAI } from './pages/NaekAI';
import { Belajar } from './pages/Belajar';
import { ComingSoon } from './pages/ComingSoon';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<MarketOverview />} />
            <Route
              path="/saham"
              element={
                <ComingSoon
                  title="Saham"
                  description="Gunakan pencarian di header untuk membuka detail emiten. Daftar/screener saham lengkap belum tersedia pada tahap ini."
                />
              }
            />
            <Route path="/saham/:ticker" element={<StockDetail />} />
            <Route
              path="/screener"
              element={
                <ComingSoon
                  title="Screener"
                  description="Penyaringan saham berdasarkan kriteria fundamental dan teknikal belum tersedia pada tahap ini."
                />
              }
            />
            <Route
              path="/compare"
              element={
                <ComingSoon
                  title="Compare"
                  description="Perbandingan antar saham belum tersedia pada tahap ini."
                />
              }
            />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route
              path="/berita"
              element={
                <ComingSoon
                  title="Berita"
                  description="Rangkuman berita dan keterbukaan informasi emiten belum tersedia pada tahap ini."
                />
              }
            />
            <Route
              path="/intelligence/radar"
              element={
                <ComingSoon
                  title="Bullish / Bearish Radar"
                  description="Radar sinyal bullish/bearish memerlukan pipeline data dan validasi yang belum siap. Fitur ini akan dibangun setelah fondasi data pasar selesai."
                />
              }
            />
            <Route
              path="/intelligence/multibagger"
              element={
                <ComingSoon
                  title="Multibagger Watch"
                  description="Kandidat riset multibagger akan ditampilkan dengan kriteria transparan setelah data fundamental dan historis tersedia."
                />
              }
            />
            <Route
              path="/intelligence/ihsg-risk"
              element={
                <ComingSoon
                  title="IHSG Risk Monitor"
                  description="Pemantauan risiko IHSG belum tersedia. Fitur ini memerlukan data pasar yang tervalidasi."
                />
              }
            />
            <Route path="/ai" element={<NaekAI />} />
            <Route path="/learn" element={<Belajar />} />
            <Route
              path="*"
              element={
                <ComingSoon
                  title="Halaman tidak ditemukan"
                  description="Halaman yang Anda cari tidak tersedia."
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
