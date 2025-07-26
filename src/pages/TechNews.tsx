import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, User } from "lucide-react";

type News = {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: string; // base64 string for preview
  link?: string;
};

const initialNews: News[] = [
  {
    id: 1,
    title: "OpenAI launches GPT-5 Beta",
    description: "OpenAI has announced the beta release of GPT-5, featuring improved reasoning and multimodal capabilities.",
    author: "Jane Doe",
    date: "2025-07-25",
    image: "",
    link: "https://openai.com/blog/gpt-5"
  }
];

const TechNews = () => {
  const [news, setNews] = useState<News[]>(initialNews);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [link, setLink] = useState("");

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
  if (!title.trim() || !description.trim() || !author.trim()) return;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('author', author);
  formData.append('date', new Date().toISOString().slice(0, 10)); // or let backend set it
  if (link) formData.append('link', link);
  if (imageFile) formData.append('image', imageFile);

  try {
    const res = await fetch('http://localhost:5000/api/technews', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: formData
    });

    if (!res.ok) throw new Error('Failed to submit news');
    const data = await res.json();

    setNews([data.news, ...news]);
    setTitle("");
    setDescription("");
    setAuthor("");
    setLink("");
    setImage(undefined);
    setImageFile(null);
    setShowModal(false);
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/technews', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
  };

  fetchNews();
}, [news, showModal, title, description, author, image, link]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 dark:from-background dark:via-background dark:to-background py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-primary dark:text-white drop-shadow">Tech News & Jobs</h1>
            <p className="text-muted-foreground dark:text-gray-300">Find the latest tech opportunities and industry news here.</p>
          </div>
          <Button
            variant="hero"
            className="flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add News
          </Button>
        </div>
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((n) => (
            <Card key={n.id} className="overflow-hidden hover:shadow-primary transition-all duration-300 bg-white dark:bg-gray-900 text-foreground dark:text-white">
              {n.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-xl leading-tight mb-1">
                  {n.link ? (
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary dark:text-accent">
                      {n.title}
                    </a>
                  ) : (
                    n.title
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{n.author}</span>
                  <Calendar className="h-4 w-4 ml-4" />
                  <span>{new Date(n.date).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-2 text-foreground dark:text-white">
                  {n.description}
                </CardDescription>
                {n.link && (
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-primary dark:text-accent font-semibold hover:underline text-sm"
                  >
                    Read More
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Add News Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary/20 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white text-center">Add Tech News / Job</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Title</label>
                <Input
                  type="text"
                  placeholder="News headline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Author / Source</label>
                <Input
                  type="text"
                  placeholder="Your name or news source"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-foreground dark:text-white">Link (optional)</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
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
                  Add News
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechNews;