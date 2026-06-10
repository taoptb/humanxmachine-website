import { getInsights } from '@/lib/notion'
import { InsightCard } from '@/components/insights/InsightCard'

export const revalidate = 3600

export default async function InsightsPage() {
  const insights = await getInsights()

  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Perspectives</p>
        <h1 className="font-headline font-bold tracking-tightest text-white mb-12 leading-none" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
          Insights
        </h1>

        {insights.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">Coming Soon</p>
            <p className="text-[#555] mt-3 text-sm">Articles and perspectives are coming.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
