import { useState ,useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  User,
  Pin
} from 'lucide-react'
import axios from 'axios';
const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Semester End Examination Schedule Released',
      content: 'The examination schedule for the current semester has been released. Please check your respective department notice boards and download the schedule from the student portal.',
      category: 'exams',
      author: 'Academic Office',
      date: '2024-01-15',
      time: '10:30 AM',
      pinned: true,
      urgent: true
    },
    {
      id: 2,
      title: 'Annual Tech Fest 2024 - Innovation Unleashed',
      content: 'Get ready for the most exciting tech fest of the year! Registration is now open for various events including coding competitions, robotics, and innovation showcases.',
      category: 'events',
      author: 'Student Activities',
      date: '2024-01-14',
      time: '2:15 PM',
      pinned: true,
      urgent: false
    },
    {
      id: 3,
      title: 'Winter Break Holiday Schedule',
      content: 'The college will remain closed from December 25th to January 5th for winter break. Regular classes will resume on January 6th.',
      category: 'holidays',
      author: 'Administration',
      date: '2024-01-13',
      time: '9:00 AM',
      pinned: false,
      urgent: false
    },
    {
      id: 4,
      title: 'Library Extended Hours During Exams',
      content: 'The central library will extend its operating hours during the examination period. Open 24/7 from January 20th to February 10th.',
      category: 'academic',
      author: 'Library Staff',
      date: '2024-01-12',
      time: '4:30 PM',
      pinned: false,
      urgent: false
    },
    {
      id: 5,
      title: 'Campus Recruitment Drive - Leading Companies',
      content: 'Major tech companies including Google, Microsoft, and Amazon will be visiting campus for recruitment. Prepare your resumes and register on the placement portal.',
      category: 'placements',
      author: 'Placement Cell',
      date: '2024-01-11',
      time: '11:45 AM',
      pinned: false,
      urgent: true
    }
  ])
  
useEffect(() => {
  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data)
    } catch (err) {
      console.error('Error fetching announcements:', err)
    }
  }

  fetchAnnouncements()
}, [announcements])
  // Modal form state
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'exams',
    author: '',
    date: '',
    time: '',
    pinned: false,
    urgent: false
  })

  const categories = [
    { id: 'all', label: 'All', count: announcements.length },
    { id: 'exams', label: 'Exams', count: announcements.filter(a => a.category === 'exams').length },
    { id: 'events', label: 'Events', count: announcements.filter(a => a.category === 'events').length },
    { id: 'holidays', label: 'Holidays', count: announcements.filter(a => a.category === 'holidays').length },
    { id: 'academic', label: 'Academic', count: announcements.filter(a => a.category === 'academic').length },
    { id: 'placements', label: 'Placements', count: announcements.filter(a => a.category === 'placements').length }
  ]

  const getCategoryColor = (category: string): "destructive" | "secondary" | "outline" | "default" => {
    const colors: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
      exams: 'destructive',
      events: 'secondary',
      holidays: 'outline',
      academic: 'default',
      placements: 'secondary'
    }
    return colors[category] || 'default'
  }

  const filteredAnnouncements = announcements
    .filter(announcement =>
      selectedCategory === 'all' || announcement.category === selectedCategory
    )
    .filter(announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

 const handleAddAnnouncement = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post(
      'http://localhost:5000/api/announcements',
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    setAnnouncements([res.data, ...announcements])
    setShowModal(false)
    // Reset form
    setForm({
      title: '',
      content: '',
      category: 'exams',
      author: '',
      date: '',
      time: '',
      pinned: false,
      urgent: false
    })
  } catch (err) {
    console.error('Error adding announcement:', err)
  }
}


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Campus Announcements</h1>
              <p className="text-muted-foreground">Stay updated with the latest campus news and important notices</p>
            </div>
            <Button variant="hero" className="flex items-center gap-2" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" />
              Add Announcement
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="relative">
                  {category.label}
                  <Badge variant="outline" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className={`transition-all duration-300 hover:shadow-primary ${announcement.pinned ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.pinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                      <Badge variant={getCategoryColor(announcement.category)}>
                        {announcement.category}
                      </Badge>
                      {announcement.urgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {announcement.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4 text-foreground">
                  {announcement.content}
                </CardDescription>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {announcement.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {announcement.time}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Search className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No announcements found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Announcement Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-primary/20 animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white text-center">Add Announcement</h2>
              <form onSubmit={handleAddAnnouncement}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Title</label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Announcement title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Content</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Announcement details"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="exams">Exams</option>
                    <option value="events">Events</option>
                    <option value="holidays">Holidays</option>
                    <option value="academic">Academic</option>
                    <option value="placements">Placements</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Author</label>
                  <Input
                    name="author"
                    value={form.author}
                    onChange={handleFormChange}
                    placeholder="Announcement author"
                    required
                  />
                </div>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Date</label>
                    <Input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Time</label>
                    <Input
                      name="time"
                      type="time"
                      value={form.time}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 flex gap-4">
                  <label className="flex items-center gap-2 font-medium text-foreground dark:text-white">
                    <input
                      type="checkbox"
                      name="pinned"
                      checked={form.pinned}
                      onChange={handleFormChange}
                      className="accent-primary"
                    />
                    Pin Announcement
                  </label>
                  <label className="flex items-center gap-2 font-medium text-foreground dark:text-white">
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={form.urgent}
                      onChange={handleFormChange}
                      className="accent-primary"
                    />
                    Mark as Urgent
                  </label>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Announcement
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Announcements