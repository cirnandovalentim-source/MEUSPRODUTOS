import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Product, Category } from '../../types';
import { getAllProductsAdmin, addProduct, updateProduct, deleteProduct, getAllCategoriesAdmin } from '../../lib/firestoreService';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatCurrency, compressImageFile } from '../../lib/utils';
import { SafeImage } from '../../components/SafeImage';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    preco_promocional: '',
    categoria_id: '',
    codigo: '',
    estoque: '0',
    parcelas: '1',
    imagens: [] as string[],
    destaque: false,
    promocao: false,
    ativo: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getAllProductsAdmin(),
        getAllCategoriesAdmin()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file);
        setFormData(prev => ({
          ...prev,
          imagens: [...prev.imagens, compressedBase64]
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Não foi possível processar a imagem. Tente outro arquivo.");
      }
      e.target.value = '';
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco.toString(),
        preco_promocional: product.preco_promocional ? product.preco_promocional.toString() : '',
        categoria_id: product.categoria_id,
        codigo: product.codigo || '',
        estoque: product.estoque.toString(),
        parcelas: product.parcelas.toString(),
        imagens: product.imagens || [],
        destaque: product.destaque,
        promocao: product.promocao,
        ativo: product.ativo,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        preco_promocional: '',
        categoria_id: categories.length > 0 ? categories[0].id : '',
        codigo: '',
        estoque: '0',
        parcelas: '1',
        imagens: [],
        destaque: false,
        promocao: false,
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const productData: Omit<Product, 'id'> = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      preco_promocional: formData.preco_promocional ? parseFloat(formData.preco_promocional) : undefined,
      categoria_id: formData.categoria_id,
      codigo: formData.codigo,
      estoque: parseInt(formData.estoque, 10),
      parcelas: parseInt(formData.parcelas, 10),
      imagens: formData.imagens.filter(i => i),
      destaque: formData.destaque,
      promocao: formData.promocao,
      ativo: formData.ativo,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Erro ao salvar produto");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Erro ao excluir produto");
      }
    }
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.nome || 'Desconhecida';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#F57C00] text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Carregando produtos...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          {product.imagens && product.imagens.length > 0 && (
                            <SafeImage src={product.imagens[0]} alt="" className="h-10 w-10 object-cover" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.nome}</div>
                          <div className="text-sm text-gray-500">Cód: {product.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(product.categoria_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.preco)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-full bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-900">Nome do Produto *</label>
                  <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-900">Descrição</label>
                  <textarea rows={3} value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5"></textarea>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Categoria *</label>
                  <select required value={formData.categoria_id} onChange={(e) => setFormData({...formData, categoria_id: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5">
                    <option value="" disabled>Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Código (SKU)</label>
                  <input type="text" value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Preço (R$) *</label>
                  <input type="number" step="0.01" min="0" required value={formData.preco} onChange={(e) => setFormData({...formData, preco: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Preço Promocional (R$)</label>
                  <input type="number" step="0.01" min="0" value={formData.preco_promocional} onChange={(e) => setFormData({...formData, preco_promocional: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Estoque</label>
                  <input type="number" min="0" required value={formData.estoque} onChange={(e) => setFormData({...formData, estoque: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Máx. Parcelas sem Juros</label>
                  <input type="number" min="1" max="12" required value={formData.parcelas} onChange={(e) => setFormData({...formData, parcelas: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-900">URLs das Imagens ou envie uma imagem</label>
                  <div className="flex gap-2">
                    <input type="text" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            setFormData(prev => ({ ...prev, imagens: [...prev.imagens, input.value.trim()] }));
                            input.value = '';
                          }
                        }
                      }}
                      placeholder="https://exemplo.com/img1.jpg (Aperte Enter para adicionar)" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" 
                    />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="productImageUpload" />
                    <label htmlFor="productImageUpload" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 flex-shrink-0 flex items-center justify-center font-medium">
                      Carregar
                    </label>
                  </div>
                  {formData.imagens && formData.imagens.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.imagens.map((url, index) => {
                        if (!url) return null;
                        return (
                          <div key={index} className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center group">
                            <SafeImage src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button 
                                type="button" 
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    imagens: prev.imagens.filter((_, i) => i !== index)
                                  }))
                                }} 
                                className="text-white hover:text-red-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-6 mt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.destaque} onChange={(e) => setFormData({...formData, destaque: e.target.checked})} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F57C00]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">Destaque na Home</span>
                  </label>

                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.promocao} onChange={(e) => setFormData({...formData, promocao: e.target.checked})} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F57C00]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">Em Promoção</span>
                  </label>

                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.ativo} onChange={(e) => setFormData({...formData, ativo: e.target.checked})} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F57C00]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">Produto Ativo</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b gap-2">
              <button onClick={closeModal} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Cancelar</button>
              <button type="submit" form="productForm" className="text-white bg-[#F57C00] hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
