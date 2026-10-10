// Your Firebase UID (Firebase Console > Authentication > Users). Set NEXT_PUBLIC_ADMIN_UID in .env.local.
// How to find it: sign up on the site once (via /signup), then go to
// Firebase Console → Authentication → Users → copy the "User UID" column.
// Put it in .env.local as NEXT_PUBLIC_ADMIN_UID=your-uid-here (don't hardcode it here).
export const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;