import React, { useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Link as TiptapLink } from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Search,
  Plus,
  Pin,
  Download,
  Save,
  Star,
  Calendar
} from 'lucide-react';
import { Note, NoteFolder, DEFAULT_TEMPLATES } from '../types/notes';
import { useTheme } from '../hooks/useTheme';
import { ConfirmDialog } from './ConfirmDialog';
import { NoteSidebar } from './NoteSidebar';
import { NoteTemplates } from './NoteTemplates';

const DEFAULT_FOLDERS: NoteFolder[] = [
  { id: '1', name: 'Trading Strategy', color: 'bg-tv-blue' },
  { id: '2', name: 'Market Analysis', color: 'bg-tv-green' },
  { id: '3', name: 'Journal', color: 'bg-purple-500' },
  { id: '4', name: 'Ideas', color: 'bg-amber-500' }
];

export function Notes() {
  const { isDarkMode } = useTheme();
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [folders, setFolders] = useState<NoteFolder[]>(() => {
    const saved = localStorage.getItem('noteFolders');
    return saved ? JSON.parse(saved) : DEFAULT_FOLDERS;
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink,
      Underline
    ],
    content: selectedNote?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedNote) {
        handleUpdateNote({
          ...selectedNote,
          content: editor.getJSON(),
          updatedAt: new Date().toISOString()
        });
      }
    }
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('noteFolders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (selectedNote) {
      editor?.commands.setContent(selectedNote.content);
    } else {
      editor?.commands.clearContent();
    }
  }, [selectedNote, editor]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(note.content).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFolder = !selectedFolder || note.folder === selectedFolder;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => note.tags.includes(tag));
      const matchesPinned = !showPinnedOnly || note.isPinned;

      return matchesSearch && matchesFolder && matchesTags && matchesPinned;
    });
  }, [notes, searchTerm, selectedFolder, selectedTags, showPinnedOnly]);

  const handleCreateNote = (template = DEFAULT_TEMPLATES[0]) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: template.content,
      tags: [],
      folder: folders[0].name,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      type: template.type
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
    setShowTemplates(false);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note =>
      note.id === updatedNote.id
        ? {
            ...updatedNote,
            version: note.version + 1,
            versions: [
              ...(note.versions || []),
              {
                content: note.content,
                timestamp: new Date().toISOString(),
                version: note.version
              }
            ].slice(-5) // Keep last 5 versions
          }
        : note
    ));
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(prev => prev.filter(note => note.id !== noteToDelete));
      if (selectedNote?.id === noteToDelete) {
        setSelectedNote(null);
      }
      setNoteToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleExportNote = async (note: Note, format: 'pdf' | 'txt' | 'md') => {
    const content = JSON.stringify(note.content);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${note.title}.${format}`);
  };

  const handleExportAll = async () => {
    const zip = new JSZip();
    notes.forEach(note => {
      const content = JSON.stringify(note.content);
      zip.file(`${note.title}.json`, content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'notes.zip');
  };

  const handlePasteImage = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') === 0) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          editor?.chain().focus().setImage({ src: imageUrl }).run();
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const newFolder: NoteFolder = {
        id: Date.now().toString(),
        name,
        color: 'bg-tv-blue'
      };
      setFolders(prev => [...prev, newFolder]);
    }
  };

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''}`}>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Now fixed */}
          <div className="col-span-3">
            <div className="fixed w-[calc(25%-2rem)] space-y-6">
              <NoteSidebar
                notes={filteredNotes}
                folders={folders}
                selectedFolder={selectedFolder}
                selectedTags={selectedTags}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                onCreateNote={() => setShowTemplates(true)}
                onCreateFolder={handleCreateFolder}
                onSelectFolder={setSelectedFolder}
                onSelectTag={(tag) => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                onSelectNote={setSelectedNote}
                onDeleteNote={handleDeleteNote}
                selectedNote={selectedNote}
              />
            </div>
          </div>

          {/* Editor - Remains scrollable */}
          <div className="col-span-9">
            {showTemplates ? (
              <div className="bg-tv-bg-secondary border border-tv-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-tv-text-primary">Choose a Template</h2>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-tv-text-secondary hover:text-tv-text-primary"
                  >
                    ×
                  </button>
                </div>
                <NoteTemplates
                  templates={DEFAULT_TEMPLATES}
                  onSelect={handleCreateNote}
                />
              </div>
            ) : selectedNote ? (
              <div className="bg-tv-bg-secondary border border-tv-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => handleUpdateNote({ ...selectedNote, title: e.target.value })}
                    className="text-xl font-bold bg-transparent border-none focus:outline-none text-tv-text-primary w-full"
                    placeholder="Note Title"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePin(selectedNote.id)}
                      className={`p-2 rounded-lg ${
                        selectedNote.isPinned
                          ? 'text-tv-blue'
                          : 'text-tv-text-secondary hover:text-tv-blue'
                      }`}
                    >
                      <Pin className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleExportNote(selectedNote, 'md')}
                      className="p-2 text-tv-text-secondary hover:text-tv-text-primary rounded-lg"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="border-b border-tv-border mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-2 rounded ${
                        editor?.isActive('bold')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-2 rounded ${
                        editor?.isActive('italic')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      className={`p-2 rounded ${
                        editor?.isActive('underline')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <UnderlineIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const url = window.prompt('Enter the URL');
                        if (url) {
                          editor?.chain().focus().setLink({ href: url }).run();
                        }
                      }}
                      className={`p-2 rounded ${
                        editor?.isActive('link')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const url = window.prompt('Enter the image URL');
                        if (url) {
                          editor?.chain().focus().setImage({ src: url }).run();
                        }
                      }}
                      className="p-2 text-tv-text-secondary hover:text-tv-text-primary rounded"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-2 rounded ${
                        editor?.isActive('bulletList')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`p-2 rounded ${
                        editor?.isActive('orderedList')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                      className={`p-2 rounded ${
                        editor?.isActive('codeBlock')
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`p-2 rounded ${
                        editor?.isActive('heading', { level: 1 })
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`p-2 rounded ${
                        editor?.isActive('heading', { level: 2 })
                          ? 'bg-tv-blue text-white'
                          : 'text-tv-text-secondary hover:text-tv-text-primary'
                      }`}
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <EditorContent
                  editor={editor}
                  className="prose prose-sm max-w-none"
                  onPaste={handlePasteImage}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-tv-text-secondary">
                Select a note or create a new one
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this note?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setNoteToDelete(null);
        }}
      />
    </div>
  );
}