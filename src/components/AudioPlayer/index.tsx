import { useEffect, useState } from "react";
import {fetchCallRecording} from "../../api/callsService.ts";

interface Props {
    recordId: string;
    partnershipId: string;
}

const AudioPlayer = ({ recordId, partnershipId }: Props) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let url: string | null = null;

        const loadAudio = async () => {
            try {
                url = await fetchCallRecording(recordId, partnershipId);
                setAudioUrl(url);
            } catch (err) {
                console.error("Ошибка загрузки записи:", err);
                setError(true);
            }
        };

        void loadAudio();

        return () => {
            if (url ) {
                URL.revokeObjectURL(url);
            }
        };
    }, [recordId, partnershipId]);

    if (error) return <div className="text-red-500">Ошибка загрузки аудио</div>;
    if (!audioUrl) return <div>Загрузка аудио...</div>;

    return (
        <audio controls src={audioUrl} className="w-full py-2">
            Ваш браузер не поддерживает аудиоплеер.
        </audio>
    );
};

export default AudioPlayer;