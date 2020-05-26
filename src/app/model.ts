export interface MenuData {
  data: Menu[];
}

export interface Menu {
  id: number;
  name: string;
  items: Item[];
}

export interface Item {
  description: string;
  id: number;
  img_url: string;
  name: string;
  price_eur: number;
  price_usd: number;
  type_id: number;
}

export interface OrderDetail {
  id: number;
  name: string;
  price_eur: number;
  price_usd: number;
  address: string;
  contact: string;
  status: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  item_id: number;
  order_id: number;
  price_eur: number;
  price_usd: number;
  quantity: number;
  total_price_eur: number;
  total_price_usd: number;
}
