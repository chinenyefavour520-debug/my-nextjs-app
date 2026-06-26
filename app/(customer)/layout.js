// boutique-frontend/app/(customer)/layout.js
// Customer layout with header and footer

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}