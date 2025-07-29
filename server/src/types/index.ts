export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  balance: number;
  account_type: 'Savings' | 'Checking';
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: 'debit' | 'credit' | 'transfer';
  amount: number;
  description: string;
  recipient_id?: number;
  recipient_name?: string;
  status: 'completed' | 'pending' | 'failed';
  transaction_date: Date;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  account_type?: 'Savings' | 'Checking';
}

export interface TransferRequest {
  recipient_id: number;
  amount: number;
  description?: string;
}

export interface DepositRequest {
  amount: number;
  payment_method: 'card' | 'bank' | 'mobile';
  description?: string;
}