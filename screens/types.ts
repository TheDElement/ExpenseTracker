export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    type: 'Credit' | 'Debit' | 'Refund';
    location: string;
    date: string;
  }