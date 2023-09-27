import { useRouter } from "next/navigation";
import { MaterialSymbolsAddCircleRounded } from "../Icons";

export default function Feed() {
    const router = useRouter();
    return (
        <div className="relative">
            <MaterialSymbolsAddCircleRounded 
                width={80} 
                height={80}
                className="fixed text-sky-800 add-icon"
                onClick={() => router.push("/add-quiz")}
            />
        </div>
    );
}