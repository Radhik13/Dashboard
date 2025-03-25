import React from 'react';
import {
  Search,
  Plus,
  Tag,
  Filter,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Star,
  Calendar,
  Clock,
  Settings,
  Trash2
} from 'lucide-react';
import { Note, NoteFolder } from '../types/notes';

interface NoteSidebarProps {
  notes: Note[];
  folders: NoteFolder[];
  selectedFolder: string | null;
  selectedTags: string[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  onSelectFolder: (folder: string | null) => void;
  onSelectTag: (tag: string) => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onMoveNote?: (noteId: string, folderId: string) => void;
  onMoveFolder?: (folderId: string, parentId: string | null) => void;
  selectedNote: Note | null;
}

export function NoteSidebar({
  notes,
  folders,
  selectedFolder,
  selectedTags,
  searchTerm,
  onSearch,
  onCreateNote,
  onCreateFolder,
  onSelectFolder,
  onSelectTag,
  onSelectNote,
  onDeleteNote,
  onMoveNote,
  onMoveFolder,
  selectedNote
}: NoteSidebarProps) {
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();
  const pinnedNotes = notes.filter(note => note.isPinned);

  const renderFolder = (folder: NoteFolder, level = 0) => (
    <div key={folder.id}>
      <button
        onClick={() => onSelectFolder(folder.name)}
        className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 ${
          selectedFolder === folder.name
            ? 'bg-tv-blue bg-opacity-10 text-tv-blue'
            : 'text-tv-text-secondary hover:text-tv-text-primary'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {folder.children?.length ? (
          folder.isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )
        ) : (
          <div className="w-4" />
        )}
        <div className={`w-2 h-2 rounded-full ${folder.color}`} />
        <span>{folder.name}</span>
        <span className="ml-auto text-sm text-tv-text-secondary">
          {notes.filter(n => n.folder === folder.name).length}
        </span>
      </button>
      {folder.isExpanded && folder.children?.map(child => renderFolder(child, level + 1))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onCreateNote}
          className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
        <button
          onClick={onCreateFolder}
          className="flex items-center gap-2 px-4 py-2 bg-tv-bg-secondary text-tv-text-secondary rounded-lg hover:text-tv-text-primary border border-tv-border"
        >
          <FolderPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-medium text-tv-text-secondary">Pinned</h3>
          </div>
          <div className="space-y-1">
            {pinnedNotes.map(note => (
              <div
                key={note.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg ${
                  selectedNote?.id === note.id
                    ? 'bg-tv-blue bg-opacity-10 text-tv-blue'
                    : 'text-tv-text-secondary hover:text-tv-text-primary'
                }`}
              >
                <button
                  onClick={() => onSelectNote(note)}
                  className="flex-1 text-left"
                >
                  {note.title}
                </button>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-tv-text-secondary hover:text-tv-red"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-tv-text-secondary" />
          <h3 className="text-sm font-medium text-tv-text-secondary">Folders</h3>
        </div>
        <div className="space-y-1">
          {folders.map(folder => renderFolder(folder))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-tv-text-secondary" />
          <h3 className="text-sm font-medium text-tv-text-secondary">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`px-2 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-tv-blue text-white'
                  : 'bg-tv-bg-secondary text-tv-text-secondary hover:text-tv-text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {notes.map(note => (
          <div
            key={note.id}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg ${
              selectedNote?.id === note.id
                ? 'bg-tv-blue bg-opacity-10 border-tv-blue'
                : 'bg-tv-bg-secondary border-tv-border hover:border-tv-blue'
            } border`}
          >
            <button
              onClick={() => onSelectNote(note)}
              className="flex-1 text-left"
            >
              <h3 className="font-medium text-tv-text-primary">{note.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-tv-text-secondary" />
                <span className="text-xs text-tv-text-secondary">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-tv-bg-primary text-tv-text-secondary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-tv-text-secondary hover:text-tv-red"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}