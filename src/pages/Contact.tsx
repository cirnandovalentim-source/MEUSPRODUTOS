import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-[#2F2F2F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Estamos prontos para atender você. Entre em contato por um dos nossos canais.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#2F2F2F] mb-6">Informações de Contato</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-[#F57C00]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">WhatsApp / Telefone</h3>
                  <p className="text-gray-600 mt-1">(21) 96719-0243</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-[#F57C00]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">E-mail</h3>
                  <p className="text-gray-600 mt-1">contato@clavendas.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-[#F57C00]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Endereço</h3>
                  <p className="text-gray-600 mt-1">Av. das Américas, 1000 - Rio de Janeiro, RJ</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-[#F57C00]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Horário de Funcionamento</h3>
                  <p className="text-gray-600 mt-1">Segunda a Sexta: 09:00 às 18:00</p>
                  <p className="text-gray-600">Sábado: 09:00 às 13:00</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-200 h-64 rounded-xl flex items-center justify-center">
               <span className="text-gray-500 font-medium flex flex-col items-center gap-2">
                 <MapPin className="w-8 h-8" />
                 Mapa do Google
               </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#2F2F2F] mb-6">Envie uma Mensagem</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F57C00] focus:border-transparent outline-none transition-all" placeholder="Seu nome" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F57C00] focus:border-transparent outline-none transition-all" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail (opcional)</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F57C00] focus:border-transparent outline-none transition-all" placeholder="seu@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F57C00] focus:border-transparent outline-none transition-all resize-none" placeholder="Como podemos te ajudar?"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#2F2F2F] text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors mt-4">
                Enviar Mensagem
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
