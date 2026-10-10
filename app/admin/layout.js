import "./admin.css";
import { AuthProvider } from "@/components/AuthContext";

export const metadata = { title: "Admin Panel", robots: { index: false, follow: false } };

export default function AdminLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
