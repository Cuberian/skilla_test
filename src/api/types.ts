export type ApiListResponse<T> = {
    total_rows: string;
    results: T[];
}

export type InOutType = 0 | 1 | null ; // 1 - входящий звонок, 0 - исходящий звонок

export interface GetCallsPayload {
    dateStart: string;
    dateEnd: string;
    inOut: InOutType;
    offset: number;
    limit: number;
    sortBy: string;
    order: string;
}

export interface CallDto {
    id: number;
    record: string;
    partnership_id: string;
    in_out: InOutType;
    date: string;
    date_notime: string;
    time: number;
    from_number: string;
    to_number: string;
    status: "Дозвонился" | "Не дозвонился";
    source: string;
    contact_name: string;
    contact_company: string;
    person_avatar: string;

}