import { PortfolioProjectsRepository } from "@/repositories/portfolio-projects-repository";
import { ProjectsClient } from "./projects-client";

export const metadata = {
  title: "Client Projects | Admin Portal",
};

export default async function AdminProjectsPage() {
  const projects = await PortfolioProjectsRepository.getProjects();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Client Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Manage ongoing and completed client projects and portfolios.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-6">
        <ProjectsClient initialProjects={projects} />
      </div>
    </div>
  );
}
