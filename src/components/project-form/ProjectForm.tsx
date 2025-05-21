// import { yupResolver } from "@hookform/resolvers/yup";
// import { Button } from "primereact/button";
// import { Calendar } from "primereact/calendar";
// import { Dropdown } from "primereact/dropdown";
// import { InputText } from "primereact/inputtext";
// import { InputTextarea } from "primereact/inputtextarea";
// import { Sidebar } from "primereact/sidebar";
// import { Controller, useForm, useWatch } from "react-hook-form";
// import * as Yup from "yup";
// import { STATUS_PROJECT } from "../../consts";
// import { Project, ProjectDto } from "../../store/project/types";
// import { useEffect, useState } from "react";
// import useProjectStore from "../../store/project/project.store";
// import useAuthStore from "../../store/auth/auth.store";
// import { MultiSelect } from "primereact/multiselect";

// interface Props {
//   onHide: () => void;
//   visible: boolean;
//   defaultValues?: Project;
// }

// const projectSchema = Yup.object({
//   name: Yup.string().required("El nombre es requerido"),
//   salary: Yup.number().required("El salario es requerido"),
//   freelancers: Yup.number().required("La cantidad de freelancers es requerido"),
//   techs: Yup.array()
//     .of(Yup.string())
//     .required("Las tecnologias son requeridas"),
//   dateInit: Yup.date().required("La fecha de inicio es requerida"),
//   dateEnd: Yup.date().required("La fecha de finalización es requerida"),
//   description: Yup.string().required("La descripción es requerida"),
//   status: Yup.string().notRequired(),
// });

// function ProjectForm({ onHide, visible, defaultValues }: Props) {
//   const [isEdit, setIsEdit] = useState(false);
//   const createProject = useProjectStore((state) => state.createProject);
//   const editProject = useProjectStore((state) => state.EditProject);
//   const loading = useProjectStore((state) => state.loading);
//   const user = useAuthStore((state) => state.userLogged);

//   useEffect(() => {
//     setIsEdit(!!defaultValues);
//     setFormValues();
//   }, [defaultValues]);

//   const setFormValues = () => {
//     setValue("name", defaultValues?.name!);
//     setValue("salary", defaultValues?.salary!);
//     setValue("freelancers", defaultValues?.freelancers!);
//     setValue("techs", defaultValues?.techs!);
//     setValue("dateInit", defaultValues?.dateInit!);
//     setValue("dateEnd", defaultValues?.dateEnd!);
//     setValue("description", defaultValues?.description!);
//     setValue("status", defaultValues?.status!);
//   };

//   const { register, formState, handleSubmit, control, reset, setValue } =
//     useForm({
//       resolver: yupResolver(projectSchema),
//     });
//   const { errors } = formState;

//   const onSubmit = handleSubmit(async (data) => {
//     console.log("Tipo de freelancers:", typeof data.freelancers);
//     console.log("Valor de freelancers:", data.freelancers);
//     const payload = {
//       userId: user?._id,
//       ...data,
//     };

//     console.log("Payload completo:", payload);

//     let isSuccessful = false;

//     if (isEdit) {
//       isSuccessful = await editProject(
//         defaultValues?._id!,
//         payload as ProjectDto
//       );
//     } else {
//       isSuccessful = await createProject(payload as ProjectDto);
//     }

//     if (isSuccessful) {
//       handleOnHide();
//     }
//   });

//   const renderFieldError = (field: keyof typeof errors) => {
//     return errors[field]?.message ? (
//       <small className="text-red-500">{errors[field].message}</small>
//     ) : null;
//   };

//   const handleOnHide = () => {
//     reset();
//     onHide();
//   };

//   return (
//     <Sidebar
//       onHide={handleOnHide}
//       visible={visible}
//       position="right"
//       className="w-full md:w-1/2 lg:w-2/5"
//       header={
//         <h1 className="text-2xl font-bold text-left w-full">
//           {isEdit ? "Editar proyecto" : "Crear proyecto"}
//         </h1>
//       }
//     >
//       <form
//         className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
//         onSubmit={onSubmit}
//       >
//         <div className="col-span-2">
//           <>
//             <label htmlFor="name" className="block text-gray-700">
//               Nombre
//             </label>
//             <InputText
//               {...register("name")}
//               invalid={!!errors.name}
//               id="name"
//               name="name"
//               className="w-full"
//             />
//           </>
//           {renderFieldError("name")}
//         </div>

//         <div className="col-span-2">
//           <Controller
//             name="techs"
//             control={control}
//             render={({ field }) => (
//               <>
//                 <label htmlFor="techs" className="block text-gray-700">
//                   Categorias
//                 </label>
//                 <MultiSelect
//                   {...field}
//                   invalid={!!errors.techs}
//                   name={field.name}
//                   value={field.value || []}
//                   id="techs"
//                   className="w-full"
//                   options={[
//                     "Desarrollo Web",
//                     "Desarrollo Móvil",
//                     "Desarrollo Backend",
//                     "Desarrollo Frontend",
//                     "Desarrollo en la Nube",
//                   ]}
//                   placeholder="Selecciona las categorías"
//                 />
//               </>
//             )}
//           />
//           {renderFieldError("techs")}
//         </div>

//         <div className="col-span-1">
//           <>
//             <Controller
//               name="dateInit"
//               control={control}
//               render={({ field }) => (
//                 <>
//                   <label htmlFor="dateInit" className="block text-gray-700">
//                     Fecha de inicio
//                   </label>
//                   <Calendar
//                     {...field}
//                     value={new Date(field.value)}
//                     invalid={!!errors.dateInit}
//                     id="dateInit"
//                     name="dateInit"
//                     minDate={new Date()}
//                   />
//                 </>
//               )}
//             />
//           </>
//           {renderFieldError("dateInit")}
//         </div>

//         <div className="col-span-1">
//           <>
//             <Controller
//               name="dateEnd"
//               control={control}
//               render={({ field }) => {
//                 const dateInit = useWatch({ control, name: "dateInit" });
//                 const minDate =
//                   dateInit && !isNaN(new Date(dateInit).getTime())
//                     ? new Date(
//                         new Date(dateInit).setDate(
//                           new Date(dateInit).getDate() + 1
//                         )
//                       )
//                     : undefined;

//                 return (
//                   <>
//                     <label htmlFor="dateEnd" className="block text-gray-700">
//                       Fecha de finalización
//                     </label>
//                     <Calendar
//                       {...field}
//                       value={new Date(field.value)}
//                       invalid={!!errors.dateEnd}
//                       id="dateEnd"
//                       name="dateEnd"
//                       minDate={minDate}
//                       disabled={!dateInit}
//                     />
//                   </>
//                 );
//               }}
//             />
//           </>
//           {renderFieldError("dateEnd")}
//         </div>

//         <div className="col-span-2">
//           <>
//             <label htmlFor="salary" className="block text-gray-700">
//               Salario
//             </label>
//             <InputText
//               {...register("salary")}
//               invalid={!!errors.salary}
//               type="number"
//               id="salary"
//               name="salary"
//               className="w-full"
//               min={1}
//             />
//           </>
//           {renderFieldError("salary")}
//         </div>

//         <div className="col-span-2">
//           <>
//             <label htmlFor="freelancers" className="block text-gray-700">
//               Freelancers
//             </label>
//             <InputText
//               {...register("freelancers")}
//               invalid={!!errors.freelancers}
//               type="number"
//               id="freelancers"
//               name="freelancers"
//               className="w-full"
//               min={1}
//               placeholder="freelancers requeridos"
//             />
//           </>
//           {renderFieldError("freelancers")}
//         </div>

//         <div className="col-span-2">
//           <>
//             <label htmlFor="description" className="block text-gray-700">
//               Descripción
//             </label>
//             <InputTextarea
//               {...register("description")}
//               invalid={!!errors.description}
//               id="description"
//               name="description"
//               className="w-full"
//             />
//           </>
//           {renderFieldError("description")}
//         </div>

//         {isEdit && (
//           <div className="col-span-2">
//             <Controller
//               name="status"
//               control={control}
//               render={({ field }) => (
//                 <>
//                   <label htmlFor="status" className="block text-gray-700">
//                     Estado
//                   </label>
//                   <Dropdown
//                     {...field}
//                     id="status"
//                     name="status"
//                     options={STATUS_PROJECT}
//                     optionLabel="label"
//                     optionValue="value"
//                     className="w-full"
//                   />
//                 </>
//               )}
//             />
//           </div>
//         )}

//         <div className="col-span-2">
//           <Button loading={loading} label="Publicar" className="w-full" />
//         </div>
//       </form>
//     </Sidebar>
//   );
// }

// export default ProjectForm;

import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";
import { STATUS_PROJECT } from "../../consts";
import { Project, ProjectDto } from "../../store/project/types";
import { useEffect, useState } from "react";
import useProjectStore from "../../store/project/project.store";
import useAuthStore from "../../store/auth/auth.store";
import { MultiSelect } from "primereact/multiselect";

interface Props {
  onHide: () => void;
  visible: boolean;
  defaultValues?: Project;
}

const projectSchema = Yup.object({
  name: Yup.string().required("El nombre es requerido"),
  salary: Yup.number().required("El salario es requerido"),
  freelancers: Yup.number().required("La cantidad de freelancers es requerido"),
  techs: Yup.array()
    .of(Yup.string())
    .required("Las tecnologias son requeridas"),
  dateInit: Yup.date().required("La fecha de inicio es requerida"),
  dateEnd: Yup.date().required("La fecha de finalización es requerida"),
  description: Yup.string().required("La descripción es requerida"),
  status: Yup.string().notRequired(),
});

function ProjectForm({ onHide, visible, defaultValues }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const createProject = useProjectStore((state) => state.createProject);
  const editProject = useProjectStore((state) => state.EditProject);
  const loading = useProjectStore((state) => state.loading);
  const user = useAuthStore((state) => state.userLogged);

  useEffect(() => {
    setIsEdit(!!defaultValues);
    setFormValues();
  }, [defaultValues]);

  const setFormValues = () => {
    setValue("name", defaultValues?.name!);
    setValue("salary", defaultValues?.salary!);
    setValue("freelancers", defaultValues?.freelancers!);
    setValue("techs", defaultValues?.techs!);
    setValue("dateInit", defaultValues?.dateInit!);
    setValue("dateEnd", defaultValues?.dateEnd!);
    setValue("description", defaultValues?.description!);
    setValue("status", defaultValues?.status!);
  };

  const { register, formState, handleSubmit, control, reset, setValue } =
    useForm({
      resolver: yupResolver(projectSchema),
    });
  const { errors } = formState;

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      userId: user?._id,
      ...data,
    };

    let isSuccessful = false;

    if (isEdit) {
      isSuccessful = await editProject(
        defaultValues?._id!,
        payload as ProjectDto
      );
    } else {
      isSuccessful = await createProject(payload as ProjectDto);
    }

    if (isSuccessful) {
      handleOnHide();
    }
  });

  const renderFieldError = (field: keyof typeof errors) => {
    return errors[field]?.message ? (
      <small className="text-red-500 text-xs mt-1 block">
        {errors[field].message}
      </small>
    ) : null;
  };

  const handleOnHide = () => {
    reset();
    onHide();
  };

  return (
    <Sidebar
      onHide={handleOnHide}
      visible={visible}
      position="right"
      className="w-full md:w-1/2 lg:w-2/5"
      header={
        <div className="flex flex-col space-y-2 justify-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Editar proyecto" : "Crear proyecto"}
          </h1>
          <div className="w-full border-b border-gray-200"></div>
        </div>
      }
    >
      <form
        className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-5"
        onSubmit={onSubmit}
      >
        <div className="col-span-2">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700r"
            >
              Nombre del proyecto
            </label>
            <InputText
              {...register("name")}
              invalid={!!errors.name}
              id="name"
              name="name"
              className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Desarrollo de aplicación móvil"
            />
            {renderFieldError("name")}
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex flex-col space-y-1">
            <Controller
              name="techs"
              control={control}
              render={({ field }) => (
                <>
                  <label
                    htmlFor="techs"
                    className="text-sm font-medium text-gray-700"
                  >
                    Categorias del proyecto
                  </label>
                  <MultiSelect
                    {...field}
                    invalid={!!errors.techs}
                    name={field.name}
                    value={field.value || []}
                    id="techs"
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    options={[
                      "Desarrollo Web",
                      "Desarrollo Móvil",
                      "Desarrollo Backend",
                      "Desarrollo Frontend",
                      "Desarrollo en la Nube",
                    ]}
                    placeholder="Selecciona las categorías"
                    display="chip"
                  />
                </>
              )}
            />
            {renderFieldError("techs")}
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex flex-col space-y-1">
            <Controller
              name="dateInit"
              control={control}
              render={({ field }) => (
                <>
                  <label
                    htmlFor="dateInit"
                    className="text-sm font-medium text-gray-700"
                  >
                    Fecha de inicio
                  </label>
                  <Calendar
                    {...field}
                    value={new Date(field.value)}
                    invalid={!!errors.dateInit}
                    id="dateInit"
                    name="dateInit"
                    minDate={new Date()}
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    showIcon
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/yy"
                  />
                </>
              )}
            />
            {renderFieldError("dateInit")}
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex flex-col space-y-1">
            <Controller
              name="dateEnd"
              control={control}
              render={({ field }) => {
                const dateInit = useWatch({ control, name: "dateInit" });
                const minDate =
                  dateInit && !isNaN(new Date(dateInit).getTime())
                    ? new Date(
                        new Date(dateInit).setDate(
                          new Date(dateInit).getDate() + 1
                        )
                      )
                    : undefined;

                return (
                  <>
                    <label
                      htmlFor="dateEnd"
                      className="text-sm font-medium text-gray-700"
                    >
                      Fecha de finalización
                    </label>
                    <Calendar
                      {...field}
                      value={new Date(field.value)}
                      invalid={!!errors.dateEnd}
                      id="dateEnd"
                      name="dateEnd"
                      minDate={minDate}
                      disabled={!dateInit}
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      showIcon
                      dateFormat="dd/mm/yy"
                      placeholder="dd/mm/yy"
                    />
                  </>
                );
              }}
            />
            {renderFieldError("dateEnd")}
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="salary"
              className="text-sm font-medium text-gray-700"
            >
              Presupuesto (USD)
            </label>
            <div className="p-inputgroup">
              <InputText
                {...register("salary")}
                invalid={!!errors.salary}
                type="number"
                id="salary"
                name="salary"
                className="w-full p-3 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={1}
                placeholder="Ej: 5000"
              />
            </div>
            {renderFieldError("salary")}
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="freelancers"
              className="text-sm font-medium text-gray-700"
            >
              N° de freelancers
            </label>
            <InputText
              {...register("freelancers")}
              invalid={!!errors.freelancers}
              type="number"
              id="freelancers"
              name="freelancers"
              className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={1}
              placeholder="Ej: 3"
            />
            {renderFieldError("freelancers")}
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Descripción del proyecto
            </label>
            <InputTextarea
              {...register("description")}
              invalid={!!errors.description}
              id="description"
              name="description"
              className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              placeholder="Describe los detalles del proyecto, objetivos y requisitos..."
              autoResize
            />
            {renderFieldError("description")}
          </div>
        </div>

        {isEdit && (
          <div className="col-span-2">
            <div className="flex flex-col space-y-1">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <>
                    <label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Estado del proyecto
                    </label>
                    <Dropdown
                      {...field}
                      id="status"
                      name="status"
                      options={STATUS_PROJECT}
                      optionLabel="label"
                      optionValue="value"
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Selecciona un estado"
                    />
                  </>
                )}
              />
            </div>
          </div>
        )}

        <div className="col-span-2 pt-4">
          <Button
            loading={loading}
            label={isEdit ? "Actualizar proyecto" : "Publicar proyecto"}
            className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 py-3 px-4 rounded-lg text-white font-medium transition-colors duration-200"
            icon="pi pi-check"
            iconPos="right"
          />
        </div>
      </form>
    </Sidebar>
  );
}

export default ProjectForm;
