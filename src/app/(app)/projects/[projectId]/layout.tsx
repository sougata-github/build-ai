import { ProjectLayout as ProjectLayoutComponent } from "@/components/projects/ProjectLayout";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectLayoutComponent projectId={projectId}>
      {children}
    </ProjectLayoutComponent>
  );
}
