import Row from "./Row";
import {
    Fragment,
    useEffect,
    useRef,
    useReducer,
    useState,
    useCallback,
} from "react";
import type { CallDto, InOutType } from "../../api/types";
import { getCalls } from "../../api/callsService";
import { CyclicOrder } from "../../utils/sortingHelper";
import Arrow from "../Icons/Arrow";
import {
    formatSmartDate,
    isFormattedStringToday,
} from "../../utils/dateTimeHelper";

type State = Record<string, CallDto[]>;

type Action =
    | { type: "appendMany"; calls: CallDto[] }
    | { type: "reset" };

interface Props {
    dateStart: string;
    dateEnd: string;
    inOut: InOutType;
}

interface Sorting {
    sortBy: "date" | "duration";
    order: "ASC" | "DESC" | "NONE";
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "appendMany": {
            const newState = { ...state };

            const seenIdsByDate: Record<string, Set<number>> = {};

            for (const call of action.calls) {
                const date = call.date_notime;

                if (!newState[date]) {
                    newState[date] = [];
                    seenIdsByDate[date] = new Set();
                }

                if (!seenIdsByDate[date]) {
                    seenIdsByDate[date] = new Set(newState[date].map((c) => c.id));
                }

                if (!seenIdsByDate[date].has(call.id)) {
                    newState[date].push(call);
                    seenIdsByDate[date].add(call.id);
                }
            }

            return newState;
        }
        case "reset":
            return {};
        default:
            return state;
    }
};

const CallTable = ({ dateStart, dateEnd, inOut }: Props) => {
    const limit = 50;
    const orderCycle = new CyclicOrder(["ASC", "DESC", "NONE"] as const);

    const [groupedCalls, dispatch] = useReducer(reducer, {});
    const [dataLoading, setDataLoading] = useState(false);
    const [sorting, setSorting] = useState<Sorting>({
        sortBy: "date",
        order: "DESC",
    });

    const dataLoadingRef = useRef(false);
    const offsetRef = useRef(0);
    const itemsLeftRef = useRef(Infinity);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const changeSort = (sortBy: "date" | "duration") => {
        const isSame = sortBy === sorting.sortBy;
        let order = orderCycle.getNext(isSame ? sorting.order : "NONE") ?? "NONE";

        if (isSame && sortBy === "date" && order === "NONE") {
            order = orderCycle.getNext(order);
        }

        if (isSame && sortBy === "duration" && order === "NONE") {
            sortBy = "date";
            order = orderCycle.getNext(order);
        }

        setSorting({ sortBy, order });
    };

    const fetchMoreCalls = useCallback(async () => {
        if (itemsLeftRef.current <= 0 || dataLoadingRef.current) return;

        dataLoadingRef.current = true;
        setDataLoading(true);

        try {
            const res = await getCalls({
                dateStart,
                dateEnd,
                offset: offsetRef.current,
                limit,
                inOut,
                ...sorting,
            });

            const results = res.results ?? [];

            if (!Number.isFinite(itemsLeftRef.current)) {
                itemsLeftRef.current = Number(res.total_rows);
            }

            offsetRef.current += results.length;
            itemsLeftRef.current -= results.length;

            if (results.length > 0) {
                dispatch({ type: "appendMany", calls: results });
            }
        } catch (e) {
            console.error("Ошибка загрузки звонков:", e);
        } finally {
            setDataLoading(false);
            dataLoadingRef.current = false;
        }
    }, [dateStart, dateEnd, inOut, sorting]);


    useEffect(() => {
        offsetRef.current = 0;
        itemsLeftRef.current = Infinity;
        dispatch({ type: "reset" });
        void fetchMoreCalls();
    }, [dateStart, dateEnd, inOut, sorting, fetchMoreCalls]);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    void fetchMoreCalls();
                }
            },
            { rootMargin: "200px", threshold: 0.1 }
        );

        observer.observe(node);
        observerRef.current = observer;

        return () => observer.disconnect();
    }, [fetchMoreCalls]);

    return (
        <div className="overflow-x-auto bg-transparent">
            <table className="min-w-full">
                <thead>
                <tr className="text-left text-[14px] text-secondary">
                    <td className="pl-[40px] w-0"></td>
                    <th className="leading-[148%] pb-[20px]">Тип</th>
                    <th className="leading-[148%] pb-[20px] cursor-pointer" onClick={() => changeSort("date")}>
                        <div className="flex items-center justify-start">
                            <span>Время</span>
                            <div className="w-[16px]">
                                {sorting.sortBy === "date" &&
                                    (sorting.order === "ASC" ? (
                                        <Arrow direction="up" />
                                    ) : (
                                        <Arrow direction="down" />
                                    ))}
                            </div>
                        </div>
                    </th>
                    <th className="leading-[148%] pb-[20px]">Сотрудник</th>
                    <th className="leading-[148%] pb-[20px]">Звонок</th>
                    <th className="leading-[148%] pb-[20px]">Источник</th>
                    <th className="leading-[148%] pb-[20px]">Оценка</th>
                    <th className="text-right leading-[148%] pb-[20px] pr-[40px] cursor-pointer" onClick={() => changeSort("duration")}>
                        <div className="flex items-center justify-end">
                            <span>Длительность</span>
                            <div className="w-[16px]">
                                {sorting.sortBy === "duration" &&
                                    (sorting.order === "ASC" ? (
                                        <Arrow direction="up" />
                                    ) : (
                                        <Arrow direction="down" />
                                    ))}
                            </div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(groupedCalls).map(([date, calls]) => (
                    <Fragment key={date}>
                        {!isFormattedStringToday(date) && (
                            <tr>
                                <td className="pl-[40px]"></td>
                                <td colSpan={7} className="pt-6 pb-[16px] text-sm font-semibold text-gray-700">
                                    {formatSmartDate(date)}
                                    <sup className="ml-[1px] text-[#899CB1] font-normal text-[12px]">
                                        {calls.length}
                                    </sup>
                                </td>
                            </tr>
                        )}
                        {calls.map((call) => (
                            <Row key={call.id} call={call} />
                        ))}
                    </Fragment>
                ))}
                </tbody>
            </table>

            <div ref={sentinelRef} style={{ height: 20 }} />
            {dataLoading && <div className="p-4 text-gray-500">Загрузка...</div>}
        </div>
    );
};

export default CallTable;
