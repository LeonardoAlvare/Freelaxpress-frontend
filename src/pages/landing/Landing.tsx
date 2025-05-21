import useProjectStore from "../../store/project/project.store";
import { useEffect, useState } from "react";
import ProjectCard from "../../components/project-card/ProjectCard";
import LandingHeader from "../../components/landing-header/LandingHeader";
import { Project } from "../../store/project/types";
import ProjectForm from "../../components/project-form/ProjectForm";
import { Button } from "primereact/button";
import useAuthStore from "../../store/auth/auth.store";

export default function Landing() {
  const userLogged = useAuthStore((state) => state.userLogged);
  const getAllProjects = useProjectStore((state) => state.getAllProjects);
  const allProjects = useProjectStore((state) => state.allProjects);
  const [projectSelected, setProjectSelected] = useState<Project | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEdit = (projectId: Project) => {
    setProjectSelected(projectId);
    setShowForm(true);
  };

  const onHideForm = () => {
    setShowForm(false);
    setProjectSelected(undefined);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const sortedProjects = [...allProjects].sort((a, b) => {
    const userId = String(userLogged?._id);
    const getProjectOwnerId = (p: Project) =>
      typeof p.userId === "object" && p.userId !== null
        ? String((p.userId as any)._id)
        : String(p.userId);

    const aIsMine = getProjectOwnerId(a) === userId;
    const bIsMine = getProjectOwnerId(b) === userId;
    return Number(bIsMine) - Number(aIsMine);
  });

  const isFreelancer = userLogged?.isFreelancer;

  return (
    <main className="h-svh bg-gray-100">
      <LandingHeader />

      <section className="p-4 mt-4">
        {userLogged?._id && !isFreelancer && (
          <div className="w-full flex justify-end items-center">
            <Button
              label="Crear proyecto"
              icon="pi pi-plus"
              iconPos="right"
              onClick={handleShowForm}
            />
          </div>
        )}

        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                hideFooter={false}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <section className="w-full flex flex-col justify-center items-center mt-40">
            <figure className="w-1/2">
              <img
                src="/empty.svg"
                alt="No hay proyectos"
                className="w-full h-32"
              />
            </figure>
            <h1 className="text-3xl font-bold text-gray-500">
              No hay proyectos
            </h1>
          </section>
        )}
      </section>

      <ProjectForm
        defaultValues={projectSelected}
        visible={showForm}
        onHide={onHideForm}
      />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Volver arriba"
        >
          <span className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-300 rounded-full scale-x-0 group-hover:scale-x-75 transition-transform duration-300 origin-center"></span>
          </span>
          <span className="sr-only">Volver arriba</span>
        </button>
      )}
    </main>
  );
}
