import { ProjectView } from "@/components/projects/ProjectView";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectView projectId={projectId} />;
}
