import { ArrowRight, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../lib/firestoreService';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { SafeImage } from '../components/SafeImage';

const categories = [
  {
    id: 'alimentacao',
    title: 'Alimentação',
    description: 'Produtos alimentícios de qualidade para toda a família.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    link: '/alimentacao'
  },
  {
    id: 'moveis',
    title: 'Móveis',
    description: 'Conforto e qualidade para sua casa.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    link: '/moveis'
  },
  {
    id: 'utilidades',
    title: 'Utilidades',
    description: 'Tudo o que facilita sua rotina.',
    image: 'https://images.unsplash.com/photo-1583947581924-860bda6a5a83?auto=format&fit=crop&q=80&w=800',
    link: '/utilidades'
  }
];

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Banner Principal */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920" 
            alt="Ambiente moderno" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tudo para sua casa em <span className="text-[#F57C00]">um só lugar</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Qualidade, preço justo e facilidade de pagamento. Encontre móveis, alimentos e utilidades com a confiança da CLA VENDAS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/produtos"
              className="bg-white text-[#2F2F2F] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Ver Produtos
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="https://wa.me/5521967190243"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F57C00] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg flex items-center justify-center"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Sessão Categorias */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2F2F2F] mb-4">Nossas Categorias</h2>
            <div className="w-24 h-1 bg-[#F57C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white transition-all hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <Link 
                    to={category.link}
                    className="inline-flex items-center text-[#F57C00] font-semibold hover:text-orange-600"
                  >
                    Ver Produtos <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2F2F2F] mb-4">Produtos em Destaque</h2>
            <div className="w-24 h-1 bg-[#F57C00] mx-auto rounded-full"></div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500">Carregando destaques...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center text-gray-500">Nenhum produto em destaque no momento.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {featuredProducts.map((product) => (
                 <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col group hover:shadow-lg transition-shadow">
                   <div className="relative h-56 overflow-hidden bg-gray-100">
                      {product.promocao && <div className="absolute top-2 left-2 z-10 bg-[#F57C00] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">OFERTA</div>}
                      <SafeImage 
                        src={product.imagens} 
                        alt={product.nome} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                   </div>
                   <div className="p-5 flex-1 flex flex-col">
                     <h4 className="font-semibold text-lg text-[#2F2F2F] mb-1">{product.nome}</h4>
                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.descricao}</p>
                     
                     <div className="mt-auto pt-4">
                       <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-[#2F2F2F]">
                            {formatCurrency(product.preco_promocional || product.preco)}
                          </span>
                          {product.preco_promocional && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.preco)}
                            </span>
                          )}
                       </div>
                       <p className="text-xs text-gray-500 mb-4">Em até {product.parcelas}x sem juros</p>
                       
                       <div className="flex flex-col gap-2">
                         <button className="w-full bg-[#2F2F2F] text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                           Saiba Mais
                         </button>
                         <a 
                           href={`https://wa.me/5521967190243?text=Olá, tenho interesse no produto ${product.nome} (Cód: ${product.codigo}).`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full border border-[#F57C00] text-[#F57C00] py-2 rounded-lg font-medium hover:bg-[#F57C00] hover:text-white transition-colors text-center flex items-center justify-center gap-2"
                         >
                           <ShoppingCart className="w-4 h-4" />
                           Comprar pelo WhatsApp
                         </a>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          )}
         </div>
      </section>

      {/* Sobre a Empresa (Resumo) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="w-12 h-12 text-[#F57C00] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#2F2F2F] mb-6">Sobre a CLA VENDAS</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            "A CLA VENDAS atua oferecendo produtos de qualidade nas categorias Alimentação, Móveis e Utilidades, proporcionando excelentes preços, facilidade de pagamento e atendimento personalizado."
          </p>
        </div>
      </section>
    </div>
  );
}
