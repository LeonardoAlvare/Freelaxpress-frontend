import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useAuthStore from "../../store/auth/auth.store";
import { UserDto } from "../../store/user/types";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
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
  isFreelancer: Yup.boolean(),
  github: Yup.string().when("isFreelancer", {
    is: true,
    then: (schema) => schema.required("El usuario de Github es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  idioma: Yup.array()
    .of(Yup.string().required("Cada idioma no puede estar vacío"))
    .when("isFreelancer", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "Debes agregar al menos un idioma")
          .required("Los idiomas son requeridos"),
      otherwise: (schema) => schema.notRequired(),
    }),
  experience: Yup.string().when("isFreelancer", {
    is: true,
    then: (schema) =>
      schema.required("La experiencia es requerida").oneOf(
        Category.map((item) => item.value),
        "Selecciona una experiencia válida"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  categoria: Yup.array()
    .of(Yup.string().required("Cada categoria no puede estar vacío"))
    .when("isFreelancer", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "Debes agregar al menos una categoria")
          .required("Las categorias son requeridas"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

function RegisterFreelancer() {
  const [isFreelancer, setIsFreelancer] = useState(false);
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const { register, handleSubmit, formState, watch, control } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const { errors } = formState;

  const navigate = useNavigate();

  useEffect(() => {
    watch((value) => {
      setIsFreelancer(value.isFreelancer!);
    });
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const { confirmPassword, github, ...rest } = data;
    const payload: UserDto = {
      ...rest,
      isFreelancer: rest.isFreelancer,
      socialMedia: (data.isFreelancer ? [github] : []) as string[],
      idioma: data.idioma as string[],
      experiencia: data.experience,
      categoria: data.categoria as string[],
    };
    await registerUser(payload);
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
      <Card title="Registro Freelancer" className="w-full max-w-2xl">
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
            <Controller
              control={control}
              name="isFreelancer"
              defaultValue={true}
              render={({ field }) => (
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="isFreelancer"
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    checked={!!field.value}
                    disabled
                  />
                  <label htmlFor="isFreelancer" className="ml-2">
                    Soy freelancer
                  </label>
                </div>
              )}
            />
            {renderFieldError("isFreelancer")}
          </div>

          {isFreelancer && (
            <>
              <div className="col-span-2">
                <FloatLabel>
                  <InputText
                    {...register("github")}
                    id="github"
                    name="github"
                    className="w-full"
                  />
                  <label htmlFor="github">Github url</label>
                </FloatLabel>
                {renderFieldError("github")}
              </div>

              <div className="col-span-2">
                <Controller
                  name="idioma"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor="idioma"
                        className="block text-gray-700 mb-2"
                      >
                        Idiomas que manejas
                      </label>
                      <Chips
                        {...field}
                        id="idioma"
                        name={field.name}
                        value={field.value as string[]}
                        className="w-full"
                      />
                      {fieldState.error && (
                        <small className="p-error">
                          {fieldState.error.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="col-span-2">
                <Controller
                  name="experience"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <label
                        htmlFor="experience"
                        className="block text-gray-700 mb-2"
                      >
                        Nivel de experiencia
                      </label>
                      <Dropdown
                        id="experience"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={Object.values(Category)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Selecciona tu nivel"
                        className={`w-full ${
                          fieldState.error ? "p-invalid" : ""
                        }`}
                      />
                      {fieldState.error && (
                        <small className="p-error">
                          {fieldState.error.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="col-span-2">
                <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label
                        htmlFor="categoria"
                        className="block text-gray-700"
                      >
                        Categorias
                      </label>
                      <MultiSelect
                        {...field}
                        invalid={!!errors.categoria}
                        name={field.name}
                        value={field.value || []}
                        id="categoria"
                        className="w-full"
                        options={[
                          "Desarrollo Web",
                          "Desarrollo Móvil",
                          "Desarrollo Backend",
                          "Desarrollo Frontend",
                          "Desarrollo en la Nube",
                        ]}
                        placeholder="Selecciona las categorías"
                      />
                    </>
                  )}
                />
                {renderFieldError("categoria")}
              </div>
            </>
          )}

          <div className="col-span-2">
            <Button
              loading={loading}
              label="Registrarse"
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

export default RegisterFreelancer;
