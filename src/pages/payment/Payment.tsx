import { useLocation, useNavigate } from "react-router-dom";
import { useState, FormEvent, ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import useAuthStore from "../../store/auth/auth.store";
import { UserDto } from "../../store/user/types";

// Definimos tipos para nuestros estados
// interface SubscriptionPlan {
//   name: string;
//   price: string;
//   period: string;
// }

interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular: boolean;
}

interface UserData {
  email: string;
  phone: string;
  dni: string;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface FormData {
  user: UserData;
  payment: PaymentData;
  acceptTerms: boolean;
  saveCard: boolean;
}

interface FormErrors {
  email: string;
  phone: string;
  dni: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  terms: string;
}

interface SummaryItem {
  label: string;
  value: string;
  isTotal?: boolean;
}

interface CustomCheckboxChangeEvent extends CheckboxChangeEvent {
  name: string;
  checked: boolean;
}

const PaymentGateway = () => {
  const { state } = useLocation() as {
    state: {
      price: string;
      selectedPlan?: SubscriptionPlan;
    };
  };
  const selectedPlan = state?.selectedPlan;
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);

  const registrationData = JSON.parse(
    localStorage.getItem("registrationData") || "{}"
  );

  const [formData, setFormData] = useState<FormData>({
    user: {
      email: registrationData.email || "",
      phone: "",
      dni: "",
    },
    payment: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
    },
    acceptTerms: false,
    saveCard: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    phone: "",
    dni: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    terms: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = (): string => {
    // const defaultPrice = "0.00";
    // const priceStr = selectedPlan?.price
    //   ? selectedPlan.price.replace("$", "")
    //   : defaultPrice;
    // const price = parseFloat(priceStr);

    // return `$${price.toFixed(2)}`;
    if (!selectedPlan) return "$0.00";

    const priceStr = selectedPlan.price.replace("$", "");
    const price = parseFloat(priceStr);
    return `$${price.toFixed(2)}`;
  };

  // const summaryItems: SummaryItem[] = [
  //   { label: "Suscripción", value: selectedPlan?.price || "$0.00" },
  //   { label: "Total", value: calculateTotal(), isTotal: true },
  // ];
  const summaryItems: SummaryItem[] = [
    {
      label: "Suscripción",
      value: `${selectedPlan?.name} (${selectedPlan?.period})`,
    },
    {
      label: "Precio",
      value: selectedPlan?.price || "$0.00",
    },
    {
      label: "Total",
      value: calculateTotal(),
      isTotal: true,
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: !formData.user.email ? "Email es requerido" : "",
      phone: !/^[0-9]{10}$/.test(formData.user.phone)
        ? "Teléfono inválido (10 dígitos)"
        : "",
      dni: !/^[0-9]{8,10}$/.test(formData.user.dni) ? "Documento inválido" : "",
      cardNumber: !/^\d{16}$/.test(
        formData.payment.cardNumber.replace(/\s/g, "")
      )
        ? "Tarjeta inválida (16 dígitos)"
        : "",
      expiryDate: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.payment.expiryDate)
        ? "Formato MM/AA requerido"
        : "",
      cvv: !/^\d{3,4}$/.test(formData.payment.cvv)
        ? "CVV inválido (3-4 dígitos)"
        : "",
      cardName:
        formData.payment.cardName.trim().length < 3
          ? "Nombre completo requerido"
          : "",
      terms: !formData.acceptTerms ? "Debes aceptar los términos" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked as boolean,
      }));
    } else {
      const [section, field] = name.split(".");
      if (section && field) {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...(prev[section as keyof FormData] as object),
            [field]: value,
          },
        }));
      }
    }

    const errorField = name.split(".").pop() as keyof FormErrors;
    if (errors[errorField]) {
      setErrors((prev) => ({ ...prev, [errorField]: "" }));
    }
  };

  const handleCheckboxChange = (
    e: CheckboxChangeEvent,
    name: "acceptTerms" | "saveCard"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.checked,
    }));

    // Limpiar error si es el checkbox de términos
    if (name === "acceptTerms" && errors.terms) {
      setErrors((prev) => ({ ...prev, terms: "" }));
    }
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] || "";
    return match.match(/.{1,4}/g)?.join(" ") || value;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // 1. Procesar pago con pasarela externa (ej. Stripe, PayPal)
      const pagoExitoso = await procesarConPasarelaExterna({
        amount: state?.price,
        cardNumber: formData.payment.cardNumber,
        cardName: formData.payment.cardName,
        expiryDate: formData.payment.expiryDate,
        cvv: formData.payment.cvv,
      });

      if (pagoExitoso) {
        // 2. Solo si el pago es exitoso, registrar al usuario
        const registrationData = JSON.parse(
          localStorage.getItem("registrationData") || "{}"
        );

        const userData: UserDto = {
          name: registrationData.name,
          lastname: registrationData.lastname,
          email: registrationData.email,
          password: registrationData.password,
          plan: registrationData.plan || "",
        };

        // 4. Enviar al backend
        await registerUser(userData);

        // 3. Limpiar y redirigir
        localStorage.removeItem("registrationData");
        navigate("/landing", {
          state: {
            plan: registrationData.plan,
            email: registrationData.email,
          },
        });
      }
    } catch (error) {
      alert("Error en el pago: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };
  const procesarConPasarelaExterna = async (paymentData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div>
        <Button
          icon="pi pi-arrow-left"
          className="mb-4"
          label="Volver"
          text
          onClick={() => navigate("/plan")}
        />
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Formulario */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-xl font-bold">Completa tu información</h2>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">{selectedPlan?.name}</span>
                <span className="text-lg font-bold">{selectedPlan?.price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              {/* Sección de información personal */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Información personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      htmlFor="user.email"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Correo electrónico *
                    </label>
                    <InputText
                      id="user.email"
                      name="user.email"
                      value={formData.user.email}
                      onChange={handleInputChange}
                      placeholder="tucorreo@ejemplo.com"
                      className={classNames("w-full", {
                        "p-invalid": errors.email,
                      })}
                    />
                    {errors.email && (
                      <small className="p-error block mt-1">
                        {errors.email}
                      </small>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="user.phone"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Teléfono *
                    </label>
                    <InputText
                      id="user.phone"
                      name="user.phone"
                      value={formData.user.phone}
                      onChange={handleInputChange}
                      placeholder="Ej: 3101234567"
                      className={classNames("w-full", {
                        "p-invalid": errors.phone,
                      })}
                      keyfilter="int"
                    />
                    {errors.phone && (
                      <small className="p-error block mt-1">
                        {errors.phone}
                      </small>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="user.dni"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Documento de identidad *
                    </label>
                    <InputText
                      id="user.dni"
                      name="user.dni"
                      value={formData.user.dni}
                      onChange={handleInputChange}
                      placeholder="Ej: 1234567890"
                      className={classNames("w-full", {
                        "p-invalid": errors.dni,
                      })}
                      keyfilter="int"
                    />
                    {errors.dni && (
                      <small className="p-error block mt-1">{errors.dni}</small>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección de información de pago */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Información de pago
                </h3>

                <div className="mb-4">
                  <label
                    htmlFor="payment.cardName"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Nombre en la tarjeta *
                  </label>
                  <InputText
                    id="payment.cardName"
                    name="payment.cardName"
                    value={formData.payment.cardName}
                    onChange={handleInputChange}
                    placeholder="Como aparece en la tarjeta"
                    className={classNames("w-full", {
                      "p-invalid": errors.cardName,
                    })}
                  />
                  {errors.cardName && (
                    <small className="p-error block mt-1">
                      {errors.cardName}
                    </small>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="payment.cardNumber"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Número de tarjeta *
                  </label>
                  <InputText
                    id="payment.cardNumber"
                    name="payment.cardNumber"
                    value={formatCardNumber(formData.payment.cardNumber)}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        payment: {
                          ...prev.payment,
                          cardNumber: formatted.replace(/\s/g, ""),
                        },
                      }));
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={classNames("w-full", {
                      "p-invalid": errors.cardNumber,
                    })}
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <small className="p-error block mt-1">
                      {errors.cardNumber}
                    </small>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="payment.expiryDate"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      Fecha expiración *
                    </label>
                    <InputText
                      id="payment.expiryDate"
                      name="payment.expiryDate"
                      value={formData.payment.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.length === 2 && !value.includes("/")) {
                          value = value + "/";
                        }
                        setFormData((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            expiryDate: value,
                          },
                        }));
                      }}
                      placeholder="MM/AA"
                      className={classNames("w-full", {
                        "p-invalid": errors.expiryDate,
                      })}
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <small className="p-error block mt-1">
                        {errors.expiryDate}
                      </small>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="payment.cvv"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      CVV *
                    </label>
                    <InputText
                      id="payment.cvv"
                      name="payment.cvv"
                      value={formData.payment.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={classNames("w-full", {
                        "p-invalid": errors.cvv,
                      })}
                      maxLength={3}
                    />
                    {errors.cvv && (
                      <small className="p-error block mt-1">{errors.cvv}</small>
                    )}
                  </div>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="mb-6">
                <div className="flex items-start">
                  <Checkbox
                    inputId="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    // onChange={handleCheckboxChange}
                    onChange={(e) => handleCheckboxChange(e, "acceptTerms")}
                    value={true}
                    className={classNames("mr-2", {
                      "p-invalid": errors.terms,
                    })}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-600 block"
                  >
                    He leído y acepto los{" "}
                    <a className="text-blue-500 hover:underline">
                      Términos de Servicio
                    </a>{" "}
                    y la{" "}
                    <a className="text-blue-500 hover:underline">
                      Política de Privacidad
                    </a>{" "}
                    *
                  </label>
                </div>
                {errors.terms && (
                  <small className="p-error block mt-1">{errors.terms}</small>
                )}

                <div className="flex items-start mt-3">
                  <Checkbox
                    inputId="saveCard"
                    name="saveCard"
                    checked={formData.saveCard}
                    // onChange={handleCheckboxChange}
                    onChange={(e) => handleCheckboxChange(e, "saveCard")}
                    className="mr-2"
                  />
                  <label htmlFor="saveCard" className="text-sm text-gray-600">
                    Guardar esta tarjeta para futuros pagos
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                label={isProcessing ? "" : `Pagar ${calculateTotal()}`}
                className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600"
                disabled={isProcessing}
              >
                {isProcessing && (
                  <ProgressSpinner strokeWidth="4" className="w-6 h-6 mr-2" />
                )}
              </Button>

              <div className="mt-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center">
                  <i className="pi pi-lock mr-2"></i>
                  <span>Transacción segura con encriptación SSL</span>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Columna derecha - Resumen y sellos de seguridad */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg rounded-xl sticky top-4">
            <div className="bg-gray-100 p-4">
              <h3 className="text-lg font-semibold">Resumen de tu compra</h3>
            </div>

            <div className="p-4">
              {summaryItems.map((item, index) => (
                <div
                  key={index}
                  className={classNames(
                    "flex justify-between py-3",
                    { "border-b": !item.isTotal },
                    { "font-bold text-lg mt-2": item.isTotal }
                  )}
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}

              <Divider className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Pago seguro garantizado
                </p>

                <p className="text-xs text-gray-400">
                  Tus datos están protegidos con encriptación SSL de 256 bits
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Métodos de pago aceptados */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Métodos de pago aceptados:</p>
        <div className="flex justify-center space-x-4">
          <i className="pi pi-cc-visa text-2xl text-gray-600"></i>
          <i className="pi pi-cc-mastercard text-2xl text-gray-600"></i>
          <i className="pi pi-cc-amex text-2xl text-gray-600"></i>
          <i className="pi pi-cc-paypal text-2xl text-gray-600"></i>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
