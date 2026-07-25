import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Category, Product } from '../types';

const DEFAULT_CATEGORIES = [
  {
    nome: 'Alimentação',
    descricao: 'Produtos alimentícios de qualidade para toda a família.',
    imagem: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    ativo: true,
  },
  {
    nome: 'Móveis',
    descricao: 'Conforto e qualidade para sua casa.',
    imagem: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    ativo: true,
  },
  {
    nome: 'Utilidades',
    descricao: 'Tudo o que facilita sua rotina.',
    imagem: 'https://images.unsplash.com/photo-1583947581924-860bda6a5a83?auto=format&fit=crop&q=80&w=800',
    ativo: true,
  }
];

export const seedInitialData = async (): Promise<{ categories: Category[], products: Product[] }> => {
  try {
    const categoriesCol = collection(db, 'categories');
    const catSnapshot = await getDocs(categoriesCol);
    let categories = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    
    if (categories.length === 0) {
      const catMap: Record<string, string> = {};
      for (const cat of DEFAULT_CATEGORIES) {
        const docRef = await addDoc(collection(db, 'categories'), cat);
        catMap[cat.nome] = docRef.id;
      }
      const newCatSnapshot = await getDocs(categoriesCol);
      categories = newCatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

      const DEFAULT_PRODUCTS = [
        {
          nome: 'Cesta Básica Completa',
          descricao: 'Alimentos selecionados com excelente qualidade para o consumo diário da sua família.',
          preco: 180.00,
          preco_promocional: 159.90,
          categoria_id: catMap['Alimentação'] || categories[0]?.id || '',
          codigo: 'ALIM-001',
          estoque: 50,
          parcelas: 3,
          imagens: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'],
          destaque: true,
          promocao: true,
          ativo: true,
        },
        {
          nome: 'Sofá Retrátil e Reclinável 3 Lugares',
          descricao: 'Conforto supremo com estofado de alta densidade e tecido aveludado resistente.',
          preco: 1499.00,
          preco_promocional: 1299.00,
          categoria_id: catMap['Móveis'] || categories[1]?.id || '',
          codigo: 'MOV-001',
          estoque: 10,
          parcelas: 10,
          imagens: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
          destaque: true,
          promocao: true,
          ativo: true,
        },
        {
          nome: 'Jogo de Panelas Antiaderente 5 Peças',
          descricao: 'Panelas de alumínio reforçado com revestimento antiaderente de alta durabilidade.',
          preco: 280.00,
          categoria_id: catMap['Utilidades'] || categories[2]?.id || '',
          codigo: 'UTIL-001',
          estoque: 25,
          parcelas: 6,
          imagens: ['https://images.unsplash.com/photo-1583947581924-860bda6a5a83?auto=format&fit=crop&q=80&w=800'],
          destaque: true,
          promocao: false,
          ativo: true,
        },
        {
          nome: 'Mesa de Jantar com 4 Cadeiras',
          descricao: 'Mesa elegante de madeira com design moderno e cadeiras estofadas confortáveis.',
          preco: 950.00,
          preco_promocional: 849.00,
          categoria_id: catMap['Móveis'] || categories[1]?.id || '',
          codigo: 'MOV-002',
          estoque: 8,
          parcelas: 10,
          imagens: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800'],
          destaque: true,
          promocao: true,
          ativo: true,
        }
      ];

      for (const prod of DEFAULT_PRODUCTS) {
        await addDoc(collection(db, 'products'), prod);
      }
    }

    const prodSnapshot = await getDocs(collection(db, 'products'));
    const products = prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return { categories, products };
  } catch (error) {
    console.error("Error seeding initial data:", error);
    return { categories: [], products: [] };
  }
};

// ==========================================
// Categories
// ==========================================

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesCol = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCol);
    let categories = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));

    if (categories.length === 0) {
      const seeded = await seedInitialData();
      categories = seeded.categories;
    }

    return categories.filter(c => c.ativo !== false);
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
};

export const getAllCategoriesAdmin = async (): Promise<Category[]> => {
  try {
    const categoriesCol = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCol);
    return categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));
  } catch (error) {
    console.error("Error in getAllCategoriesAdmin:", error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Category;
    }
    return null;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return null;
  }
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'categories'), category);
  return docRef.id;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
};


// ==========================================
// Products
// ==========================================

export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    let products = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    if (products.length === 0) {
      const seeded = await seedInitialData();
      products = seeded.products;
    }

    return products.filter(p => p.ativo !== false);
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
};

export const getAllProductsAdmin = async (): Promise<Product[]> => {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    return productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error("Error in getAllProductsAdmin:", error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.categoria_id === categoryId && p.ativo !== false);
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const allProducts = await getProducts();
    const featured = allProducts.filter(p => p.destaque === true && p.ativo !== false);
    if (featured.length > 0) {
      return featured;
    }
    // Fallback if no specific products have destaque: true
    return allProducts.slice(0, 4);
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    return [];
  }
};

export const getPromotionalProducts = async (): Promise<Product[]> => {
  try {
    const allProducts = await getProducts();
    const promo = allProducts.filter(p => p.promocao === true && p.ativo !== false);
    if (promo.length > 0) {
      return promo;
    }
    return allProducts.filter(p => p.preco_promocional && p.preco_promocional < p.preco);
  } catch (error) {
    console.error("Error in getPromotionalProducts:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error in getProductById:", error);
    return null;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), product);
  return docRef.id;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

