// app/search/SearchResults.jsx
'use client';
import { useSearchParams } from "next/navigation";
import tools from "@/data/all-sites.json";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filtered = tools.filter((tool) => {
    const name = tool.primary_details.name.toLowerCase();
    const tags = tool.filtering_details.tags.join(" ").toLowerCase();
    const description = tool.primary_details.description.toLowerCase();

    return (
      name.includes(query) ||
      tags.includes(query) ||
      description.includes(query)
    );
  });

  return (
    <>
      {query && (
        <div className="mt-6 text-white">
          <h2 className="text-lg font-semibold mb-2 text-white">
            Showing results for &quot;<span className="text-purple-600">{query}</span>&quot;
          </h2>

          {filtered.length > 0 ? (
            <div className="grid gap-4">
              {filtered.map((tool) => (
                <div
                  key={tool.primary_details.id}
                  className="p-4 border rounded shadow"
                >
                  <h3 className="text-xl font-bold">
                    {tool.primary_details.name}
                  </h3>
                  <p className="text-sm">{tool.primary_details.description}</p>
                  <div className="mt-2">
                    <a
                      href={tool.links.official}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline underline-offset-2"
                    >
                      Official Site
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </>
  );
}
