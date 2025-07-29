# Firebase Integration Guide

This application is designed to work with Firebase as the backend. The current implementation uses localStorage as a fallback, but can be easily upgraded to use Firebase Firestore.

## 🔥 Firebase Setup

### 1. Install Firebase
```bash
npm install firebase
```

### 2. Enable Firebase Services
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `receipt-master-61b65`
3. Enable the following services:
   - **Authentication** (for user management)
   - **Firestore Database** (for data storage)
   - **Analytics** (optional, for usage tracking)

### 3. Configure Firestore Security Rules
In the Firebase Console, go to Firestore Database > Rules and set up these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - read by all authenticated users, write by admins only
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Company settings - read by all authenticated users, write by admins only
    match /companySettings/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Receipts - users can read their own receipts, admins can read all
    match /receipts/{receiptId} {
      allow read: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Users - users can read their own profile, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 4. Enable Firebase in the Application

1. **Uncomment Firebase imports** in `src/lib/firebase-config.ts`:
```typescript
// Remove the comment markers /* */ and uncomment the Firebase code
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
```

2. **Update product-utils.ts** to use Firebase:
```typescript
// Replace localStorage functions with Firebase functions
import { saveProduct as saveProductToFirebase } from './firebase-utils';
export const saveProduct = saveProductToFirebase;
```

3. **Update receipt-utils.ts** to use Firebase:
```typescript
// Replace localStorage functions with Firebase functions
import { saveReceiptToFirebase } from './firebase-utils';
export const saveReceiptToDatabase = saveReceiptToFirebase;
```

## 🏗️ Database Structure

### Collections

#### 1. `products`
```typescript
{
  id: string,
  name: string,
  unitPrice: number,
  category?: string,
  code?: string,
  stockLevel?: number,
  isActive: boolean,
  createdAt: Timestamp,
  createdBy: string
}
```

#### 2. `companySettings`
```typescript
{
  name: string,
  address: string,
  phone: string,
  email: string,
  footer?: string,
  logo?: string,
  updatedAt: Timestamp,
  updatedBy: string
}
```

#### 3. `receipts`
```typescript
{
  id: string,
  companyInfo: {
    name: string,
    address: string,
    phone: string,
    email: string
  },
  customerInfo: {
    name: string,
    email: string,
    address: string,
    phone: string
  },
  items: Array<{
    id: string,
    name: string,
    quantity: number,
    unitPrice: number,
    tax: number
  }>,
  notes: string,
  subtotal: number,
  totalTax: number,
  total: number,
  createdAt: Timestamp,
  createdBy: string
}
```

#### 4. `users`
```typescript
{
  id: string,
  username: string,
  name: string,
  role: 'admin' | 'cashier',
  email: string,
  createdAt: Timestamp,
  isActive: boolean
}
```

## 🔐 Authentication Setup

### 1. Enable Email/Password Authentication
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Email/Password authentication
3. Add your admin users manually or create a signup flow

### 2. Create Initial Admin User
```javascript
// In Firebase Console > Authentication > Users
// Add a user with:
// Email: admin@receiptmaster.com
// Password: admin123
// Then in Firestore, create a document in /users/{uid}:
{
  username: "admin",
  name: "Administrator",
  role: "admin",
  email: "admin@receiptmaster.com",
  createdAt: Timestamp.now(),
  isActive: true
}
```

## 🚀 Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=AIzaSyDwvJJZrQvn4Pt1A85npDVMAteY1pNvO4U
VITE_FIREBASE_AUTH_DOMAIN=receipt-master-61b65.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=receipt-master-61b65
VITE_FIREBASE_STORAGE_BUCKET=receipt-master-61b65.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=175209742806
VITE_FIREBASE_APP_ID=1:175209742806:web:11713f36cb881b41bba477
VITE_FIREBASE_MEASUREMENT_ID=G-TH45Q4VBBP
```

## 📊 Features Available

### Admin Features
- ✅ **Product Management**: Create, edit, delete products
- ✅ **Company Settings**: Configure receipt header information
- ✅ **User Management**: Manage system users
- ✅ **Receipt Analytics**: View all receipts and statistics

### Cashier Features
- ✅ **Receipt Creation**: Generate receipts using admin-defined products
- ✅ **Product Selection**: Click-to-add products with quantity selection
- ✅ **Real-time Calculations**: Automatic subtotal and tax calculations
- ✅ **PDF Export**: Download receipts as PDF
- ✅ **Email Integration**: Send receipts via email client

### Security Features
- ✅ **Role-based Access**: Admin vs Cashier permissions
- ✅ **Data Validation**: Input validation and error handling
- ✅ **Secure Routes**: Protected routes based on user roles

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check if Firebase package is installed
   - Verify Firebase configuration in `firebase-config.ts`

2. **Permission denied errors**
   - Check Firestore security rules
   - Verify user authentication status
   - Ensure user has correct role permissions

3. **Data not loading**
   - Check browser console for errors
   - Verify Firestore collection names
   - Check network connectivity

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 📈 Performance Optimization

1. **Index Optimization**: Create composite indexes for queries
2. **Pagination**: Implement pagination for large datasets
3. **Caching**: Use React Query for client-side caching
4. **Lazy Loading**: Implement lazy loading for components

## 🔄 Migration from localStorage

The application currently uses localStorage as a fallback. To migrate to Firebase:

1. **Backup existing data**:
```javascript
// In browser console
const products = JSON.parse(localStorage.getItem('products') || '[]');
const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
console.log('Products:', products);
console.log('Receipts:', receipts);
```

2. **Import data to Firebase**:
   - Use Firebase Console to manually add data
   - Or create a migration script

3. **Update application code**:
   - Replace localStorage functions with Firebase functions
   - Update authentication to use Firebase Auth
   - Test all functionality

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test with different user roles
4. Check Firestore security rules

The application is designed to be production-ready once Firebase is properly configured and deployed. 