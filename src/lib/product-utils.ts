export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  category?: string;
  code?: string;
  stockLevel?: number;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  footer?: string;
  logo?: string;
  updatedAt: string;
  updatedBy: string;
}

// Firebase functions (will be implemented when Firebase is properly set up)
export const saveProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  // For now, fallback to localStorage
  const newProduct: Product = {
    ...product,
    id: `PROD-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
  };
  
  const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
  existingProducts.push(newProduct);
  localStorage.setItem('products', JSON.stringify(existingProducts));
  
  return newProduct;
};

export const getProducts = async (): Promise<Product[]> => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products.filter((product: Product) => product.isActive);
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const productIndex = products.findIndex((p: Product) => p.id === id);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  products[productIndex] = { ...products[productIndex], ...updates };
  localStorage.setItem('products', JSON.stringify(products));
  
  return products[productIndex];
};

export const deleteProduct = async (id: string): Promise<void> => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const updatedProducts = products.filter((p: Product) => p.id !== id);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
};

// Company settings functions
export const saveCompanySettings = async (settings: Omit<CompanySettings, 'updatedAt' | 'updatedBy'>): Promise<CompanySettings> => {
  const newSettings: CompanySettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin',
  };
  
  localStorage.setItem('companySettings', JSON.stringify(newSettings));
  return newSettings;
};

export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  const settings = localStorage.getItem('companySettings');
  return settings ? JSON.parse(settings) : null;
}; 