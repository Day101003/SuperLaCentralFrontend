export interface Order {
  id_order_purchase: number;
  date_purchase: string;
  status_order: number;
  total: number;
}

export interface OrderRequest {
  status_order: number;
  total: number;
}

export interface OrderDetail {
  id_detail_order: number;
  quantity: number;
  purchase_price: number;
  id_order_purchase: number;
  id_product: number;
}

export type OrderDetailRequest = Omit<OrderDetail, 'id_detail_order'>;

export interface OrderView extends Order {
  product_count: number;
  unit_count: number;
}

export interface OrderFormDetail {
  id_product: number;
  quantity: number;
  purchase_price: number;
}
export interface OrderFormValue {
  status_order: number;
  details: OrderFormDetail[];
  total: number;
}
