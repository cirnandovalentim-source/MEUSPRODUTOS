import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="alimentacao" element={<CategoryPage categoryId="alimentacao" />} />
        <Route path="moveis" element={<CategoryPage categoryId="moveis" />} />
        <Route path="utilidades" element={<CategoryPage categoryId="utilidades" />} />
        <Route path="produtos" element={<CategoryPage />} />
        <Route path="promocoes" element={<CategoryPage categoryId="promocoes" />} />
        <Route path="sobre" element={<About />} />
        <Route path="contato" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
