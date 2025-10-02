import React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface ChartResponsiveProps {
  children: React.ReactNode
  height?: number
  mobileHeight?: number
  className?: string
  aspectRatio?: number
}

/**
 * ChartResponsive - Mobile-optimized chart wrapper
 * 
 * Features:
 * - Adjusts chart dimensions for mobile vs desktop
 * - Touch-friendly tooltips with better positioning
 * - Optimized aspect ratios for small screens
 * - Prevents chart overflow on mobile devices
 */
export const ChartResponsive: React.FC<ChartResponsiveProps> = ({
  children,
  height = 350,
  mobileHeight = 250,
  className,
  aspectRatio,
}) => {
  const isMobile = useIsMobile()
  
  const chartHeight = isMobile ? mobileHeight : height

  return (
    <div className={cn("w-full touch-manipulation", className)}>
      <ResponsiveContainer 
        width="100%" 
        height={chartHeight}
        aspect={aspectRatio}
      >
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}

/**
 * Mobile-optimized tooltip styles for Recharts
 * Use these styles in your Tooltip components
 */
export const mobileTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  padding: '8px 12px',
  fontSize: '13px',
}

export const mobileTooltipLabelStyle = {
  color: 'hsl(var(--foreground))',
  fontWeight: 600,
  marginBottom: '4px',
  fontSize: '13px',
}

export const mobileTooltipItemStyle = {
  color: 'hsl(var(--muted-foreground))',
  fontWeight: 500,
  fontSize: '12px',
}

/**
 * Mobile-optimized axis styles
 */
export const getMobileAxisStyle = (isMobile: boolean) => ({
  fontSize: isMobile ? 10 : 12,
  fill: 'hsl(var(--muted-foreground))',
})

/**
 * Hook to get responsive chart configuration
 */
export const useChartConfig = () => {
  const isMobile = useIsMobile()
  
  return {
    isMobile,
    tooltipStyle: mobileTooltipStyle,
    labelStyle: mobileTooltipLabelStyle,
    itemStyle: mobileTooltipItemStyle,
    axisStyle: getMobileAxisStyle(isMobile),
    chartMargin: isMobile 
      ? { top: 10, right: 10, left: 0, bottom: 10 }
      : { top: 20, right: 30, left: 20, bottom: 20 },
  }
}

export default ChartResponsive
