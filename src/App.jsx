import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-content">
        <AppRouter />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
