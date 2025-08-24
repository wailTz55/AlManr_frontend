// api.ts
import { AllDataResponse } from "./type";

export async function fetchAllData(): Promise<AllDataResponse> {
    const response = await fetch(" http://127.0.0.1:8000/api/all-data/");
    if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
    }
    return response.json();
}
