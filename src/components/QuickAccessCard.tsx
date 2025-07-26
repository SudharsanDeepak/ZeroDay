import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface QuickAccessCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient?: boolean
}

const QuickAccessCard = ({ title, description, icon: Icon, href, gradient }: QuickAccessCardProps) => {
  return (
    <Card className={`group cursor-pointer hover:scale-105 transition-all duration-300 ${gradient ? 'bg-gradient-primary text-white border-0' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Icon className={`h-8 w-8 ${gradient ? 'text-white' : 'text-primary'}`} />
          <Button 
            variant={gradient ? "secondary" : "ghost"} 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className={`text-lg mb-2 ${gradient ? 'text-white' : ''}`}>
          {title}
        </CardTitle>
        <CardDescription className={gradient ? 'text-white/80' : ''}>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export default QuickAccessCard