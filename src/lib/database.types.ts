export type Product = {
  id: string;
  titulo: string;
  link: string;
  imagem: string;
  preco: string | null;
  preco_valor: number | null;
  categoria: string | null;
  criado_em: string;
  busca: string;
};

export type Database = {
  public: {
    Tables: {
      produtos: {
        Row: Product;
        Insert: Omit<Product, "busca"> & { busca?: string };
        Update: Partial<Omit<Product, "id" | "busca">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
