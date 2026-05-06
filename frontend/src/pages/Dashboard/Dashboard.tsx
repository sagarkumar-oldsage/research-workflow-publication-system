import { useQuery } from "@tanstack/react-query";
import { researchApi } from "../../services/researchApi";
import { publicationsApi } from "../../services/publicationsApi";
import { QUERY_KEYS } from "../../utils/constants";

export default function Dashboard() {
  const { data: projects = [] } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: () => researchApi.listProjects({ limit: 5 }),
  });

  const { data: publications = [] } = useQuery({
    queryKey: QUERY_KEYS.publications,
    queryFn: () => publicationsApi.list({ limit: 5 }),
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Projects" value={projects.filter((p) => p.status === "in_progress").length} />
        <StatCard label="Publications" value={publications.length} />
        <StatCard label="Pending Reviews" value={0} />
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.id} className="border rounded p-3 flex justify-between">
                <span>{p.title}</span>
                <span className="text-sm text-gray-500 capitalize">{p.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Publications</h2>
        {publications.length === 0 ? (
          <p className="text-gray-500">No publications yet.</p>
        ) : (
          <ul className="space-y-2">
            {publications.map((p) => (
              <li key={p.id} className="border rounded p-3 flex justify-between">
                <span>{p.title}</span>
                <span className="text-sm text-gray-500 capitalize">{p.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4 text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
