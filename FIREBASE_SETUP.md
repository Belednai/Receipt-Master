# Firebase Setup Guide

## 🔧 **Firebase Configuration Required**

The application is currently running in **development mode** which allows testing without Firebase configuration. However, for production use, you need to properly configure Firebase.

## 📋 **Steps to Enable Google Authentication**

### 1. **Firebase Console Setup**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `receipt-master-61b65`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. **Enable** Google Sign-In
6. Add your authorized domains:
   - `localhost` (for development)
   - Your production domain (when deployed)
7. Save the configuration

### 2. **Firestore Database Setup**

1. In Firebase Console, go to **Firestore Database**
2. Create database if not exists
3. Set up security rules for the `users` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. **Development vs Production**

- **Development Mode**: Currently active, works without Firebase configuration
- **Production Mode**: Requires proper Firebase setup

## 🚀 **Current Status**

✅ **Development Mode**: Working with simulated authentication
✅ **User Management**: Functional with development data
✅ **Role-Based Access**: Admin and Cashier roles working
✅ **Receipt Creation**: Enhanced metadata tracking active

## 🔄 **Switching to Production**

Once Firebase is properly configured:

1. The app will automatically detect Firebase configuration
2. Google Sign-In will work with real authentication
3. User data will be stored in Firestore
4. All features will work with real Firebase backend

## 🛠 **Troubleshooting**

If you see `CONFIGURATION_NOT_FOUND` errors:
1. Ensure Google Sign-In is enabled in Firebase Console
2. Check that your domain is authorized
3. Verify Firebase configuration in `src/lib/firebase-config.ts`

## 📝 **Development Mode Features**

- ✅ Google Sign-In simulation
- ✅ Email/Password authentication
- ✅ Admin user creation
- ✅ Cashier account management
- ✅ Role-based access control
- ✅ Receipt metadata tracking

The application is fully functional in development mode for testing purposes! 