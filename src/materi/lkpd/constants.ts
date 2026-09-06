import {
  Search,
  PenTool,
  Lightbulb,
  Calculator,
  MessageCircle,
  BookOpen,
  FunctionSquare
} from 'lucide-react';

export const COVER_PRESETS = [
  { id: 'fruits', label: 'Buah-buahan', icon: '🥭🍎' },
  { id: 'math', label: 'Simbol Matematika', icon: '📐🧮' },
  { id: 'book', label: 'Buku & Ilmu', icon: '📖📘' },
  { id: 'science', label: 'Sains & Kimia', icon: '🔬🧪' },
  { id: 'space', label: 'Astronomi', icon: '🚀🪐' },
  { id: 'sports', label: 'Olahraga', icon: '⚽🏀' },
  { id: 'music', label: 'Seni Musik', icon: '🎵🎸' }
];

export const IconMap = {
  Search,
  PenTool,
  Lightbulb,
  Calculator,
  MessageCircle,
  BookOpen,
  FunctionSquare
};

// Fungsi untuk membuat ID unik
export const generateId = (prefix: string) => {
  return prefix + '_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};
