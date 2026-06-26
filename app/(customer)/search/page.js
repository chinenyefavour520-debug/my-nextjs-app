// boutique-frontend/app/(customer)/search/page.js

import { Suspense } from 'react';
import SearchContent from './content';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Loading search results...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchContent />
    </Suspense>
  );
}
