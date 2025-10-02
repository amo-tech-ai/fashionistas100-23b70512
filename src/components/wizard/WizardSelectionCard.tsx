interface WizardSelectionCardProps {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function WizardSelectionCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: WizardSelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-6 rounded-lg border-2 text-left transition-all
        hover:border-[#E85C2B] hover:shadow-[0_2px_8px_rgba(232,92,43,0.15)]
        ${
          selected
            ? "border-[#E85C2B] bg-[#E85C2B]/5 shadow-[0_2px_8px_rgba(232,92,43,0.15)]"
            : "border-[#E5E5E5] bg-white"
        }
      `}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-base font-medium text-[#1A1A1A] mb-1">{label}</div>
      <div className="text-sm text-[#1A1A1A]/60">{description}</div>
    </button>
  );
}
