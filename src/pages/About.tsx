import { Star, ShieldCheck, ThumbsUp, Users } from 'lucide-react';

export function About() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-[#2F2F2F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Sobre Nós</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Conheça a história e os valores da CLA VENDAS.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
               <h2 className="text-3xl font-bold text-[#2F2F2F] mb-6">Nossa História</h2>
               <p className="text-gray-600 leading-relaxed text-lg mb-6">
                 "A <strong className="text-[#F57C00]">CLA VENDAS</strong> atua oferecendo produtos de qualidade nas categorias Alimentação, Móveis e Utilidades, proporcionando excelentes preços, facilidade de pagamento e atendimento personalizado."
               </p>
               <p className="text-gray-600 leading-relaxed">
                 Nossa missão é transformar a experiência de compra para o lar, oferecendo conveniência e um catálogo selecionado para facilitar a rotina da sua família, sempre com a segurança e o suporte que você merece.
               </p>
             </div>
             
             <div className="flex-1">
               <img 
                 src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800" 
                 alt="Loja" 
                 className="w-full h-80 object-cover rounded-2xl shadow-lg"
               />
             </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="p-6 bg-gray-50 rounded-2xl">
               <ShieldCheck className="w-12 h-12 text-[#F57C00] mx-auto mb-4" />
               <h3 className="font-bold text-xl text-[#2F2F2F] mb-2">Confiança</h3>
               <p className="text-gray-500">Garantimos a qualidade de todos os nossos produtos.</p>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl">
               <ThumbsUp className="w-12 h-12 text-[#F57C00] mx-auto mb-4" />
               <h3 className="font-bold text-xl text-[#2F2F2F] mb-2">Qualidade</h3>
               <p className="text-gray-500">Seleção rigorosa das melhores marcas do mercado.</p>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl">
               <Users className="w-12 h-12 text-[#F57C00] mx-auto mb-4" />
               <h3 className="font-bold text-xl text-[#2F2F2F] mb-2">Atendimento</h3>
               <p className="text-gray-500">Suporte personalizado via WhatsApp.</p>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
