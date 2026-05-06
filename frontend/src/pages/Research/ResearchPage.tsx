import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { researchApi } from "../../services/researchApi";
import { QUERY_KEYS } from "../../utils/constants";

export default function ResearchPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: () => researchApi.listProjects(),
  });

  if (isLoading) return <p className="p-6">Loading projects...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Research Projects</h1>
        <Link to="/research/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No research projects yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/research/${project.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold truncate">{project.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                  {project.status.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-400">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
