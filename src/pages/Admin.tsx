import { Lock, LayoutDashboard, Package, Tags, Image as ImageIcon } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';

export function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggingIn(true);
      try {
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error signing in to Firebase:", error);
        alert('Erro ao autenticar no banco de dados. Verifique a configuração do Firebase.');
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
              <Lock className="h-6 w-6 text-[#F57C00]" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Painel Administrativo
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Faça login para gerenciar o site. (Senha: admin123)
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md rounded-t-md focus:outline-none focus:ring-[#F57C00] focus:border-[#F57C00] focus:z-10 sm:text-sm"
                  placeholder="Senha (admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2F2F2F] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F2F2F] disabled:opacity-70"
              >
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'produtos':
        return <AdminProducts />;
      case 'categorias':
        return <AdminCategories />;
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('produtos')}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Gerenciar Produtos</dt>
                      <dd className="mt-1 text-sm text-gray-900">Cadastre, edite e remova produtos.</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <span className="font-medium text-[#F57C00] hover:text-orange-600">Acessar Produtos &rarr;</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('categorias')}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Tags className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Gerenciar Categorias</dt>
                      <dd className="mt-1 text-sm text-gray-900">Cadastre, edite e remova categorias.</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <span className="font-medium text-[#F57C00] hover:text-orange-600">Acessar Categorias &rarr;</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-not-allowed opacity-75">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Banners & Destaques</dt>
                      <dd className="mt-1 text-sm text-gray-900">Em desenvolvimento...</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#2F2F2F] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-white">CLA VENDAS - ADMIN</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`${
                    activeTab === 'dashboard'
                      ? 'border-[#F57C00] text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('produtos')}
                  className={`${
                    activeTab === 'produtos'
                      ? 'border-[#F57C00] text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => setActiveTab('categorias')}
                  className={`${
                    activeTab === 'categorias'
                      ? 'border-[#F57C00] text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Categorias
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header className="mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'produtos' && 'Gestão de Produtos'}
              {activeTab === 'categorias' && 'Gestão de Categorias'}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
