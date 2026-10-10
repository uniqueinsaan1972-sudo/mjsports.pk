# MJ Sports - setup after replacing the project

1. Keep your existing `.env.local` (it is not inside this ZIP). It needs these keys (see `.env.example`):
   NEXT_PUBLIC_FIREBASE_* (6 keys), NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_ADMIN_UID.
   Server keys such as FIREBASE_PRIVATE_KEY are NOT needed anymore.
2. `npm install` then `npm run build` then `npm run dev`.
3. Firebase Console > Build > **Firestore Database** > Rules (not Realtime Database).
   Delete everything there, paste the content of `firestore.rules`, press Publish.
   The rules already contain your admin UID. Admin access is enforced by these rules.
4. Admin login: /admin-login with the account whose UID equals NEXT_PUBLIC_ADMIN_UID.
5. Vercel: add the same env keys, set NEXT_PUBLIC_SITE_URL=https://www.mjsports.pk, redeploy.
   Add both mjsports.pk and www.mjsports.pk under Domains (the app redirects to www).
6. Real logo: put your logo file at `public/brand/logo.png` (transparent PNG, about 400px wide).
   The header and footer use it automatically; otherwise the crown wordmark is shown.
7. After one live click-through with no CSP warnings in the browser console, set CSP_MODE=enforce.
8. Submit https://www.mjsports.pk/sitemap.xml in Google Search Console.
