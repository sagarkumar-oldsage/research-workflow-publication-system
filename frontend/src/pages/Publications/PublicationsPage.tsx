import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { publicationsApi } from "../../services/publicationsApi";
import { QUERY_KEYS } from "../../utils/constants";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  under_review: "bg-yellow-100 text-yellow-700",
  revision_requested: "bg-orange-100 text-orange-700",
  accepted: "bg-green-100 text-green-700",
  published: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

export default function PublicationsPage() {
  const { data: publications = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.publications,
    queryFn: () => publicationsApi.list(),
  });

  if (isLoading) return <p className="p-6">Loading publications...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Link to="/publications/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Publication
        </Link>
      </div>

      {publications.length === 0 ? (
        <p className="text-gray-500">No publications yet.</p>
      ) : (
        <div className="space-y-3">
          {publications.map((pub) => (
            <Link
              key={pub.id}
              to={`/publications/${pub.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{pub.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ml-4 capitalize ${STATUS_COLORS[pub.status] ?? ""}`}>
                  {pub.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{pub.authors.join(", ")}</p>
              <div className="mt-2 flex gap-3 text-xs text-gray-400">
                <span className="capitalize">{pub.pub_type.replace(/_/g, " ")}</span>
                {pub.doi && <span>DOI: {pub.doi}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
