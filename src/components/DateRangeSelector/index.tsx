import { useState } from "react";
import Arrow from "../Icons/Arrow";
import {subDays} from "date-fns";
import {formatDate} from "../../utils/dateTimeHelper.ts";

export type RangeOption = "3 дня" | "Неделя" | "Месяц" | "Год";
export type ChangeRangeInfo<R extends RangeOption = RangeOption> = { range: R, startDate: string; endDate: string }

interface Props<R extends RangeOption = RangeOption> {
    range: R;
    onRangeChange: (range: ChangeRangeInfo<R>) => void;
}

const rangeOptions: RangeOption[] = ["3 дня", "Неделя", "Месяц", "Год"];

const today = new Date();

const getRangeByLabel = (label: RangeOption): { startDate: Date; endDate: Date } => {
    switch (label) {
        case "3 дня":
            return { startDate: subDays(today, 2), endDate: today };
        case "Неделя":
            return { startDate: subDays(today, 6), endDate: today };
        case "Месяц":
            return { startDate: subDays(today, 29), endDate: today };
        case "Год":
            return { startDate: subDays(today, 364), endDate: today };
    }
};


const DateRangeSelector = ({ range, onRangeChange }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRangeIdx, setSelectedRangeIdx] = useState(rangeOptions.indexOf(range));

    const selectedLabel = rangeOptions[selectedRangeIdx];

    const changeRange = (newRangeLabel: RangeOption) => {
        const { startDate, endDate } = getRangeByLabel(newRangeLabel);
        onRangeChange({ range: newRangeLabel, startDate: formatDate(startDate), endDate: formatDate(endDate) });
    }

    const handleSelect = (idx: number) => {
        setSelectedRangeIdx(idx);
        setIsOpen(false);
        changeRange(rangeOptions[idx])
    };

    const moveSelect = (step: -1 | 1) => {
        setIsOpen(false);

        const newIdx = (selectedRangeIdx + step + rangeOptions.length) % rangeOptions.length;
        const newLabel = rangeOptions[newIdx];

        setSelectedRangeIdx(newIdx);
        changeRange(newLabel);
    };


    return (
        <div className="relative flex items-center gap-4">
            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-1/2 right-full mr-4 w-[160px] bg-white border border-[#EAF0FA]
        rounded-[4px] shadow-[0_0_26px_rgba(233,237,243,0.8)] text-[14px] z-10">
                    {rangeOptions.map((label, idx) => (
                        <div
                            key={label}
                            onClick={() => handleSelect(idx)}
                            className={`
                px-4 py-2 cursor-pointer hover:bg-[#DEE4FF] hover:text-primary
                ${selectedRangeIdx === idx ? "text-[#002CFB]" : "text-[#899CB1]"}
              `}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            )}

            {/* Навигация влево */}
            <button className="text-secondary" onClick={() => moveSelect(-1)}>
                <Arrow direction="left" size={24} className="hover:text-[#002CFB]" />
            </button>

            {/* Центральная кнопка */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-[#002CFB]"
            >
                <span className="text-[14px]">{selectedLabel}</span>
            </button>

            {/* Навигация вправо */}
            <button className="text-secondary" onClick={() => moveSelect(1)}>
                <Arrow direction="right" size={24} className="hover:text-[#002CFB]" />
            </button>
        </div>
    );
};

export default DateRangeSelector;
