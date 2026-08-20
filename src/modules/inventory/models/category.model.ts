export interface Category {
  id_category: number;
  category_name: string;
  category_description?: string | null;
}

export type CategoryRequest = Pick<Category, 'category_name' | 'category_description'>;
