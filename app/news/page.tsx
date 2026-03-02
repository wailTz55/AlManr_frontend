import { NewsPage } from "@/components/news-page";
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar";
import { Suspense } from "react";
import { fetchServerNewsData } from "@/lib/data/homepage";

export const revalidate = 60;

export default async function News() {
  const news = await fetchServerNewsData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <Suspense fallback={<div className="text-center py-12">...جاري التحميل</div>}>
          <NewsPage initialNews={news} />
        </Suspense>
      </div>
    </main>
  );
}
