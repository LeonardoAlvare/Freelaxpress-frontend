import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";

export default function Weka() {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: 0,
    yearsExperience: 0,
    educationLevel: "",
    languages: "",
    workAvailability: "",
    category: "",
    developerLevel: "",
    paymentProposal: 0,
    estimatedTime: 0,
    categoryProject: "",
  });

  const [predictionResult, setPredictionResult] = useState<{
    prediccion: string;
    probabilidades: Record<string, number>;
  } | null>(null);

  const educationLevelOptions = [
    { label: "Bachiller", value: "Bachiller" },
    { label: "Técnico", value: "Técnico" },
    { label: "Tecnólogo", value: "Tecnólogo" },
    { label: "Profesional", value: "Profesional" },
  ];

  const languagesOptions = [
    { label: "Español", value: "Español" },
    { label: "Inglés", value: "Ingles" }, // ← sin tilde
    { label: "Español e Inglés", value: "Español e Ingles" }, // ← sin tilde
  ];

  const workAvailabilityOptions = [
    { label: "Tiempo Completo", value: "Tiempo completo" },
    { label: "Medio Tiempo", value: "Medio tiempo" },
  ];

  const categoryOptions = [
    { label: "Web", value: "Web" },
    { label: "Mobile", value: "Mobile" },
    { label: "Backend", value: "Backend" },
    { label: "Fullstack", value: "Fullstack" },
  ];

  const experienceOptions = [
    { label: "Junior", value: "junior" },
    { label: "Semi-Senior", value: "semi" },
    { label: "Senior", value: "senior" },
  ];

  const handleDropdownChange = (name: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validación de campos numéricos >= 0
    if (
      formData.edad < 17 ||
      formData.yearsExperience < 0 ||
      formData.paymentProposal < 0 ||
      formData.estimatedTime < 0
    ) {
      alert("Los valores numéricos no pueden ser menores a 0.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/prediccion/realizar-prediccion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Error en la predicción");

      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      console.error("Error al hacer la predicción:", error);
    }
  };
  return (
    <div className="p-6">
      <Panel
        header="¿Tu perfil de freelance sera aceptado a un proyecto?"
        className="mb-4"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-4"
        >
          {/* Nombre */}
          <div>
            <FloatLabel>
              <InputText
                id="name"
                onChange={(e) => handleDropdownChange("nombre", e.target.value)}
                className="w-full"
              />
              <label htmlFor="name">Nombre</label>
            </FloatLabel>
          </div>

          {/* Edad */}
          <div>
            <FloatLabel>
              <InputNumber
                id="edad"
                value={formData.edad}
                onValueChange={(e) =>
                  handleDropdownChange("edad", e.value ?? 0)
                }
                className="w-full"
                min={18}
              />
              <label htmlFor="edad">Edad</label>
            </FloatLabel>
          </div>

          {/* Años de experiencia */}
          <div>
            <FloatLabel>
              <InputNumber
                id="yearsExperience"
                value={formData.yearsExperience}
                onValueChange={(e) =>
                  handleDropdownChange("yearsExperience", e.value ?? 0)
                }
                className="w-full"
                min={0}
              />
              <label htmlFor="yearsExperience">Años de experiencia</label>
            </FloatLabel>
          </div>

          {/* Nivel educativo */}
          <div>
            <FloatLabel>
              <Dropdown
                inputId="educationLevel"
                value={formData.educationLevel}
                options={educationLevelOptions}
                onChange={(e) =>
                  handleDropdownChange("educationLevel", e.value)
                }
                className="w-full"
              />
              <label htmlFor="educationLevel">Nivel educativo</label>
            </FloatLabel>
          </div>

          {/* Idiomas */}
          <div>
            <FloatLabel>
              <Dropdown
                inputId="languages"
                value={formData.languages}
                options={languagesOptions}
                onChange={(e) => handleDropdownChange("languages", e.value)}
                className="w-full"
              />
              <label htmlFor="languages">Idiomas</label>
            </FloatLabel>
          </div>

          {/* Disponibilidad */}
          <div>
            <FloatLabel>
              <Dropdown
                inputId="workAvailability"
                value={formData.workAvailability}
                options={workAvailabilityOptions}
                onChange={(e) =>
                  handleDropdownChange("workAvailability", e.value)
                }
                className="w-full"
              />
              <label htmlFor="workAvailability">Disponibilidad</label>
            </FloatLabel>
          </div>

          {/* Categoría */}
          <div>
            <FloatLabel>
              <Dropdown
                inputId="category"
                value={formData.category}
                options={categoryOptions}
                onChange={(e) => handleDropdownChange("category", e.value)}
                className="w-full"
              />
              <label htmlFor="category">Categoría</label>
            </FloatLabel>
          </div>

          {/* Nivel del desarrollador */}
          <div>
            <FloatLabel>
              <Dropdown
                inputId="developerLevel"
                value={formData.developerLevel}
                options={experienceOptions}
                onChange={(e) =>
                  handleDropdownChange("developerLevel", e.value)
                }
                className="w-full"
              />
              <label htmlFor="developerLevel">Nivel del Desarrollador</label>
            </FloatLabel>
          </div>

          {/* Propuesta de pago */}
          <div>
            <FloatLabel>
              <InputNumber
                id="paymentProposal"
                value={formData.paymentProposal}
                onValueChange={(e) =>
                  handleDropdownChange("paymentProposal", e.value ?? 0)
                }
                className="w-full"
                min={0}
              />
              <label htmlFor="paymentProposal">Propuesta de pago</label>
            </FloatLabel>
          </div>

          <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-7">
            {/* Tiempo estimado */}
            <div className="w-full md:w-1/3">
              <FloatLabel>
                <InputNumber
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onValueChange={(e) =>
                    handleDropdownChange("estimatedTime", e.value ?? 0)
                  }
                  className="w-full"
                  min={0}
                />
                <label htmlFor="estimatedTime">Tiempo estimado (días)</label>
              </FloatLabel>
            </div>

            {/* Categoría del proyecto */}
            <div className="w-full md:w-1/3">
              <FloatLabel>
                <Dropdown
                  inputId="categoryProject"
                  value={formData.categoryProject}
                  options={categoryOptions}
                  onChange={(e) =>
                    handleDropdownChange("categoryProject", e.value)
                  }
                  className="w-full"
                />
                <label htmlFor="categoryProject">Categoría del proyecto</label>
              </FloatLabel>
            </div>
          </div>

          {/* Botón de enviar (ocupa toda la fila en responsive) */}
          <div className="md:col-span-3">
            <Button
              type="submit"
              label="Realizar predicción"
              icon="pi pi-send"
              className="w-full"
            />
          </div>
        </form>
      </Panel>

      <Dialog
        header="Resultado de la predicción"
        visible={!!predictionResult}
        onHide={() => setPredictionResult(null)}
        className="w-full md:w-1/2"
        pt={{
          mask: { className: "bg-black bg-opacity-50" },
          root: { className: "rounded-xl shadow-xl" },
        }}
      >
        <div
          className={`p-6 rounded-lg ${
            predictionResult?.prediccion === "Aceptado"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          <p className="text-lg font-bold mb-4">
            Predicción: {predictionResult?.prediccion}
          </p>

          <ul className="space-y-2">
            {Object.entries(predictionResult?.probabilidades ?? {}).map(
              ([label, prob]) => (
                <li key={label}>
                  <strong>{label}:</strong> {prob}%
                </li>
              )
            )}
          </ul>
        </div>
      </Dialog>
    </div>
  );
}
