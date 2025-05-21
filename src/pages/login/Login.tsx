import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useAuthStore from "../../store/auth/auth.store";
import logo from "../../assets/imagen_logo.png";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

function Login() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { errors } = formState;

  const renderFieldError = (field: keyof typeof errors) => {
    return errors[field]?.message ? (
      <small className="text-red-500">{errors[field].message}</small>
    ) : null;
  };

  const onSubmit = handleSubmit((data) => {
    if (
      data.email === "admin@freelaxpress.com" &&
      data.password === "admin123"
    ) {
      window.location.href = "http://localhost:3000/admin";
    } else {
      login(data);
    }
  });

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto px-4">
      {/* Botón Volver alineado a la izquierda */}
      <div className="self-start w-full">
        <Button
          icon="pi pi-arrow-left"
          label="Volver"
          text
          onClick={() => navigate("/")}
        />
      </div>

      {/* Logo y título centrados */}
      <div className="flex items-center space-x-4">
        <img src={logo} className="h-16 w-auto" alt="FreelaXpress Logo" />
        <a className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
          FreelaXpress
        </a>
      </div>

      {/* Card del formulario */}
      <Card title="Inicio de sesión" className="w-full mb-6">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div>
            <FloatLabel>
              <InputText
                {...register("email")}
                id="email"
                name="email"
                className="w-full"
                pt={{
                  root: { className: "border-gray-300 hover:border-blue-500" },
                }}
              />
              <label htmlFor="email">Email</label>
            </FloatLabel>
            {renderFieldError("email")}
          </div>

          <div className="w-full">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FloatLabel className="w-full">
                  <Password
                    {...field}
                    id="password"
                    className="block w-full [&_div]:w-full [&_input]:w-full"
                    toggleMask
                    feedback={false}
                    pt={{
                      root: {
                        className: "border-gray-300 hover:border-blue-500",
                      },
                      input: { className: "w-full" },
                    }}
                  />
                  <label htmlFor="password">Contraseña</label>
                </FloatLabel>
              )}
            />
            {renderFieldError("password")}
          </div>

          <div>
            <Button
              loading={loading}
              label="Iniciar sesión"
              className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 py-3"
            />
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Login;
