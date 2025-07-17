import { useState } from "react";
import Arrow from "../Icons/Arrow";

// Бизнес-типизация
export type CallType = "all" | "incoming" | "outgoing";

// Человекочитаемые лейблы
const CallTypeLabels: Record<CallType, string> = {
    all: "Все типы",
    incoming: "Входящие",
    outgoing: "Исходящие",
};

interface Props {
    select: CallType;
    onSelected: (newSelect: CallType) => void;
}

const CallTypeSelector = ({ select, onSelected }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const options: CallType[] = ["all", "incoming", "outgoing"];

    const handleSelect = (option: CallType) => {
        onSelected(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center ${
                    select !== "all" ? "text-[#1F46FB]" : "text-secondary"
                }`}
            >
                <span className="text-[14px]">{CallTypeLabels[select]}</span>
                <Arrow direction={isOpen ? "up" : "down"} size={21} />
            </button>

            {isOpen && (
                <div
                    className="absolute mt-[12px] min-w-[133px]
          bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]
          rounded-[8px] z-10"
                >
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`text-[12px] px-[12px] py-[7px]
                cursor-pointer hover:bg-[#DEE4FF]
                first:rounded-t-[8px] last:rounded-b-[8px]
                ${select === option ? "text-[#015EF5]" : ""}
              `}
                        >
                            {CallTypeLabels[option]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CallTypeSelector;
