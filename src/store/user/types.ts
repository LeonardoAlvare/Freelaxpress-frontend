export type UserState = {
  loading: boolean;
};

export type UserAction = {
  updateUser: (userId: string, user: UserDto) => Promise<void>;
  getUserById: (userId: string) => Promise<UserDto | null>;
};

export type UserDto = {
  name: string;
  lastname: string;
  email: string;
  password?: string;
  socialMedia?: string[];
  isFreelancer?: boolean;
  idioma?: string[];
  experiencia?: string;
  categoria?: string[];
  plan?: string;
};

export type User = UserDto & {
  _id: string;
};
