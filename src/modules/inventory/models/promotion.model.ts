export interface Promotion {
  id_promotion: number;
  start_date: string;
  end_date: string;
  description?: string | null;
  discount: number;
  id_product: number;
}

export type PromotionRequest = Omit<Promotion, 'id_promotion'>;

export interface PromotionView extends Promotion {
  product_name: string;
}
