export interface Supplier {
  id_supplier: number;
  supplier_name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
}

export interface SupplierProductRelation {
  id_supplier_product: number;
  id_supplier: number;
  id_product: number;
}
