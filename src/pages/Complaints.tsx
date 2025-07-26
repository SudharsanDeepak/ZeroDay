import React, { useState,useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Plus } from "lucide-react";
import axios from "axios";
type Complaint = {
  id: number;
  userType: "Student" | "Warden";
  name: string;
  message: string;
  image?: string;
  date: string;
};

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [userType, setUserType] = useState<"Student" | "Warden">("Student");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
  fetchComplaints();
}, [name, message, image, userType]);
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("https://campusconnect-r8ka.onrender.com/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Error loading complaints", err);
    }
  };
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const newComplaint: Complaint = {
      userType,
      name,
      message,
      image,
      date: new Date().toLocaleString(),
    };

    try {
      const res = await axios.post(
        "https://campusconnect-r8ka.onrender.com/api/complaints",
        newComplaint,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setComplaints([res.data, ...complaints]);
      setName("");
      setMessage("");
      setImage(undefined);
      setImageFile(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting complaint", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 dark:from-background dark:via-background dark:to-background py-10 px-2">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-primary dark:text-white drop-shadow">Hostel Complaints</h1>
            <p className="text-muted-foreground dark:text-gray-300">Submit and track your hostel-related complaints here.</p>
          </div>
          <Button
            variant="hero"
            className="flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Report Complaint
          </Button>
        </div>

        {/* Complaints Cards */}
        <div className="grid grid-cols-1 gap-6">
          {complaints.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">No complaints yet</h3>
                    <p className="text-muted-foreground">Be the first to submit a complaint</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {complaints.map((c) => (
            <Card key={c.id} className="overflow-hidden hover:shadow-primary transition-all duration-300 bg-white dark:bg-gray-900 text-foreground dark:text-white">
              {c.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={c.image}
                    alt="Complaint"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={c.userType === "Student" ? "default" : "secondary"}>
                        {c.userType}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {c.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{c.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-2 text-foreground dark:text-white">
                  {c.message}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal for Complaint Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary/20 animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white text-center">Report Complaint</h2>
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center mb-6">
                  <div className="flex items-center bg-muted dark:bg-gray-800 rounded-full p-1">
                    <button
                      type="button"
                      className={`px-5 py-2 rounded-full font-semibold transition ${
                        userType === "Student"
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground dark:text-gray-400"
                      }`}
                      onClick={() => setUserType("Student")}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      className={`px-5 py-2 rounded-full font-semibold transition ${
                        userType === "Warden"
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground dark:text-gray-400"
                      }`}
                      onClick={() => setUserType("Warden")}
                    >
                      Warden
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Complaint</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your complaint"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 font-medium text-foreground dark:text-white">Attach Picture (optional)</label>
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
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;