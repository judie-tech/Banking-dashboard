export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  balance: number;
  accountType: 'Savings' | 'Checking';
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  sender?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  accountType: 'Savings' | 'Checking';
}

export interface TransferForm {
  receiverId: number;
  amount: number;
  notes: string;
}