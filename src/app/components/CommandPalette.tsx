"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ChevronRight, Hash } from "lucide-react";
import guidelinesData from "@/data/guidelines.json";
import { motion, AnimatePresence } from "framer-motion";

type SearchResult = {
  id: string;
  title: string;
  type: "Criterion" | "Sub-Criterion" | "Sub-Sub-Criterion";
  url: string;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Flatten guidelines for search
  const allItems = useMemo(() => {
    const items: SearchResult[] = [];
    guidelinesData.forEach((c) => {
      items.push({ id: c.id, title: c.Criterion, type: "Criterion", url: `/criteria/${c.id}` });
      c["Sub-Criteria"].forEach((s) => {
        items.push({ id: s.id, title: s.Title, type: "Sub-Criterion", url: `/criteria/${s.id}` });
        s["Sub-Sub-Criteria"]?.forEach((ss) => {
          items.push({ id: ss.id, title: ss.Title, type: "Sub-Sub-Criterion", url: `/criteria/${ss.id}` });
        });
      });
    });
    return items;
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.id.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        router.push(selected.url);
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden z-[101] border border-zinc-200"
          >
            <div className="flex items-center px-4 py-3 border-b border-zinc-100">
              <Search className="text-zinc-400 mr-3" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search criteria, sub-criteria, or codes (e.g. c1-s1)..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400 text-lg"
              />
              <span className="text-xs text-zinc-400 font-medium px-2 py-1 bg-zinc-100 rounded-md border border-zinc-200">ESC</span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query && filteredItems.length === 0 ? (
                <div className="px-6 py-12 text-center text-zinc-500">
                  No results found for "{query}"
                </div>
              ) : (
                <ul className="py-2">
                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            router.push(item.url);
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                            isSelected ? "bg-indigo-50" : "hover:bg-zinc-50"
                          }`}
                        >
                          <div className={`mr-3 p-1.5 rounded-md ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-zinc-100 text-zinc-500"}`}>
                            {item.type === "Criterion" ? <Hash size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium truncate ${isSelected ? "text-indigo-900" : "text-zinc-900"}`}>
                              {item.title}
                            </h4>
                            <p className={`text-xs mt-0.5 ${isSelected ? "text-indigo-600/70" : "text-zinc-500"}`}>
                              {item.id} • {item.type}
                            </p>
                          </div>
                          {isSelected && <ChevronRight size={18} className="text-indigo-500 ml-3 shrink-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
