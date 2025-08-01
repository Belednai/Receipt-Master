import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, CompanySettings } from "./product-utils";
import { ReceiptData } from "./receipt-utils";

// Products collection
const PRODUCTS_COLLECTION = "products";
const COMPANY_SETTINGS_COLLECTION = "companySettings";
const RECEIPTS_COLLECTION = "receipts";

// Product functions
export const saveProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: serverTimestamp(),
    });
    
    const newProduct: Product = {
      ...product,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    
    return newProduct;
  } catch (error) {
    console.error("Error saving product:", error);
    throw new Error("Failed to save product");
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        unitPrice: data.unitPrice,
        category: data.category || "",
        code: data.code || "",
        stockLevel: data.stockLevel || 0,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdBy: data.createdBy,
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    throw new Error("Failed to load products");
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    // Get the updated product
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      throw new Error("Product not found");
    }
    
    const data = productDoc.data();
    return {
      id: productDoc.id,
      name: data.name,
      unitPrice: data.unitPrice,
      category: data.category || "",
      code: data.code || "",
      stockLevel: data.stockLevel || 0,
      isActive: data.isActive,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      createdBy: data.createdBy,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

// Company settings functions
export const saveCompanySettings = async (settings: Omit<CompanySettings, 'updatedAt' | 'updatedBy'>): Promise<CompanySettings> => {
  try {
    // Check if settings already exist
    const settingsQuery = query(collection(db, COMPANY_SETTINGS_COLLECTION));
    const querySnapshot = await getDocs(settingsQuery);
    
    let docRef;
    if (querySnapshot.empty) {
      // Create new settings
      docRef = await addDoc(collection(db, COMPANY_SETTINGS_COLLECTION), {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: 'admin',
      });
    } else {
      // Update existing settings
      const existingDoc = querySnapshot.docs[0];
      docRef = existingDoc.ref;
      await updateDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: 'admin',
      });
    }
    
    const newSettings: CompanySettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
    };
    
    return newSettings;
  } catch (error) {
    console.error("Error saving company settings:", error);
    throw new Error("Failed to save company settings");
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
    console.error("Error getting company settings:", error);
    return null;
  }
};

// Receipt functions
export const saveReceiptToFirebase = async (receiptData: ReceiptData): Promise<void> => {
  try {
    await addDoc(collection(db, RECEIPTS_COLLECTION), {
      ...receiptData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving receipt:", error);
    throw new Error("Failed to save receipt");
  }
};

export const getReceiptsFromFirebase = async (): Promise<ReceiptData[]> => {
  try {
    const q = query(
      collection(db, RECEIPTS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const receipts: ReceiptData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      receipts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as ReceiptData);
    });
    
    return receipts;
  } catch (error) {
    console.error("Error getting receipts:", error);
    throw new Error("Failed to load receipts");
  }
}; 