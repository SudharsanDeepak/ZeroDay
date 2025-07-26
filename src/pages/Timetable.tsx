import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];

// Helper to get auth headers (adjust if you use cookies instead)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Timetable = () => {
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [timetables, setTimetables] = useState<Record<string, { day: string; slots: string[] }[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [newDay, setNewDay] = useState("");
  const [newSlots, setNewSlots] = useState(["", "", "", "", "", ""]);
  const [userStatus, setUserStatus] = useState("student");
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Fetch timetable from backend
  const fetchTimetable = async (dept: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/timetable/${dept}`, {
        headers: getAuthHeaders(),
        withCredentials: true, // if your backend uses cookies
      });
      setTimetables(prev => ({ ...prev, [dept]: res.data }));
    } catch {
      setTimetables(prev => ({ ...prev, [dept]: [] }));
    }
  };

  useEffect(() => {
    const status = localStorage.getItem("status");
    if (status) setUserStatus(status);
    departments.forEach(dept => fetchTimetable(dept));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!timetables[selectedDept]) fetchTimetable(selectedDept);
    // eslint-disable-next-line
  }, [selectedDept]);

  // Add new day to timetable (backend)
  const handleAddDay = async () => {
    if (!newDay.trim() || newSlots.some((slot) => !slot.trim())) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/timetable/${selectedDept}`,
        { day: newDay, slots: newSlots },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      setTimetables(prev => ({ ...prev, [selectedDept]: res.data }));
      setShowModal(false);
      setNewDay("");
      setNewSlots(["", "", "", "", "", ""]);
    } catch (err) {
      alert("Failed to add day");
    }
  };

  // Start editing a slot
  const handleEdit = (rowIdx: number, colIdx: number, value: string) => {
    setEditing({ row: rowIdx, col: colIdx });
    setEditValue(value);
  };

  // Save the edited slot (backend)
  const handleSave = async () => {
    if (!editing) return;
    const row = timetables[selectedDept][editing.row];
    try {
      const res = await axios.put(
        `http://localhost:5000/api/timetable/${selectedDept}/${encodeURIComponent(row.day)}/${editing.col}`,
        { value: editValue },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      setTimetables(prev => ({ ...prev, [selectedDept]: res.data }));
    } catch {
      alert("Failed to update slot");
    }
    setEditing(null);
    setEditValue("");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(null);
    setEditValue("");
  };

  const currentTable = timetables[selectedDept] || [];
  const slotHeaders = (currentTable[0]?.slots && Array.isArray(currentTable[0].slots))
    ? currentTable[0].slots
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 dark:from-background dark:via-background dark:to-background py-12 px-2">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-primary dark:text-white drop-shadow-lg tracking-tight">
          Department Timetables
        </h1>
        {/* Department Tabs */}
        <div className="flex justify-center mb-10 gap-4">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`px-7 py-2 rounded-full font-bold shadow transition-all duration-200 border-2
                ${selectedDept === dept
                  ? "bg-gradient-to-r from-primary to-accent text-white border-primary scale-105"
                  : "bg-white/70 dark:bg-gray-800 text-primary dark:text-white border-primary/30 hover:bg-primary/10 hover:scale-105"}
              `}
              onClick={() => setSelectedDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
        {/* Add Day Button */}
        <div className="flex justify-end mb-4">
          {userStatus === "staff" && (
            <Button
              className="rounded-full px-6 py-2 bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg hover:scale-105 transition"
              onClick={() => setShowModal(true)}
            >
              + Add Day
            </Button>
          )}
        </div>
        {/* Timetable Table */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-primary/10 ring-2 ring-primary/10">
          <table className="w-full text-center table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-primary/20 to-accent/20">
                <th className="py-3 px-4 text-lg font-bold text-primary dark:text-accent rounded-tl-2xl">Day</th>
                {slotHeaders.map((_, idx) => (
                  <th key={idx} className="py-3 px-4 text-lg font-bold text-primary dark:text-accent">
                    Slot {idx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.length === 0 ? (
                <tr>
                  <td colSpan={slotHeaders.length + 1} className="py-6 text-center text-muted-foreground">
                    No timetable data for this department.
                  </td>
                </tr>
              ) : (
                currentTable.map((row, i) => (
                  <tr key={i} className="border-b border-primary/10 hover:bg-primary/5 dark:hover:bg-accent/10 transition">
                    <td className="py-3 px-4 font-semibold text-accent dark:text-accent">{row.day}</td>
                    {row.slots.map((slot, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="flex flex-col items-center gap-1">
                          {editing && editing.row === i && editing.col === j ? (
                            <>
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="font-medium text-foreground dark:text-white px-2 py-1 rounded border border-primary/30 bg-background dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                                autoFocus
                              />
                              <div className="flex gap-1 mt-1">
                                <Button
                                  size="xs"
                                  variant="default"
                                  className="text-xs rounded-full shadow"
                                  onClick={handleSave}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="xs"
                                  variant="secondary"
                                  className="text-xs rounded-full shadow"
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-foreground dark:text-white">{slot}</span>
                              {userStatus === "staff" && (
                                <Button
                                  size="xs"
                                  variant="secondary"
                                  className="mt-1 text-xs rounded-full shadow hover:bg-primary/80 hover:text-white transition"
                                  onClick={() => handleEdit(i, j, slot)}
                                >
                                  Manage
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p className="mt-6 text-xs text-muted-foreground dark:text-gray-400 text-center italic">
            Click <span className="font-semibold text-primary dark:text-accent">"Manage"</span> to edit or update a slot.
          </p>
        </div>
      </div>
      {/* Add Day Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary/20 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white text-center">Add New Day</h2>
            <label className="block mb-2 font-medium text-foreground dark:text-white">Day Name</label>
            <input
              type="text"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition mb-4"
              placeholder="e.g. Wednesday"
              autoFocus
            />
            <label className="block mb-2 font-medium text-foreground dark:text-white">Slots</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {newSlots.map((slot, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={slot}
                  onChange={(e) => {
                    const slots = [...newSlots];
                    slots[idx] = e.target.value;
                    setNewSlots(slots);
                  }}
                  className="px-3 py-2 border rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  placeholder={`Slot ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAddDay}>
                Add Day
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;