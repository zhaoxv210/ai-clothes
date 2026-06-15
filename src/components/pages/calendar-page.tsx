
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export function CalendarPage() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">穿搭日历</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-sm font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((d) => (
              <div
                key={d}
                className={`text-center py-2 text-sm rounded-lg ${
                  d === today.getDate()
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'hover:bg-muted cursor-pointer'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            穿搭记录功能即将上线
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
