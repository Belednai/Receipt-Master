# Firestore Rules Setup Guide

## 🚨 Critical: Deploy These Rules First

The 400 Bad Request errors you're seeing are due to missing or incorrect Firestore security rules. Follow these steps to fix them:

1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   - Select "Firestore" when prompted
   - Choose "Use an existing project"
   - Select your project: `receipt-master-61b65`
   - Accept the default rules file location

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🔒 Security Rules Explanation

The rules in `firestore.rules` implement the following security model:

1. **Users Collection**:
   - Users can read their own profile
   - Admins can read all user profiles
   - First user to sign up becomes admin
   - Admins can create/manage other users

2. **Products Collection**:
   - All authenticated users can read
   - Only admins can write

3. **Company Settings**:
   - All authenticated users can read
   - Only admins can write

4. **Receipts Collection**:
   - Users can read/write their own receipts
   - Admins can read/write all receipts

## 🚫 Cross-Origin-Opener-Policy Warning

The COOP warnings you're seeing are informational and shouldn't affect functionality. They occur because Firebase Auth uses popups for Google Sign-In. These warnings are a security feature of modern browsers and can be safely ignored as long as authentication works.

If you want to suppress these warnings, you can add the following headers to your hosting configuration:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cross-Origin-Opener-Policy",
            "value": "same-origin-allow-popups"
          }
        ]
      }
    ]
  }
}
```

## ✅ Verification

After deploying the rules:

1. The Firestore 400 errors should disappear
2. Google Sign-In should work properly
3. User data should be saved in Firestore
4. Role-based access should work as expected

## 🔍 Troubleshooting

If you still see errors after deploying:

1. Check Firebase Console > Firestore > Rules to verify deployment
2. Ensure your app's Firebase config matches the project
3. Try signing out and back in to refresh authentication
4. Clear browser cache if issues persist