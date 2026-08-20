export interface Product {
  id_product: number;
  product_name: string;
  product_description?: string | null;
  sale_price: number;
  stock: number;
  status_product: number;
  id_category: number;
}

export interface ProductFull {
  id_product: number;
  product_name: string;
  category_name: string;
  supplier_name?: string | null;
  sale_price: number;
  stock: number;
}

export type ProductRequest = Omit<Product, 'id_product'>;

export interface ProductFormValue extends ProductRequest {
  supplier_ids: number[];
}
