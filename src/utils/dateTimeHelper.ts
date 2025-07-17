import { format, differenceInCalendarDays, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

export const trimSeconds = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
}

export const formatSecondsToMSS = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export const isFormattedStringToday = (dateStr: string) => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    return dateStr === formattedToday;
}

export const formatSmartDate = (dateStr: string) => {
    const inputDate = parseISO(dateStr);
    const today = new Date();

    const diffDays = differenceInCalendarDays(today, inputDate);
    const isThisYear = inputDate.getFullYear() === today.getFullYear();

    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    if (diffDays === 2) return "Позавчера";

    if (isThisYear) {
        return format(inputDate, "d MMMM", { locale: ru });
    } else {
        return format(inputDate, "d MMMM yyyy 'года'", { locale: ru });
    }
}