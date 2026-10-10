import "../admin/admin.css";
import { AuthProvider } from "@/components/AuthContext";

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default function AdminLoginLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
