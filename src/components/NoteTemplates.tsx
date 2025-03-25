import React from 'react';
import { NoteTemplate } from '../types/notes';
import { FileText, ChevronRight } from 'lucide-react';

interface NoteTemplatesProps {
  templates: NoteTemplate[];
  onSelect: (template: NoteTemplate) => void;
}

export function NoteTemplates({ templates, onSelect }: NoteTemplatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(template => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className="p-4 bg-tv-bg-secondary border border-tv-border rounded-lg text-left hover:border-tv-blue transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-tv-blue" />
              <h3 className="font-medium text-tv-text-primary">{template.name}</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-tv-text-secondary group-hover:text-tv-blue" />
          </div>
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              template.type === 'trade'
                ? 'bg-tv-green bg-opacity-10 text-tv-green'
                : template.type === 'strategy'
                ? 'bg-tv-blue bg-opacity-10 text-tv-blue'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
            </span>
          </div>
          <div className="mt-2 text-sm text-tv-text-secondary">
            {template.sections.length} sections
          </div>
        </button>
      ))}
    </div>
  );
}