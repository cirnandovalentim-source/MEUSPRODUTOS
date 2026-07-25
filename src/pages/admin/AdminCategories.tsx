import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Category } from '../../types';
import { getAllCategoriesAdmin, addCategory, updateCategory, deleteCategory } from '../../lib/firestoreService';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { compressImageFile } from '../../lib/utils';
import { SafeImage } from '../../components/SafeImage';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    ativo: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategoriesAdmin();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
          imagem: compressedBase64
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Não foi possível processar a imagem. Tente outro arquivo.");
      }
      e.target.value = '';
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        nome: category.nome,
        descricao: category.descricao,
        imagem: category.imagem || '',
        ativo: category.ativo,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        nome: '',
        descricao: '',
        imagem: '',
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const categoryData: Omit<Category, 'id'> = {
      nome: formData.nome,
      descricao: formData.descricao,
      imagem: formData.imagem,
      ativo: formData.ativo,
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await addCategory(categoryData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Erro ao salvar categoria");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria? Atenção: isso não exclui os produtos associados a ela.")) {
      try {
        await deleteCategory(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Erro ao excluir categoria");
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#F57C00] text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Categoria
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Carregando categorias...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma categoria cadastrada.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          {category.imagem ? (
                            <SafeImage src={category.imagem} alt="" className="h-10 w-10 object-cover" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-400 text-xs">Sem IMG</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{category.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs truncate">
                      {category.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.ativo ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openModal(category)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
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
          <div className="relative w-full max-w-md max-h-full bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Nome da Categoria *</label>
                  <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Descrição *</label>
                  <textarea rows={3} required value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5"></textarea>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">URL da Imagem ou envie um arquivo</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.imagem.length > 500 ? '' : formData.imagem} onChange={(e) => setFormData({...formData, imagem: e.target.value})} placeholder="https://exemplo.com/img.jpg (Base64 oculto por segurança)" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#F57C00] focus:border-[#F57C00] block w-full p-2.5" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="categoryImageUpload" />
                    <label htmlFor="categoryImageUpload" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 flex-shrink-0 flex items-center justify-center font-medium">
                      Carregar
                    </label>
                  </div>
                  {formData.imagem && (
                    <div className="mt-3">
                      <div className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center group">
                        <SafeImage src={formData.imagem} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, imagem: '' }))} 
                            className="text-white hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.ativo} onChange={(e) => setFormData({...formData, ativo: e.target.checked})} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F57C00]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">Categoria Ativa</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b gap-2">
              <button onClick={closeModal} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Cancelar</button>
              <button type="submit" form="categoryForm" className="text-white bg-[#F57C00] hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
