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
  password: Yup.string().required("La contraseña es requerida"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Las contraseñas no coinciden"
  ),
});

function Register() {
  const registerUser = useAuthStore((state) => state.register);
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
  );
}

export default Register;
