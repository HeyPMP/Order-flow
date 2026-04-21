export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
};

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type TableOrder = {
  id: string;
  tableSlug: string;
  status: 'new' | 'accepted' | 'preparing' | 'served' | 'paid';
  total: number;
  createdAt: string;
  note?: string;
  items: CartItem[];
};

export type ServiceRequestType = 'waiter' | 'need_bill' | 'water' | 'assistance';
