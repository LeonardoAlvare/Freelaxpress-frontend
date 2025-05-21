export type ProjectState = {
  projects: Project[];
  allProjects: Project[];
  project: Project | null;
  loading: boolean;
};

export type ProjectAction = {
  // getAllProjects: (searchFilter?: string) => Promise<void>;
  getAllProjects: (
    searchFilter?: string | { searchTerm?: string; techs?: string[] }
  ) => Promise<void>;
  getProjectByUserId: (userId: string) => Promise<void>;
  getProjectById: (id: string) => Promise<void>;
  createProject: (project: ProjectDto) => Promise<boolean>;
  EditProject: (id: string, project: ProjectDto) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
};

export type Project = ProjectDto & {
  _id: string;
};

export type ProjectDto = {
  userId: string;
  name: string;
  techs: string[];
  description: string;
  dateInit: Date;
  dateEnd: Date;
  salary: number;
  freelancers: number;
  status?: StatusProject;
};

export enum StatusProject {
  Active = "active",
  Inactive = "inactive",
}
