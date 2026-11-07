export interface DemoUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar: string;
  rating: number;
  verified: boolean;
  memberSince: string;
}

export const DEMO_USERS: Record<'seller' | 'buyer', DemoUser> = {
  seller: {
    _id: '674000000000000000000001',
    id: '674000000000000000000001',
    name: 'Sushant Ravi',
    email: 'sushant.ravi.cg@gmail.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.9,
    verified: true,
    memberSince: '2024-01-15',
  },
  buyer: {
    _id: '674000000000000000000002',
    id: '674000000000000000000002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 91234 56789',
    location: 'Mumbai, Maharashtra',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.8,
    verified: true,
    memberSince: '2024-03-10',
  },
};

export function getDemoSeller(): DemoUser {
  return DEMO_USERS.seller;
}

export function getDemoBuyer(): DemoUser {
  return DEMO_USERS.buyer;
}

export function getCurrentUser(role: 'seller' | 'buyer' = 'buyer'): DemoUser {
  return DEMO_USERS[role] || DEMO_USERS.buyer;
}
