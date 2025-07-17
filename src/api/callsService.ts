// src/api/callsService.ts
import api from './index.ts';
import type {ApiListResponse, CallDto, GetCallsPayload} from './types';

export const getCalls = async (payload: GetCallsPayload): Promise<ApiListResponse<CallDto>> => {
    const { dateStart, dateEnd, inOut, offset, limit, sortBy, order } = payload;

    const params: Record<string, string | number> = {
        date_start: dateStart,
        date_end: dateEnd,
        sort_by: sortBy,
        order,
        offset,
        limit,
    };

    if (inOut !== null) {
        params.in_out = inOut;
    }

    try {
        const response = await api.post('/mango/getList', null, { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении звонков:', error);
        throw error;
    }
};

export const fetchCallRecording = async (recordId: string, partnershipId: string): Promise<string> => {
    const response = await api.post("/mango/getRecord", null, {
        params: {
            record: recordId,
            partnership_id: partnershipId,
        },
        responseType: "blob",
        headers: {
            Accept: "audio/mpeg",
        }
    });

    // Преобразуем blob в URL
    return URL.createObjectURL(response.data);
};