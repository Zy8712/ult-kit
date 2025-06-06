// src/app/page.jsx
// This can remain a Server Component if ToolCardPagination is self-sufficient for client-side data
// or make it a client component if you need client interactions here.
// For now, keeping it simple as it just renders client components.

import PageShiftNavLayout from "@/layouts/PageShiftNavLayout"; // Your existing layout
import ToolCardPagination from "@/components/tool-card-components/card-rendering-techniques/ToolCardPagination"; // Adjust path

export default function Home() {
  return (
    <>
      <PageShiftNavLayout>
        <div className="flex flex-wrap justify-center gap-8 px-3 py-8"> {/* Added some padding */}
          {/* ToolCardPagination no longer needs the 'data' prop */}
          <ToolCardPagination />
        </div>
      </PageShiftNavLayout>
    </>
  );
}