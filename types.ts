
export enum Category {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  BILLS = 'Bills & Utilities',
  HEALTH = 'Health & Wellness',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'saving' | 'warning' | 'tip';
}
