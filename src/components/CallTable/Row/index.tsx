import type {CallDto} from "../../../api/types.ts";
import Incoming  from "@/assets/incoming.svg?react";
import Outgoing  from "@/assets/outgoing.svg?react";
import FailedCall  from "@/assets/failedcall.svg?react";
import Missed  from "@/assets/missed.svg?react";
import {formatSecondsToMSS, trimSeconds} from "../../../utils/dateTimeHelper.ts";
import {useState} from "react";
import AudioPlayer from "../../AudioPlayer";

const scoreColors: Record<string, string> = {
    "Отлично": "border text-[#00A775] border-[#28A879] bg-[#DBF8EF]",
    "Хорошо": "border text-[#122945] border-[#ADBFDF] bg-[#D8E4FB]",
    "Плохо": "border text-[#EA1A4F] border-[#EA1A4F] bg-[#FEE9EF]",
    "Скрипт не использован": "text-[#EA1A4F]",
};

const Row = ({ call }: { call: CallDto}) => {
    const isIncoming = call.in_out === 1;
    const score = Object.keys(scoreColors)[Math.floor(Math.random() * 4)]
    const [isShowPlayer, setShowPlayer] = useState(false);

    return (
        <tr className="text-sm *:border-t first:border-t-0 hover:bg-[#D4DFF32B]">
            <td className="pl-[40px] w-0 border-transparent"></td>
            <td className="border-[#EAF0FA] text-center h-[65px]">
                {
                    isIncoming
                        ? call.status ==="Дозвонился"
                            ? <Incoming className="w-4 h-4"/>
                            : <Missed className="w-4 h-4"/>
                        : call.status ==="Дозвонился"
                            ? <Outgoing className="w-4 h-4"/>
                            : <FailedCall className="w-4 h-4"/>
                }
            </td>
            <td className="border-[#EAF0FA] h-[65px]">{trimSeconds(call.date.split(' ').at(-1) as string)}</td>
            <td className="border-[#EAF0FA] h-[65px] flex items-center gap-2">
                {
                    call.person_avatar.length > 0 &&
                    <img src={call.person_avatar} alt="avatar" className="w-6 h-6 rounded-full"/>
                }
            </td>
            <td className="border-[#EAF0FA] h-[65px]">
                {call.contact_name && call.contact_name
                    ? (
                    <div className="flex flex-col leading-[20px]">
                        <span className="text-[15px] text-[#122945]">
                            {call.contact_name}
                        </span>
                        <span className="text-[15px] text-[#5E7793]">
                            {call.contact_company}
                        </span>
                    </div>
                    )
                    : call.contact_name
                        ? (
                        <div className="flex flex-col leading-[20px]">
                            <span className="text-[15px] text-[#122945]">
                                {call.contact_name}
                            </span>
                            <span className="text-[15px] text-[#5E7793]">
                                {isIncoming ? call.from_number : call.to_number}
                            </span>
                        </div>
                        )
                        : (
                        <span className="text-[15px] text-[#122945]">
                            {isIncoming ? call.from_number : call.to_number}
                        </span>
                        )
                }
            </td>
            <td className="border-[#EAF0FA] h-[65px]">{call.source}</td>
            <td className="border-[#EAF0FA] h-[65px]">
                <span className={`text-xs px-2 py-1 rounded ${scoreColors[score] || ""}`}>
                    { score }
                </span>
            </td>
            <td
                className="border-[#EAF0FA] h-[65px] text-right pr-[40px]"
                onClick={() => call.time > 0 && setShowPlayer(true)}>
                {
                    !isShowPlayer && call.time > 0 && <span>{formatSecondsToMSS(call.time)}</span>
                }
                {
                    isShowPlayer && <AudioPlayer recordId={call.record} partnershipId={call.partnership_id} />
                }
            </td>
        </tr>
    );
};

export default Row;