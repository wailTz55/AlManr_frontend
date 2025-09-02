// api.ts
import { AllDataResponse } from "./type";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchAllData(): Promise<AllDataResponse> {
    // const response = await fetch(`${baseURL}/api/all-data/`);
    const response = await fetch(`https://almanr.pythonanywhere.com/api/all-data/`);
    if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
    }
    return response.json();
}
