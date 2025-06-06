// app/search/page.jsx
import { Suspense } from "react";
import PageShiftNavLayout from "@/layouts/PageShiftNavLayout";
import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <PageShiftNavLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-white">Loading search results...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </PageShiftNavLayout>
  );
}
