import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular: boolean;
}

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const navigate = useNavigate();

  const commonFeatures = [
    "Actualizaciones constantes",
    "Cancelación en cualquier momento",
    "Acceso a todas las funcionalidades",
  ];

  const plans: SubscriptionPlan[] = [
    {
      id: 1,
      name: "Mensual",
      price: "$9.99",
      period: "mes",
      popular: false,
    },
    {
      id: 2,
      name: "Trimestral",
      price: "$24.99",
      period: "3 meses",
      savings: "Ahorras 15%",
      popular: true,
    },
    {
      id: 3,
      name: "Anual",
      price: "$79.99",
      period: "año",
      savings: "Ahorras 30%",
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: number) => {
    // setSelectedPlan(planId);
    const planSeleccionado = plans.find((p) => p.id === planId);
    if (!planSeleccionado) return;

    // Obtener datos existentes
    const currentData = JSON.parse(
      localStorage.getItem("registrationData") || "{}"
    );

    // Actualizar solo el campo plan
    const updatedData = {
      ...currentData,
      plan: planSeleccionado.name, // Asegurar que guardamos el nombre del plan
    };

    // Guardar de vuelta en localStorage
    localStorage.setItem("registrationData", JSON.stringify(updatedData));
    setSelectedPlan(planId);
  };

  const handleContinueToPayment = () => {
    if (!selectedPlan) return;

    const planSeleccionado = plans.find((p) => p.id === selectedPlan);
    if (!planSeleccionado) return;

    // 1. Obtener datos de registro existentes
    const registrationData = JSON.parse(
      localStorage.getItem("registrationData") || "{}"
    );

    // 2. Actualizar con el plan seleccionado
    const updatedData = {
      ...registrationData,
      plan: planSeleccionado.name,
      planDetails: planSeleccionado,
    };

    // 3. Guardar datos actualizados
    localStorage.setItem("registrationData", JSON.stringify(updatedData));

    // 4. Navegar a pasarela de pago con el precio del plan
    navigate("/paymemnt", {
      state: {
        selectedPlan: planSeleccionado,
        price: planSeleccionado.price, // Pasamos el precio como estado
      },
    });
  };
  const headerTemplate = (plan: SubscriptionPlan) => (
    <div
      className={`text-center p-4 ${
        plan.popular ? "bg-blue-500" : "bg-gray-700"
      } rounded-t-lg`}
    >
      <h2 className="text-white text-xl font-bold">{plan.name}</h2>
      {plan.popular && (
        <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full absolute top-0 right-4 transform translate-y-1/2">
          POPULAR
        </span>
      )}

      {plan.id === 3 && (
        <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full absolute top-0 right-4 transform translate-y-1/2">
          1 MES GRATIS
        </span>
      )}
    </div>
  );

  const footerTemplate = (plan: SubscriptionPlan) => (
    <div className="p-4 text-center">
      <Button
        label="Seleccionar"
        className={`w-full ${
          selectedPlan === plan.id ? "p-button-success" : ""
        }`}
        onClick={() => handleSelectPlan(plan.id)}
      />
    </div>
  );

  return (
    <>
      <div>
        <Button
          icon="pi pi-arrow-left"
          className="mb-4"
          label="Volver"
          text
          onClick={() => navigate("/")}
        />
      </div>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Elige tu plan para poder accerder a la plataforma
            </h1>
            <p className="text-xl text-gray-600">
              Todos los planes incluyen acceso completo a la plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative ${
                  plan.popular ? "transform scale-105" : ""
                }`}
              >
                <Card
                  header={() => headerTemplate(plan)}
                  footer={() => footerTemplate(plan)}
                  className={`shadow-xl rounded-lg overflow-hidden ${
                    selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {plan.price}
                    </div>
                    <div className="text-gray-600 mb-6">por {plan.period}</div>
                    {plan.savings && (
                      <div className="bg-green-100 text-green-800 text-sm font-semibold py-1 px-3 rounded-full inline-block mb-6">
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  <Divider />

                  <ul className="mb-6 space-y-3">
                    {commonFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>

          {/* {selectedPlan !== null && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700">
                Has seleccionado el plan{" "}
                <span className="font-bold">
                  {plans.find((p) => p.id === selectedPlan)?.name}
                </span>
              </p>
              <Button
                label="Continuar con el pago"
                className="mt-4 p-button-lg"
                icon="pi pi-arrow-right"
                iconPos="right"
                // onClick={() => navigate("/paymemnt", { state: selectedPlan })}
                onClick={() => navigate("/paymemnt")}
              />
            </div>
          )} */}
          {selectedPlan !== null && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700">
                Has seleccionado el plan{" "}
                <span className="font-bold">
                  {plans.find((p) => p.id === selectedPlan)?.name}
                </span>
              </p>
              <Button
                label="Continuar con el pago"
                className="mt-4 p-button-lg"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={handleContinueToPayment} // Usamos la nueva función
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlans;
