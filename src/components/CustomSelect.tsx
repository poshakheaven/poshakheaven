import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
  badge?: string;
  dotColor?: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
};

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${isOpen ? "z-50" : "z-10"} ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-sm border border-white/15 bg-[#1A110E] px-3.5 text-xs font-medium text-ink transition duration-200 hover:border-accent focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.dotColor && (
            <span
              className="h-2 w-2 rounded-full flex-none ring-1 ring-white/20"
              style={{ backgroundColor: selectedOption.dotColor }}
            />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 flex-none ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full z-[100] mt-1.5 max-h-64 min-w-[140px] overflow-y-auto no-scrollbar rounded-md border border-white/15 bg-[#1A110E] py-1 shadow-2xl animate-fade-in ${dropdownClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs transition ${
                  isSelected
                    ? "bg-accent/20 text-accent font-semibold"
                    : "text-ink hover:bg-white/5 hover:text-accent"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.dotColor && (
                    <span
                      className="h-2 w-2 rounded-full flex-none ring-1 ring-white/20"
                      style={{ backgroundColor: opt.dotColor }}
                    />
                  )}
                  <span className="truncate">{opt.label}</span>
                </span>
                {isSelected && <Check className="h-3.5 w-3.5 text-accent flex-none" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
