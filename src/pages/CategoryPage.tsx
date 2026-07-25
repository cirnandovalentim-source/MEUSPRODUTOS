import { useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts, getCategories, getPromotionalProducts } from '../lib/firestoreService';
import { Product, Category } from '../types';
import { formatCurrency } from '../lib/utils';
import { SafeImage } from '../components/SafeImage';

const categoryTitles: Record<string, string> = {
  alimentacao: 'Alimentação',
  moveis: 'Móveis',
  utilidades: 'Utilidades',
  promocoes: 'Promoções'
};

const categoryDescriptions: Record<string, string> = {
  alimentacao: 'Produtos alimentícios de qualidade para toda a família.',
  moveis: 'Conforto e qualidade para sua casa.',
  utilidades: 'Tudo o que facilita sua rotina.',
  promocoes: 'Aproveite nossas melhores ofertas.'
};

export function CategoryPage({ categoryId }: { categoryId?: string }) {
  const { id } = useParams<{ id: string }>();
  const activeCategory = categoryId || id || 'produtos';
  
  const title = categoryTitles[activeCategory] || 'Todos os Produtos';
  const description = categoryDescriptions[activeCategory] || 'Encontre tudo o que precisa para sua casa.';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let data: Product[] = [];
        
        if (activeCategory === 'produtos') {
          data = await getProducts();
        } else if (activeCategory === 'promocoes') {
          data = await getPromotionalProducts();
        } else {
          const [allProds, allCats] = await Promise.all([
            getProducts(),
            getCategories()
          ]);

          // Normalize helper
          const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
          
          // Match category by ID or normalized name
          const matchedCat = allCats.find((c: Category) => 
            c.id === activeCategory || norm(c.nome) === norm(activeCategory)
          );

          if (matchedCat) {
            data = allProds.filter(p => p.categoria_id === matchedCat.id);
          } else {
            // Fallback: match by title or slug substring if direct category ID wasn't linked
            data = allProds.filter(p => 
              norm(p.nome).includes(norm(activeCategory)) || 
              norm(p.descricao).includes(norm(activeCategory))
            );
            // If no match found, show all products so user is not stuck on empty screen
            if (data.length === 0) {
              data = allProds;
            }
          }
        }
        
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.codigo && product.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Category Banner */}
      <div className="bg-[#2F2F2F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, código, descrição..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-[#F57C00] px-4 py-2 border border-gray-200 rounded-lg w-full md:w-auto justify-center">
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            Carregando produtos...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
               <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-100 flex flex-col group transition-shadow">
                 <div className="relative h-56 overflow-hidden bg-gray-100">
                    {product.destaque && <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">DESTAQUE</div>}
                    {product.promocao && <div className="absolute top-2 left-20 z-10 bg-[#F57C00] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">OFERTA</div>}
                    
                    <SafeImage 
                      src={product.imagens} 
                      alt={product.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                 </div>
                 <div className="p-5 flex-1 flex flex-col">
                   <p className="text-xs text-gray-400 mb-1">CÓD: {product.codigo}</p>
                   <h4 className="font-semibold text-lg text-[#2F2F2F] mb-1">{product.nome}</h4>
                   
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
                         Comprar
                       </a>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
