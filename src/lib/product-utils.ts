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

import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-config';

const PRODUCTS_COLLECTION = 'products';
const COMPANY_SETTINGS_COLLECTION = 'companySettings';

export const saveProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: serverTimestamp(),
    });

    return {
      ...product,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error saving product:', error);
    throw new Error('Failed to save product');
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to load products');
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, updates);
    
    return {
      id,
      ...updates,
      createdAt: updates.createdAt || new Date().toISOString(),
    } as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// Company settings functions
export const saveCompanySettings = async (settings: Omit<CompanySettings, 'updatedAt' | 'updatedBy'>): Promise<CompanySettings> => {
  try {
    const settingsQuery = query(collection(db, COMPANY_SETTINGS_COLLECTION));
    const querySnapshot = await getDocs(settingsQuery);
    
    const newSettings: CompanySettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
    };

    if (querySnapshot.empty) {
      await addDoc(collection(db, COMPANY_SETTINGS_COLLECTION), {
        ...newSettings,
        updatedAt: serverTimestamp(),
      });
    } else {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...newSettings,
        updatedAt: serverTimestamp(),
      });
    }
    
    return newSettings;
  } catch (error) {
    console.error('Error saving company settings:', error);
    throw new Error('Failed to save company settings');
  }
};

export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const settingsQuery = query(collection(db, COMPANY_SETTINGS_COLLECTION));
    const querySnapshot = await getDocs(settingsQuery);
    
    if (querySnapshot.empty) {
      // Return null if no settings exist - let the user configure them
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      name: data.name || "",
      address: data.address || "",
      phone: data.phone || "",
      email: data.email || "",
      footer: data.footer || "",
      logo: data.logo || "",
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedBy: data.updatedBy || 'system',
    };
  } catch (error) {
    console.error('Error getting company settings:', error);
    return null;
  }
}; 