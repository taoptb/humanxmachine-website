'use client'

type PixelIconName = 'face' | 'x' | 'heart' | 'plus'

interface PixelIconProps {
  name: PixelIconName
  size?: number        // pixel unit size in px (default 8)
  color?: string       // fill color (default #ff4d00)
  opacity?: number     // 0-1 (default 1)
  className?: string
}

// Each icon is defined as a list of [col, row] pixel coordinates
const PIXEL_MAPS: Record<PixelIconName, [number, number][]> = {
  face: [
    [2,1],[3,1],[4,1],[5,1],[6,1],
    [1,2],[7,2],
    [1,3],[2,3],[5,3],[6,3],[7,3],
    [1,4],[2,4],[5,4],[6,4],[7,4],
    [1,5],[3,5],[4,5],[5,5],[7,5],
    [1,6],[7,6],
    [2,7],[3,7],[4,7],[5,7],[6,7],
    [2,8],[4,8],[6,8],
  ],
  x: [
    [0,0],[3,0],
    [1,1],[2,1],
    [1,2],[2,2],
    [0,3],[3,3],
  ],
  heart: [
    [0,1],[1,1],[3,1],[4,1],
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],
    [1,2],[2,2],[3,2],[4,2],
    [2,3],[3,3],
    [3,4],
  ],
  plus: [
    [1,0],
    [0,1],[1,1],[2,1],
    [1,2],
  ],
}

// Grid dimensions per icon [cols, rows]
const GRID_SIZES: Record<PixelIconName, [number, number]> = {
  face:  [9, 9],
  x:     [4, 4],
  heart: [6, 5],
  plus:  [3, 3],
}

export function PixelIcon({
  name,
  size = 8,
  color = '#ff4d00',
  opacity = 1,
  className = '',
}: PixelIconProps) {
  const pixels = PIXEL_MAPS[name]
  const [cols, rows] = GRID_SIZES[name]
  const gap = Math.max(1, Math.round(size * 0.15))
  const unitWithGap = size + gap
  const width = cols * unitWithGap - gap
  const height = rows * unitWithGap - gap

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill={color}
      opacity={opacity}
      className={className}
      aria-hidden="true"
    >
      {pixels.map(([col, row], i) => (
        <rect
          key={i}
          x={col * unitWithGap}
          y={row * unitWithGap}
          width={size}
          height={size}
        />
      ))}
    </svg>
  )
}
