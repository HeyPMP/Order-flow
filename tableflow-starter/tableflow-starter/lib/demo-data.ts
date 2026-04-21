import { MenuItem, TableOrder } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 'm1',
    category: 'Starters',
    name: 'Crispy Chilli Potato',
    description: 'Crispy potato tossed in sweet chilli sauce.',
    price: 220,
    available: true
  },
  {
    id: 'm2',
    category: 'Main Course',
    name: 'Paneer Tikka Masala',
    description: 'Rich tomato gravy with soft paneer cubes.',
    price: 340,
    available: true
  },
  {
    id: 'm3',
    category: 'Drinks',
    name: 'Classic Mojito',
    description: 'Mint, lime, soda, and crushed ice.',
    price: 180,
    available: true
  },
  {
    id: 'm4',
    category: 'Desserts',
    name: 'Chocolate Brownie',
    description: 'Warm brownie with chocolate sauce.',
    price: 160,
    available: true
  }
];

export const demoOrders: TableOrder[] = [
  {
    id: 'o1',
    tableSlug: 't1',
    status: 'preparing',
    total: 560,
    createdAt: new Date().toISOString(),
    items: [
      { itemId: 'm1', name: 'Crispy Chilli Potato', price: 220, quantity: 1 },
      { itemId: 'm3', name: 'Classic Mojito', price: 180, quantity: 2 }
    ],
    note: 'Less spicy for starter'
  },
  {
    id: 'o2',
    tableSlug: 't3',
    status: 'served',
    total: 340,
    createdAt: new Date().toISOString(),
    items: [
      { itemId: 'm2', name: 'Paneer Tikka Masala', price: 340, quantity: 1 }
    ]
  }
];
