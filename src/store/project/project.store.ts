import { create } from "zustand";
import { ProjectAction, ProjectState } from "./types";
import { httpClient } from "../../plugins/axios";
import { showAlertError } from "../../helpers/util";
import { toast } from "sonner";

const initialState: ProjectState = {
  projects: [],
  allProjects: [],
  loading: false,
  project: null,
};

const useProjectStore = create<ProjectState & ProjectAction>((set, get) => ({
  ...initialState,

  async getAllProjects(
    searchFilter?: string | { searchTerm?: string; techs?: string[] }
  ) {
    try {
      set({ loading: true });
      const { data } = await httpClient.get("/project");

      let searchTerm = "";
      let techs: string[] = [];

      if (typeof searchFilter === "string") {
        searchTerm = searchFilter || "";
      } else if (searchFilter && typeof searchFilter === "object") {
        searchTerm = searchFilter.searchTerm || "";
        techs = searchFilter.techs || [];
      }

      if (!searchTerm.trim() && techs.length === 0) {
        set({ allProjects: data });
        return;
      }

      const filteredProjects = data.filter(
        (project: { name: string; techs: string | string[] }) => {
          const searchLower = searchTerm.toLowerCase();

          const nameMatch = project.name.toLowerCase().includes(searchLower);

          const techMatch =
            techs.length === 0 ||
            techs.some((tech) => project.techs.includes(tech));

          return nameMatch && techMatch;
        }
      );

      set({ allProjects: filteredProjects });
    } catch (error) {
      console.error(error);
      toast.error("Error al filtrar proyectos");
    } finally {
      set({ loading: false });
    }
  },

  async getProjectByUserId(userId) {
    try {
      const { data } = await httpClient.get(`/project/user/${userId}`);
      set({ projects: data });
    } catch (error) {
      console.error(error);
    }
  },

  async getProjectById(id) {
    try {
      set({ loading: true });
      const { data } = await httpClient.get(`/project/${id}`);
      set({ project: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  async createProject(project) {
    try {
      set({ loading: true });
      await httpClient.post("/project", project);
      get().getAllProjects();
      toast.success("Proyecto creado correctamente");
      return true;
    } catch (error) {
      showAlertError(error as any);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  async EditProject(id, project) {
    try {
      set({ loading: true });
      await httpClient.patch(`/project/${id}`, project);
      get().getAllProjects();
      toast.success("Proyecto actualizado correctamente");
      return true;
    } catch (error) {
      showAlertError(error as any);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  async deleteProject(id) {
    try {
      set({ loading: true });
      await httpClient.delete(`/project/${id}`);
      get().getAllProjects();
      toast.success("Proyecto eliminado correctamente");
      return true;
    } catch (error) {
      showAlertError(error as any);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProjectStore;
