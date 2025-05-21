import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import image from "../../assets/image.jpg";
import logo from "../../assets/imagen_logo.png";
import useAuthStore from "../../store/auth/auth.store";
import ProfileActions from "../../components/profile-actions/ProfileActions";

export default function Vlanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userlogged = useAuthStore((state) => state.userLogged);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo + Nombre */}
          <div className="flex items-center space-x-3">
            <img src={logo} className="h-10 w-auto" alt="FreelaXpress Logo" />
            <a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              FreelaXpress
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-3">
            {userlogged ? (
              <ProfileActions />
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
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
                  <span>Iniciar sesión</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Registrar</span>
                  </button>

                  {/* Menú desplegable */}
                  {isRegisterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        ¿Qué quieres ser?
                      </div>
                      <Link
                        to="/auth/register-freelancer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsRegisterOpen(false)}
                      >
                        Freelancer
                      </Link>
                      <Link
                        to="/auth/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsRegisterOpen(false)}
                      >
                        Usuario
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>

          {/* Mobile Menu (añadido esto) */}
          {menuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md py-3 px-4 border-t">
              {userlogged ? (
                <ProfileActions />
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/auth/login"
                    className="flex items-center justifi space-x-2 px-4 py-3 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
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
                    <span>Iniciar sesión</span>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Registrar</span>
                    </button>

                    {isRegisterOpen && (
                      <div className="mt-2 bg-white rounded-md shadow-lg py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          ¿Qué quieres ser?
                        </div>
                        <Link
                          to="/auth/register-freelancer"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setMenuOpen(false)}
                        >
                          Freelancer
                        </Link>
                        <Link
                          to="/auth/register"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setMenuOpen(false)}
                        >
                          Usuario
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            {/* Columna izquierda: Contenido */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Conectamos
                </span>{" "}
                <br />
                <span className="text-gray-800">talento con</span>{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">oportunidades</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/60 z-0"></span>
                </span>
              </h1>

              <p className="text-2xl text-gray-600 leading-relaxed">
                En <strong className="text-blue-600">FreelaXpress</strong>{" "}
                construimos puentes entre{" "}
                <span className="font-medium text-gray-700">
                  freelancers excepcionales
                </span>{" "}
                y{" "}
                <span className="font-medium text-gray-700">
                  proyectos inspiradores
                </span>
                . Tu próxima gran colaboración comienza aquí.
              </p>
            </div>

            {/* Columna derecha: Imagen */}
            <div className="relative">
              <img
                src={image}
                alt="Freelancers colaborando en proyectos"
                className="w-full max-w-lg rounded-2xl shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  ¿Por qué elegir FreelaXpress?
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubre las{" "}
                <span className="font-semibold text-blue-600">
                  ventajas exclusivas
                </span>{" "}
                que hacen de nuestra plataforma la mejor opción para freelancers
                y clientes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Ahorra tiempo",
                  description:
                    "Encuentra el talento perfecto para tu proyecto en cuestión de horas, no días.",
                  color: "text-blue-600",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                  title: "Comunidad global",
                  description:
                    "Accede a una red internacional de profesionales en todas las áreas.",
                  color: "text-indigo-600",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                  title: "Respuesta rápida",
                  description:
                    "Recibe propuestas de calidad en minutos después de publicar tu proyecto.",
                  color: "text-green-600",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`mb-6 p-4 rounded-full bg-gradient-to-br from-white to-gray-50 w-max shadow-sm group-hover:shadow-md ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ¿Cómo funciona?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Un proceso{" "}
                <span className="font-medium text-blue-600">
                  simple y eficiente
                </span>{" "}
                para conectar talento con oportunidades
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Para clientes",
                  color: "blue",
                  steps: [
                    {
                      icon: "📋",
                      title: "Publica tu proyecto",
                      description: "Describe tu proyecto y requisitos.",
                    },
                    {
                      icon: "💬",
                      title: "Recibe propuestas",
                      description: "Freelancers calificados te contactarán.",
                    },
                    {
                      icon: "✅",
                      title: "Colabora y aprueba",
                      description:
                        "Trabaja directamente y aprueba el resultado.",
                    },
                  ],
                },
                {
                  title: "Para freelancers",
                  color: "indigo",
                  steps: [
                    {
                      icon: "🔍",
                      title: "Explora proyectos",
                      description:
                        "Encuentra trabajos que coincidan con tus skills.",
                    },
                    {
                      icon: "📝",
                      title: "Envía tu propuesta",
                      description: "Presupuesta y muestra tu experiencia.",
                    },
                    {
                      icon: "💰",
                      title: "Completa y cobra",
                      description: "Entrega el trabajo y recibe tu pago.",
                    },
                  ],
                },
              ].map((section, i) => (
                <div key={i} className="space-y-4">
                  <h3
                    className={`text-xl font-bold text-center mb-4 text-${section.color}-600`}
                  >
                    {section.title}
                  </h3>

                  {section.steps.map((step, j) => (
                    <div
                      key={j}
                      className="flex gap-3 items-start bg-white p-4 rounded-lg border border-blue-100 hover:border-blue-200 shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div
                        className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-${section.color}-50 text-${section.color}-600 text-xl`}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-${section.color}-100 text-${section.color}-800 text-xs font-bold mr-2`}
                          >
                            {j + 1}
                          </span>
                          <h4 className="font-semibold text-gray-800">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm pl-8">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-400 blur-xl"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-indigo-500 blur-xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                  ¿Listo para impulsar tu carrera freelance
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  o encontrar el talento perfecto?
                </span>
              </h2>

              <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
                Únete a{" "}
                <span className="font-semibold text-blue-200">
                  miles de freelancers y empresas
                </span>{" "}
                que ya están aprovechando
                <span className="font-bold text-white"> FreelaXpress</span> para
                conectar y colaborar en proyectos exitosos.
              </p>

              <div className="inline-flex items-center px-6 py-3 bg-blue-700/30 backdrop-blur-sm rounded-full border border-blue-400/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-blue-100 text-sm font-medium">
                  Sin compromisos • Sin tarifas ocultas • Cancela cuando quieras
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Logo y redes sociales */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img src={logo} className="h-8 mr-3" alt="FreelaXpress" />
                <span className="text-2xl font-bold text-white">
                  FreelaXpress
                </span>
              </div>
              <p className="mb-6 text-gray-300 leading-relaxed">
                La plataforma líder para conectar talento freelance con
                oportunidades globales.
              </p>
            </div>

            {/* Secciones de enlaces */}
            {[
              {
                title: "Para Freelancers",
                links: [
                  "Cómo funciona",
                  "Encuentra proyectos",
                  "Consejos profesionales",
                  "Tarifas competitivas",
                  "Comunidad exclusiva",
                ],
              },
              {
                title: "Para Empresas",
                links: [
                  "Publicar proyecto",
                  "Encontrar talento",
                  "Métodos de pago",
                  "Guía de contratación",
                  "Casos de éxito",
                ],
              },
              {
                title: "Recursos",
                links: [
                  "Centro de ayuda",
                  "Blog FreelaXpress",
                  "Guías prácticas",
                  "Términos de servicio",
                  "Política de privacidad",
                ],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="text-lg font-semibold text-white mb-5 tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a className="hover:text-white transition-colors duration-200 flex items-start">
                        <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-2.5 mr-2"></span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider y copyright */}
          <div className="border-t border-gray-800 mt-16 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} FreelaXpress. Todos los
                derechos reservados.
              </p>

              <div className="flex space-x-6">
                <a className="text-gray-500 hover:text-white transition-colors text-sm">
                  Términos de servicio
                </a>
                <a className="text-gray-500 hover:text-white transition-colors text-sm">
                  Política de privacidad
                </a>
                <a className="text-gray-500 hover:text-white transition-colors text-sm">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
