import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import QuickAccessCard from '@/components/QuickAccessCard'
import heroImage from '@/assets/hero-campus.jpg'
import { 
  Megaphone, 
  Search, 
  Calendar, 
  Home, 
  Users, 
  Newspaper,
  Bell,
  Clock,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const quickAccessItems = [
    {
      title: 'Campus Announcements',
      description: 'Stay updated with latest campus news and events',
      icon: Megaphone,
      href: '/announcements',
      gradient: true
    },
    {
      title: 'Lost & Found',
      description: 'Find your lost items or help others find theirs',
      icon: Search,
      href: '/lost-found'
    },
    {
      title: 'Class Timetable',
      description: 'Manage your weekly class schedule efficiently',
      icon: Calendar,
      href: '/timetable'
    },
    {
      title: 'Hostel Complaints',
      description: 'Submit and track hostel-related complaints',
      icon: Home,
      href: '/complaints'
    },
    {
      title: 'Skill Exchange',
      description: 'Share skills or learn from fellow students',
      icon: Users,
      href: '/skills'
    },
    {
      title: 'Tech News & Jobs',
      description: 'Latest tech opportunities and industry news',
      icon: Newspaper,
      href: '/tech-news'
    }
  ]

  const recentActivity = [
    { type: 'announcement', title: 'Semester Exam Schedule Released', time: '2 hours ago' },
    { type: 'complaint', title: 'Water Supply Issue Resolved', time: '4 hours ago' },
    { type: 'skill', title: 'New React Tutorial Available', time: '6 hours ago' },
  ]

  const stats = [
    { label: 'Active Announcements', value: '12', change: '+3' },
    { label: 'Open Complaints', value: '5', change: '-2' },
    { label: 'Skills Shared', value: '48', change: '+8' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-primary/80"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Welcome to SECEcampus
            </h1>
            <p className="text-xl md:text-2xl opacity-90 animate-slide-in">
              Your centralized hub for campus life and student utilities
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="animate-fade-in">
                Explore Features
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary animate-fade-in">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-primary">
                  {stat.value}
                </CardTitle>
                <CardDescription className="text-sm">
                  {stat.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} this week
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessItems.map((item, index) => (
              <Link key={index} to={item.href}>
                <QuickAccessCard {...item} />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates from around campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Don't miss these important dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Mid-term Exams</p>
                    <p className="text-sm text-muted-foreground">Starts in 5 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/10">
                  <Users className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium">Tech Fest 2024</p>
                    <p className="text-sm text-muted-foreground">Starts in 12 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/10">
                  <Home className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">Hostel Meeting</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 6 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard