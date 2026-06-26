// boutique-frontend/app/(auth)/layout.js
// Layout for auth pages (no header/footer)

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}