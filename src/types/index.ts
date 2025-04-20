export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  specs: string[];
  useCases: string[];
  category: string;
  images?: string[];
  document?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

export interface AdminSection {
  id: string;
  name: string;
  icon: JSX.Element;
}

export interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}