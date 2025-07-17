import Selector, {type CallType} from "./components/Selector";
import DateRangeSelector, {type ChangeRangeInfo, type RangeOption} from "./components/DateRangeSelector";
import CallTable from "./components/CallTable";
import {useState} from "react";
import type {InOutType} from "./api/types.ts";
import {subDays} from "date-fns";
import {formatDate} from "./utils/dateTimeHelper.ts";

const callTypeToInOutMap: Record<CallType, InOutType> = {
    "all": null,
    "outgoing": 0,
    "incoming": 1,
}

function App() {
    const [selectorValue, setSelectorValue] = useState<CallType>("all")
    const [range, setRange] = useState<RangeOption>("3 дня")
    const [stringDateRange, setStringDateRange] =
        useState<{startDate: string, endDate: string}>({
            startDate: formatDate(subDays(new Date(), 2)),
            endDate: formatDate(new Date())
        })

    const handleRangeChange = (newRangeInfo: ChangeRangeInfo) => {
        const { range: newRange, ...newDateRange } = newRangeInfo
        setRange(newRange)
        setStringDateRange(newDateRange);

        console.log({newRange, newDateRange});
    }

  return (
      <div className="font-primary text-primary font-normal bg-[#F1F4F9]
        w-screen min-h-screen pt-[80px] px-[240px] pb-[120px]">
          <div className="w-full space-y-[16px]">
            <div className="h-[24px] w-full flex justify-between items-center">
                <Selector select={selectorValue} onSelected={(newSelect) => setSelectorValue(newSelect)} />
                <DateRangeSelector range={range} onRangeChange={handleRangeChange}/>
            </div>
            <div className="bg-white rounded-[8px] pt-[24px] pb-[52px] w-full shadow-[0px_4px_5px_#E9EDF3]">
                <CallTable
                    inOut={callTypeToInOutMap[selectorValue]}
                    dateStart={stringDateRange.startDate}
                    dateEnd={stringDateRange.endDate}/>
            </div>
          </div>
      </div>
  )
}

export default App
