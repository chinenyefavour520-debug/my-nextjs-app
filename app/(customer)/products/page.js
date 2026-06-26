// boutique-frontend/app/(customer)/products/page.js

import { Suspense } from 'react';
import ProductsContent from './content';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Loading products...</p>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
