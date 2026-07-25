import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2F2F2F] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              CLA<span className="text-[#F57C00]">VENDAS</span>
            </h3>
            <p className="text-sm text-gray-400">
              A CLA VENDAS atua oferecendo produtos de qualidade nas categorias Alimentação, Móveis e Utilidades, proporcionando excelentes preços, facilidade de pagamento e atendimento personalizado.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Menu</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/admin" className="hover:text-[#F57C00] transition-colors mt-4 inline-block text-gray-500 text-xs">Área do Administrador</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li><Link to="/alimentacao" className="hover:text-white transition-colors">Alimentação</Link></li>
              <li><Link to="/moveis" className="hover:text-white transition-colors">Móveis</Link></li>
              <li><Link to="/utilidades" className="hover:text-white transition-colors">Utilidades</Link></li>
              <li><Link to="/promocoes" className="text-[#F57C00] hover:text-orange-400 transition-colors">Promoções</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-6">
              <a 
                href="https://wa.me/5521967190243" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block border border-[#F57C00] text-[#F57C00] px-4 py-2 rounded-md hover:bg-[#F57C00] hover:text-white transition-colors"
              >
                Atendimento via WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} CLA VENDAS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
