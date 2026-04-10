export interface DeleteProductRequest {
  id: string;
}

export interface GetProductRequest {
  id: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description?: string;
  available?: number;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  available?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: number;
  reserved: number;
}

export interface ReserveProductItem {
  productId: string;
  quantity: number;
}

export interface ReserveProductRequest {
  items: ReserveProductItem[];
}

export interface ReservedItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface ReserveProductResponse {
  items: ReservedItem[];
}

export type ReleaseProductItem = ReserveProductItem;

export type ReleaseProductRequest = ReserveProductRequest;
