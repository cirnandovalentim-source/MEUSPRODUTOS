import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Phone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Alimentação', path: '/alimentacao' },
    { name: 'Móveis', path: '/moveis' },
    { name: 'Utilidades', path: '/utilidades' },
    { name: 'Promoções', path: '/promocoes' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#2F2F2F] tracking-tighter">
              CLA<span className="text-[#F57C00]">VENDAS</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-[#F57C00] font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <a 
              href="https://wa.me/5521967190243" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#F57C00] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-md"
            >
              <Phone className="w-5 h-5" />
              Fale pelo WhatsApp
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#F57C00] hover:bg-orange-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="https://wa.me/5521967190243" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-4 text-center bg-[#F57C00] text-white px-5 py-3 rounded-md font-semibold"
            >
              Fale pelo WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
