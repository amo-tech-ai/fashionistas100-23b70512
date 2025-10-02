import React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface ResponsiveTableColumn {
  key: string
  label: string
  className?: string
  render?: (row: any) => React.ReactNode
  mobileLabel?: string // Custom label for mobile view
  mobilePriority?: number // 1 = always show, 2 = show if space, 3 = hide
}

interface ResponsiveTableProps {
  columns: ResponsiveTableColumn[]
  data: any[]
  keyExtractor: (row: any, index: number) => string
  onRowClick?: (row: any) => void
  emptyMessage?: string
  mobileCardRender?: (row: any, index: number) => React.ReactNode
  className?: string
  rowClassName?: string | ((row: any) => string)
}

/**
 * ResponsiveTable - Mobile-first table component
 * 
 * Features:
 * - Desktop: Traditional table layout
 * - Mobile: Card-based stacked layout with key-value pairs
 * - Touch-friendly tap targets (44px minimum)
 * - Horizontal scroll indicator for wide tables
 * - Custom mobile card rendering support
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
  mobileCardRender,
  className,
  rowClassName,
}) => {
  const isMobile = useIsMobile()

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div className={cn("space-y-3", className)}>
        {data.map((row, index) => {
          const key = keyExtractor(row, index)
          
          // Use custom mobile render if provided
          if (mobileCardRender) {
            return (
              <Card
                key={key}
                className={cn(
                  "p-4 min-touch cursor-pointer hover:bg-muted/50 transition-colors",
                  typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
                )}
                onClick={() => onRowClick?.(row)}
              >
                {mobileCardRender(row, index)}
              </Card>
            )
          }

          // Default stacked key-value layout
          return (
            <Card
              key={key}
              className={cn(
                "p-4 space-y-3 cursor-pointer hover:bg-muted/50 transition-colors",
                typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns
                .filter(col => col.mobilePriority !== 3)
                .map((column) => (
                  <div key={column.key} className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
                      {column.mobileLabel || column.label}
                    </span>
                    <span className="text-sm text-foreground text-right flex-1">
                      {column.render ? column.render(row) : row[column.key]}
                    </span>
                  </div>
                ))}
            </Card>
          )
        })}
      </div>
    )
  }

  // Desktop Table View
  return (
    <div className={cn("relative w-full", className)}>
      {/* Scroll indicator for wide tables */}
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const key = keyExtractor(row, index)
              return (
                <TableRow
                  key={key}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ResponsiveTable
