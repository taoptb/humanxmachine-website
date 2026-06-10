import { PixelIcon } from '@/components/ui/PixelIcon'

export default function Home() {
  return (
    <div style={{ padding: 40, display: 'flex', gap: 24, background: '#12120f' }}>
      <PixelIcon name="face" size={12} />
      <PixelIcon name="x" size={12} />
      <PixelIcon name="heart" size={12} />
      <PixelIcon name="plus" size={12} />
      <PixelIcon name="face" size={8} opacity={0.15} />
    </div>
  )
}
