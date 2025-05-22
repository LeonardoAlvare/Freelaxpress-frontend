import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useAuthStore from "../../store/auth/auth.store";
import { UserDto } from "../../store/user/types";
import logo from "../../assets/imagen_logo.png";

export const Category = [
  { label: "Junior", value: "Junior" },
  { label: "Semi Senior", value: "SemiSenior" },
  { label: "Senior", value: "Senior" },
];

const registerSchema = Yup.object({
  name: Yup.string().required("El nombre es requerido"),
  lastname: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es requerido"),
  password: Yup.string().required("La contraseña es requerida").min(8),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Las contraseñas no coinciden"
  ),
});

function Register() {
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const { errors } = formState;

  useEffect(() => {}, []);

  const onSubmit = handleSubmit(async (data) => {
    const { confirmPassword, ...rest } = data;
    const payload: UserDto = {
      ...rest,
      plan: "",
    };

    localStorage.removeItem("registrationData");
    localStorage.setItem("registrationData", JSON.stringify(payload));

    navigate("/plan");
  });

  const renderFieldError = (field: keyof typeof errors) => {
    return errors[field]?.message ? (
      <small className="text-red-500">{errors[field].message}</small>
    ) : null;
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <div className="self-start w-full">
        <Button
          icon="pi pi-arrow-left"
          label="Volver"
          text
          onClick={() => navigate("/")}
        />
      </div>
      <div className="flex items-center space-x-4">
        <img src={logo} className="h-16 w-auto" alt="FreelaXpress Logo" />
        <a className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
          FreelaXpress
        </a>
      </div>
      <Card title="Registro" className="w-full max-w-2xl">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          onSubmit={onSubmit}
        >
          <div className="col-span-1">
            <FloatLabel>
              <InputText
                {...register("name")}
                id="name"
                name="name"
                className="w-full"
              />
              <label htmlFor="name">Nombre</label>
            </FloatLabel>
            {renderFieldError("name")}
          </div>

          <div className="col-span-1">
            <FloatLabel>
              <InputText
                {...register("lastname")}
                id="lastname"
                name="lastname"
                className="w-full"
              />
              <label htmlFor="lastname">Apellido</label>
            </FloatLabel>
            {renderFieldError("lastname")}
          </div>

          <div className="col-span-2">
            <FloatLabel>
              <InputText
                {...register("email")}
                id="email"
                name="email"
                className="w-full"
              />
              <label htmlFor="email">Email</label>
            </FloatLabel>
            {renderFieldError("email")}
          </div>

          <div className="col-span-2">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FloatLabel className="w-full">
                  <Password
                    {...field}
                    id="password"
                    className="block w-full [&_div]:w-full [&_input]:w-full"
                    toggleMask
                  />
                  <label htmlFor="password">Contraseña</label>
                </FloatLabel>
              )}
            />
            {renderFieldError("password")}
          </div>

          <div className="col-span-2">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FloatLabel>
                  <Password
                    {...field}
                    id="confirmPassword"
                    className="block w-full [&_div]:w-full [&_input]:w-full"
                    toggleMask
                    feedback={false}
                  />
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                </FloatLabel>
              )}
            />
            {renderFieldError("confirmPassword")}
          </div>

          <div className="col-span-2">
            <Button
              loading={loading}
              label="Continuar con el pago"
              className="block w-full"
            />
          </div>

          <div className="col-span-2">
            <p className="text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/auth/login" className="text-blue-500 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Register;
