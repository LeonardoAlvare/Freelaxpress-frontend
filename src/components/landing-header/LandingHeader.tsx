import { Link, NavLink } from "react-router-dom";
import useAuthStore from "../../store/auth/auth.store";
import ProfileActions from "../profile-actions/ProfileActions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useProjectStore from "../../store/project/project.store";
import { useLocation } from "react-router-dom";
import image from "../../assets/imagen_logo.png";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Menu, X } from "lucide-react";

const filterSchema = Yup.object({
  search: Yup.string().required("El campo es requerido"),
});

const techOptions = [
  "Desarrollo Web",
  "Desarrollo Móvil",
  "Desarrollo Backend",
  "Desarrollo Frontend",
  "Desarrollo en la Nube",
];

export default function LandingHeader() {
  const userLogged = useAuthStore((state) => state.userLogged);
  const findProject = useProjectStore((state) => state.getAllProjects);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [showTechFilter, setShowTechFilter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [_, debouncedValue, setInputValue] = useDebounce("", 400);

  const { register, formState, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(filterSchema),
    defaultValues: {
      search: "",
    },
  });
  const { errors } = formState;

  useEffect(() => {
    const subscription = watch((value) => {
      setInputValue(value.search || "");
      setSearchValue(value.search || "");
    });
    return () => subscription.unsubscribe();
  }, [watch, setInputValue]);

  useEffect(() => {
    findProject({ searchTerm: debouncedValue, techs: selectedTechs });
  }, [debouncedValue, selectedTechs, findProject]);

  const renderFieldError = (field: keyof typeof errors) => {
    return errors[field]?.message ? (
      <small className="text-red-500 text-sm mt-1 block">
        {errors[field].message}
      </small>
    ) : null;
  };

  const onSubmit = handleSubmit((data) => {
    findProject({ searchTerm: data.search, techs: selectedTechs });
  });

  const handleClearSearch = () => {
    setValue("search", "");
    setSearchValue("");
    setSelectedTechs([]);
    findProject({ searchTerm: "", techs: [] });
  };

  const toggleTechFilter = () => {
    setShowTechFilter(!showTechFilter);
  };

  const location = useLocation();

  return (
    <header className="bg-[#1a365d] text-white p-4 md:p-6 rounded-b-xl shadow-lg">
      {/* Barra superior - Todo en una línea */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/landing"
          className="w-20 md:w-28 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <img src={image} alt="FreelaXpress Logo" className="w-full" />
        </NavLink>

        {/* Menú de navegación desktop */}
        <nav className="hidden md:flex mx-4 flex-1 justify-center">
          <ul className="flex space-x-4 lg:space-x-8">
            {location.pathname !== "/landing" && (
              <li>
                <NavLink
                  to="/landing"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#2c5282] text-white"
                        : "hover:text-[#4299e1]"
                    }`
                  }
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Inicio</span>
                </NavLink>
              </li>
            )}
            {userLogged?.isFreelancer && (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#2c5282] text-white"
                          : "hover:text-[#4299e1]"
                      }`
                    }
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="whitespace-nowrap">Perfil</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/proposal/${userLogged?._id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#2c5282] text-white"
                          : "hover:text-[#4299e1]"
                      }`
                    }
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span className="whitespace-nowrap">Postulaciones</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/weka"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#2c5282] text-white"
                          : "hover:text-[#4299e1]"
                      }`
                    }
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <span className="whitespace-nowrap">Predicción</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center space-x-4">
          {userLogged ? (
            <ProfileActions />
          ) : (
            <Link
              to="/auth/login"
              className="hidden md:flex items-center gap-2 bg-[#4299e1] hover:bg-[#2c5282] text-white px-5 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Iniciar sesión
            </Link>
          )}

          {/* Menú hamburguesa para móvil */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#2c5282] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className="md:hidden bg-[#2c5282] rounded-lg p-4 mt-4">
          <ul className="space-y-3">
            {location.pathname !== "/landing" && (
              <li>
                <NavLink
                  to="/landing"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#4299e1] text-white"
                        : "hover:text-[#4299e1]"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Inicio
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#4299e1] text-white"
                      : "hover:text-[#4299e1]"
                  }`
                }
                onClick={() => setMenuOpen(false)}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Perfil
              </NavLink>
            </li>
            {userLogged?.isFreelancer && (
              <>
                <li>
                  <NavLink
                    to={`/proposal/${userLogged?._id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#4299e1] text-white"
                          : "hover:text-[#4299e1]"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Postulaciones
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/weka"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#4299e1] text-white"
                          : "hover:text-[#4299e1]"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Predicción
                  </NavLink>
                </li>
              </>
            )}
            {!userLogged && (
              <li>
                <Link
                  to="/auth/login"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#4299e1] text-white hover:bg-[#2c5282] transition-colors"
                  onClick={() => setMenuOpen(false)}
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}

      {/* Contenido de la landing (búsqueda) */}
      {location.pathname === "/landing" && (
        <div className="mt-6 md:mt-12 max-w-4xl mx-auto">
          <h1 className="text-center">
            <span className="text-3xl md:text-5xl font-bold text-white">
              FreelaXpress
            </span>
            <span className="block text-lg md:text-xl text-[#4299e1] mt-2">
              Tu plataforma de proyectos freelance
            </span>
          </h1>

          <div className="mt-6 md:mt-8 flex flex-col items-center">
            <form className="w-full relative" onSubmit={onSubmit}>
              <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#4299e1]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    {...register("search")}
                    type="text"
                    value={searchValue}
                    className="block w-full pl-12 pr-10 py-3 md:py-4 rounded-full bg-[#2c5282] border border-[#4299e1] focus:ring-2 focus:ring-[#4299e1] focus:border-transparent text-white placeholder-[#4299e1]"
                    placeholder="Buscar proyectos..."
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#4299e1] hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <Button
                  type="button"
                  icon="pi pi-filter"
                  className="p-3 md:p-4 bg-[#4299e1] hover:bg-[#2c5282] border border-[#4299e1] rounded-full"
                  onClick={toggleTechFilter}
                  tooltip="Filtrar por categorías"
                  tooltipOptions={{ position: "bottom" }}
                />
              </div>
              {renderFieldError("search")}

              {showTechFilter && (
                <div className="mt-4 bg-[#2c5282] p-4 rounded-lg">
                  <label className="block text-[#4299e1] mb-2">
                    Filtrar por categorias:
                  </label>
                  <MultiSelect
                    value={selectedTechs}
                    options={techOptions}
                    onChange={(e) => setSelectedTechs(e.value)}
                    placeholder="Selecciona categorías"
                    className="w-full md:w-20rem"
                    display="chip"
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
