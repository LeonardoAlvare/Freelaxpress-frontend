import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import useUserStore from "../../store/user/user.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserDto } from "../../store/user/types";
import useAuthStore from "../../store/auth/auth.store";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

export const Category = [
  { label: "Junior", value: "Junior" },
  { label: "Semi Senior", value: "SemiSenior" },
  { label: "Senior", value: "Senior" },
];

const userSchema = Yup.object({
  name: Yup.string().required("El nombre es requerido"),
  lastname: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es requerido"),
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

function UserForm() {
  const [isFreelancer, setIsFreelancer] = useState(false);
  const updateUser = useUserStore((state) => state.updateUser);
  const loading = useUserStore((state) => state.loading);
  const userLogged = useAuthStore((state) => state.userLogged);

  const { register, handleSubmit, formState, watch, control, setValue } =
    useForm({
      resolver: yupResolver(userSchema),
    });
  const { errors } = formState;

  useEffect(() => {
    watch((value) => {
      setIsFreelancer(value.isFreelancer!);
    });
  }, []);

  useEffect(() => {
    setValue("name", userLogged?.name!);
    setValue("lastname", userLogged?.lastname!);
    setValue("email", userLogged?.email!);
    setValue("isFreelancer", userLogged?.isFreelancer!);
    setValue("github", userLogged?.socialMedia![0]);
    setValue("idioma", userLogged?.idioma!);
    setValue("experience", userLogged?.experiencia!);
    setValue("categoria", userLogged?.categoria!);
  }, [userLogged]);

  const onSubmit = handleSubmit(async (data) => {
    const { github, ...rest } = data;
    const payload: UserDto = {
      ...rest,
      isFreelancer: rest.isFreelancer,
      socialMedia: (data.isFreelancer
        ? [github]
        : userLogged?.socialMedia) as string[],
      idioma: data.idioma as string[],
      experiencia: data.experience,
      categoria: data.categoria as string[],
    };

    await updateUser(userLogged?._id!, payload);
  });

  const renderFieldError = (field: keyof typeof errors) => {
    return errors[field]?.message ? (
      <small className="text-red-500">{errors[field].message}</small>
    ) : null;
  };

  return (
    <Card title="Perfil" className="w-full">
      <form className="grid grid-cols-2 gap-4" onSubmit={onSubmit}>
        <div className="col-span-1">
          <label htmlFor="name" className="block text-gray-700">
            Nombre
          </label>
          <InputText
            {...register("name")}
            id="name"
            name="name"
            className="w-full"
          />
          {renderFieldError("name")}
        </div>

        <div className="col-span-1">
          <label htmlFor="name" className="block text-gray-700">
            Apellido
          </label>
          <InputText
            {...register("lastname")}
            id="lastname"
            name="lastname"
            className="w-full"
          />
          {renderFieldError("lastname")}
        </div>

        <div className="col-span-2">
          <label htmlFor="name" className="block text-gray-700">
            Email
          </label>
          <InputText
            {...register("email")}
            id="email"
            name="email"
            className="w-full"
          />

          {renderFieldError("email")}
        </div>

        {isFreelancer && (
          <>
            <div className="col-span-2">
              <label htmlFor="name" className="block text-gray-700">
                Github url
              </label>
              <InputText
                {...register("github")}
                id="github"
                name="github"
                className="w-full"
              />
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
                    <label htmlFor="categoria" className="block text-gray-700">
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
          <Button loading={loading} label="Guardar" className="block w-full" />
        </div>
      </form>
    </Card>
  );
}

export default UserForm;
