import { AllDataResponse } from "./type";
import { mockActivities } from "../data/mockActivities";
import { mockNews } from "../data/mockNews";
import { mockMembers } from "../data/mockMembers";

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchAllData(): Promise<AllDataResponse> {
    // API disconnected: returning static mock data for testing layout
    // To restore API, uncomment the fetch logic and swap the return.

    /*
    const response = await fetch(`${baseURL}api/all-data/`);
    if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
    }
    return response.json();
    */

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                activities: mockActivities,
                news: mockNews,
                members: mockMembers,
            });
        }, 500); // Simulate network delay
    });
}
