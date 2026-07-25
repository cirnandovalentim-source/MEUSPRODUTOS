export interface Category {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  ativo: boolean;
}

export interface Product {
  id: string;
  categoria_id: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_promocional?: number;
  parcelas: number;
  estoque: number;
  codigo: string;
  imagens: string[];
  destaque: boolean;
  promocao: boolean;
  ativo: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}
