import { Card } from "primereact/card";
import FooterCard from "./footerCard";
import { Project } from "../../store/project/types";
import { formatCurrency, formatDate } from "../../helpers/util";
import Swal from "sweetalert2";
import { ProposalDto } from "../../store/proposal/types";
import useAuthStore from "../../store/auth/auth.store";
import useProposalStore from "../../store/proposal/proposal.store";
import useProjectStore from "../../store/project/project.store";

interface Props {
  project: Project;
  onEdit?: (project: Project) => void;
  hideFooter?: boolean;
}

function ProjectCard({ project, hideFooter = false, onEdit }: Props) {
  const userLogged = useAuthStore((state) => state.userLogged);
  const createProposal = useProposalStore((state) => state.createProposal);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const prepareProposalData = (salary: number, days: number): ProposalDto => {
    return {
      userId: userLogged?._id!,
      projectId: project._id,
      nameProject: project.name,
      userName: `${userLogged?.name} ${userLogged?.lastname}`,
      userEmail: userLogged?.email!,
      status: "pending",
      salary,
      days,
    };
  };

  const onDelete = (projectId: Project) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este proyecto después de eliminarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(projectId._id);
      }
    });
  };

  return (
    <>
      <Card
        key={project._id}
        title={project.name}
        className="mt-4 w-full"
        footer={
          !hideFooter && (
            <FooterCard
              project={project}
              // onApply={onApply}
              onDelete={onDelete}
              onEdit={onEdit}
              onCreateProposal={(salary, days) =>
                createProposal(prepareProposalData(salary, days))
              }
            />
          )
        }
      >
        <div className="flex flex-col h-full">
          {/* Descripción con icono */}
          <div className="min-h-[100px] max-h-[100px] overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-700">{project.description}</p>
            </div>
          </div>

          {/* Tecnologías con icono */}
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Categoría
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {project.techs.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-100 text-blue-800 text-sm p-1 px-3 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Fechas con icono */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4 p-2 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <time>{formatDate(project.dateInit.toString())}</time>
            <span>-</span>
            <time>{formatDate(project.dateEnd.toString())}</time>
          </div>

          {/* Freelancers con icono (el diseño que te gustó) */}
          <div className="flex items-center text-sm mb-4 p-2 bg-indigo-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="ml-2 font-medium text-gray-700">
              {project.freelancers}{" "}
              {project.freelancers === 1 ? "Freelancer" : "Freelancers"}
            </span>
          </div>

          {/* Salario con icono */}
          <div className="mt-auto p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-700">
                Salario: {formatCurrency(project.salary)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default ProjectCard;
