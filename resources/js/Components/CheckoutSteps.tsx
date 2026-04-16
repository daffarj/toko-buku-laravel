interface Step {
  label: string;
  number: number;
}

const steps: Step[] = [
  { number: 1, label: "Keranjang" },
  { number: 2, label: "Pengiriman" },
  { number: 3, label: "Pembayaran" },
  { number: 4, label: "Selesai" },
];

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step.number < currentStep
                  ? "bg-[#10B981] text-white"
                  : step.number === currentStep
                  ? "bg-[#1E3A5F] text-white"
                  : "bg-gray-200 text-[#6B7280]"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span
              className={`text-xs mt-1 font-medium hidden sm:block ${
                step.number === currentStep
                  ? "text-[#1E3A5F]"
                  : step.number < currentStep
                  ? "text-[#10B981]"
                  : "text-[#6B7280]"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 sm:w-24 mx-1 transition-colors ${
                step.number < currentStep ? "bg-[#10B981]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
