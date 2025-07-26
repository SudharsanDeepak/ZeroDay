import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'
import { useEffect } from 'react';

const LostFound = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [itemType, setItemType] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [items, setItems] = useState([]);


  // Modal form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'electronics',
    type: 'lost',
    location: '',
    date: '',
    contact: '',
    phone: '',
    reward: ''
  })

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: 'all', label: 'All Items', count: items.length },
    { id: 'electronics', label: 'Electronics', count: items.filter(i => i.category === 'electronics').length },
    { id: 'personal', label: 'Personal', count: items.filter(i => i.category === 'personal').length },
    { id: 'vehicles', label: 'Vehicles', count: items.filter(i => i.category === 'vehicles').length },
    { id: 'books', label: 'Books', count: items.filter(i => i.category === 'books').length },
    { id: 'clothing', label: 'Clothing', count: items.filter(i => i.category === 'clothing').length }
  ]

  const filteredItems = items
    .filter(item => itemType === 'all' || item.type === itemType)
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const getCategoryColor = (category: string): "destructive" | "secondary" | "outline" | "default" => {
    const colors: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
      electronics: 'default',
      personal: 'secondary',
      vehicles: 'outline',
      books: 'secondary',
      clothing: 'outline'
    }
    return colors[category] || 'default'
  }

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImageFile(file)
  }

  // Add new item (send as FormData)
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.date.trim() || !form.contact.trim()) return

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    if (imageFile) formData.append('image', imageFile)

    // Example POST request (adjust URL as needed)
    await fetch('http://localhost:5000/api/lostfound', {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data', // DO NOT set this, browser will set it
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    })

    setShowModal(false)
    setForm({
      title: '',
      description: '',
      category: 'electronics',
      type: 'lost',
      location: '',
      date: '',
      contact: '',
      phone: '',
      reward: ''
    })
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
const fetchItems = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/lostfound', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setItems(data);
  } catch (err) {
    console.error('Failed to fetch items:', err);
  }
};



useEffect(() => {
  fetchItems();
}, [form]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Lost & Found</h1>
              <p className="text-muted-foreground">Help reunite lost items with their owners</p>
            </div>
            <Button variant="hero" className="flex items-center gap-2" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" />
              Report Item
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filter
            </Button>
          </div>

          {/* Type Tabs */}
          <Tabs value={itemType} onValueChange={setItemType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Items ({items.length})</TabsTrigger>
              <TabsTrigger value="lost">Lost Items ({items.filter(i => i.type === 'lost').length})</TabsTrigger>
              <TabsTrigger value="found">Found Items ({items.filter(i => i.type === 'found').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-primary transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={item.type === 'lost' ? 'destructive' : 'secondary'}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </Badge>
                      <Badge variant={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      {item.reward && (
                        <Badge variant="outline" className="text-green-600">
                          Reward: {item.reward}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {item.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {item.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="default" className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Owner
                  </Button>
                  <div className="text-xs text-center text-muted-foreground">
                    {item.contact}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Search className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No items found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or check back later</p>
                </div>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setItemType('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Item Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-primary/20 animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white text-center">Report Lost/Found Item</h2>
              <form onSubmit={handleAddItem}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Title</label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Item title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe the item and details"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="personal">Personal</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="books">Books</option>
                      <option value="clothing">Clothing</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Location</label>
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleFormChange}
                    placeholder="Where was it lost/found?"
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
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Reward (optional)</label>
                    <Input
                      name="reward"
                      value={form.reward}
                      onChange={handleFormChange}
                      placeholder="e.g. $20"
                    />
                  </div>
                </div>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Contact Email</label>
                    <Input
                      name="contact"
                      value={form.contact}
                      onChange={handleFormChange}
                      placeholder="Contact email"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium text-foreground dark:text-white">Phone (optional)</label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="Contact phone"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Image (optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-muted-foreground dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    onChange={handleImageChange}
                  />
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
                    Report Item
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

export default LostFound