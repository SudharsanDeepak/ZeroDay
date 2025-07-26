import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, User, BookOpen, Calendar, Mail } from "lucide-react";
import axios from 'axios';
type Skill = {
  id: number;
  name: string;
  description: string;
  tutor: string;
  sessions: number;
  image?: string;
  email?: string; // Added email field
};

const initialSkills: Skill[] = [
  {
    id: 1,
    name: "Python Programming",
    description: "Learn Python basics, data structures, and scripting.",
    tutor: "Aarav Sharma",
    sessions: 12,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    email: "aarav.sharma@example.com"
  },
  {
    id: 2,
    name: "UI/UX Design",
    description: "Principles of design, Figma, and prototyping.",
    tutor: "Priya Patel",
    sessions: 8,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
    email: "priya.patel@example.com"
  },
  {
    id: 3,
    name: "Spoken French",
    description: "Conversational French for beginners.",
    tutor: "Rahul Verma",
    sessions: 5,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
    email: "rahul.verma@example.com"
  }
];

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tutor, setTutor] = useState("");
  const [sessions, setSessions] = useState(1);
  const [image, setImage] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [email, setEmail] = useState(""); // Email state
  const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/skills', {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 Add this if your backend requires JWT
        },
      });
      setSkills(res.data);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [ ]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !tutor.trim() || !email.trim()) return;

    const newSkill: Skill = {
      name,
      description,
      tutor,
      sessions,
      image,
      email,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/skills', newSkill, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 Needed if protected
        },
      });
      setSkills([res.data, ...skills]);

      // Reset form
      setName('');
      setDescription('');
      setTutor('');
      setSessions(1);
      setImage(undefined);
      setImageFile(null);
      setEmail('');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to post skill:', err);
      alert('Error adding skill. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 dark:from-background dark:via-background dark:to-background py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-primary dark:text-white drop-shadow">
              Skill Exchange Marketplace
            </h1>
            <p className="text-muted-foreground dark:text-gray-300">
              Share your skills or learn from fellow students. Book a peer learning session and upskill together!
            </p>
          </div>
          <Button
            variant="hero"
            className="flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            List Your Skill
          </Button>
        </div>
        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((s) => (
            <Card key={s.id} className="overflow-hidden hover:shadow-primary transition-all duration-300 bg-white dark:bg-gray-900 text-foreground dark:text-white">
              {s.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-xl leading-tight mb-1">{s.name}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{s.tutor}</span>
                  <BookOpen className="h-4 w-4 ml-4" />
                  <span>{s.sessions} sessions</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4 text-foreground dark:text-white">
                  {s.description}
                </CardDescription>
                {s.email && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{s.email}</span>
                  </div>
                )}
                <Button variant="default" className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Add Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary/20 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white text-center">List a Skill</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Skill Name</label>
                <Input
                  type="text"
                  placeholder="e.g. JavaScript, Guitar, Spanish"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="What will you teach?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Your Name</label>
                <Input
                  type="text"
                  placeholder="Tutor's name"
                  value={tutor}
                  onChange={(e) => setTutor(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Available Sessions</label>
                <Input
                  type="number"
                  min={1}
                  value={sessions}
                  onChange={(e) => setSessions(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Contact Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  onChange={handleImageChange}
                />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-3 h-32 rounded-xl object-cover border shadow"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  List Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;