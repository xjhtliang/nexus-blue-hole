import React, { useEffect } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { NoteEditor } from '../components/notes/NoteEditor';
import { NoteSidebar } from '../components/notes/NoteSidebar';

export const NotesPage: React.FC = () => {
    const { 
        notes, 
        activeNoteId, 
        fetchNotesData, 
        isLoadingNotes 
    } = useNeuronStore();

    useEffect(() => {
        fetchNotesData();
    }, []);

    const activeNote = notes.find(n => n.id === activeNoteId) || null;

    return (
        <div className="h-full flex bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <NoteSidebar onSearch={(q) => console.log(q)} />

            {/* Editor Area */}
            <div className="flex-1 min-w-0 bg-background">
                {isLoadingNotes ? (
                     <div className="h-full flex items-center justify-center text-muted-foreground">Loading Notes...</div>
                ) : (
                    <NoteEditor note={activeNote} />
                )}
            </div>
        </div>
    );
};
