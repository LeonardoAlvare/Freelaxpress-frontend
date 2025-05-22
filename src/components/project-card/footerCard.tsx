import { Dialog } from "primereact/dialog";
import { useState } from "react";
import useAuthStore from "../../store/auth/auth.store";
import { Project, StatusProject } from "../../store/project/types";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ProposalDto } from "../../store/proposal/types";

interface Props {
  project: Project;
  onEdit?: (projectId: Project) => void;
  onDelete?: (projectId: Project) => void;
  // onApply?: (projectId: Project) => void;
  onCreateProposal?: (salary: number, days: number) => Promise<void>;
  onApply?: (proposal: ProposalDto) => Promise<void>;
}

function FooterCard({ project, onCreateProposal, onDelete, onEdit }: Props) {
  const userLogged = useAuthStore((state) => state.userLogged);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [salary, setSalary] = useState<number>(0);
  const [days, setDays] = useState<number>(1);

  const isProjectActive = project.status === StatusProject.Active;

  const handleEdit = () => {
    onEdit?.(project);
  };

  const handleDelete = () => {
    onDelete?.(project);
  };

  const handleOpenApplyDialog = () => {
    if (!userLogged?._id) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para postularte a este proyecto",
        icon: "warning",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/login");
        }
      });
      return;
    }
    setVisible(true);
  };

  const handleApply = async () => {
    if (!userLogged?._id || !onCreateProposal) return;

    if (salary <= 0 || days <= 0) {
      Swal.fire({
        title: "Datos inválidos",
        text: "El salario y los días deben ser mayores a cero",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => {
          const container = Swal.getContainer();
          if (container) container.style.zIndex = "99999";
        },
      });
      return;
    }

    try {
      await onCreateProposal(salary, days);
      setVisible(false);
      Swal.fire({
        title: "¡Postulación exitosa!",
        text: "Tu postulación ha sido enviada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al enviar tu postulación",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
    }
  };

  const handleProposals = () => {
    navigate(`/project/${project._id}`);
  };

  const isOwner = userLogged?._id === project.userId;
  const isFreelance = userLogged?.isFreelancer;

  return (
    <>
      <section className="w-full flex gap-4 items-center justify-end mb-6">
        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <button
              disabled={!isProjectActive}
              onClick={handleEdit}
              className={`flex items-center gap-2 ${
                isProjectActive
                  ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } px-4 py-2 rounded-lg transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Editar</span>
            </button>

            <button
              disabled={!isProjectActive}
              onClick={handleDelete}
              className={`flex items-center gap-2 ${
                isProjectActive
                  ? "bg-red-100 hover:bg-red-200 text-red-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } px-4 py-2 rounded-lg transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Eliminar</span>
            </button>

            <button
              onClick={handleProposals}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Postulaciones</span>
            </button>
          </div>
        )}

        {!isOwner && isFreelance && (
          <button
            onClick={handleOpenApplyDialog}
            disabled={!isProjectActive}
            className={`flex items-center gap-2 ${
              isProjectActive
                ? "bg-green-100 hover:bg-green-200 text-green-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } px-4 py-2 rounded-lg transition-colors font-medium`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Postularse</span>
          </button>
        )}
      </section>

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Postularse al proyecto"
        className="rounded-lg shadow-xl"
        headerClassName="border-b-0 p-6"
        contentClassName="p-6"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salario propuesto
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="salary"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                min="0"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Días estimados de trabajo
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                id="days"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                min="1"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-2 border-gray-300 rounded-md"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Enviar postulación
          </button>
        </div>
      </Dialog>
    </>
  );
}

export default FooterCard;
