export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  specs: string[];
  useCases: string[];
  category: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}