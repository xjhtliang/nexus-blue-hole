import React, { useState } from 'react';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { Folder as FolderIcon, Hash, Book, Pin, Clock, ChevronRight, ChevronDown, Grid, Layout, Search, Star } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Folder } from '../../../../types/neuron';

interface NoteSidebarProps {
    onSearch: (query: string) => void;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({ onSearch }) => {
    const { folders, notes, activeNoteId, setActiveNote, createNote, templates } = useNeuronStore();
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ 'f-area': true, 'f-topic': true });
    const [searchTerm, setSearchTerm] = useState('');

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    // Filter notes if search is active
    const filteredNotes = searchTerm 
        ? notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase())) 
        : null;

    const getIcon = (iconName?: string) => {
        switch (iconName) {
            case 'Clock': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Pin': return <Pin className="w-4 h-4 text-orange-500" />;
            case 'Grid': return <Grid className="w-4 h-4 text-purple-500" />;
            case 'Hash': return <Hash className="w-4 h-4 text-emerald-500" />;
            case 'Book': return <Book className="w-4 h-4 text-rose-500" />;
            default: return <FolderIcon className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const renderFolder = (folder: Folder, level = 0) => {
        const children = folders.filter(f => f.parentId === folder.id);
        const folderNotes = notes.filter(n => n.folderId === folder.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedFolders[folder.id];

        return (
            <div key={folder.id}>
                <button
                    onClick={() => hasChildren ? toggleFolder(folder.id) : null}
                    className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-secondary/50 transition-colors group",
                        level > 0 && "ml-3"
                    )}
                >
                    <div className="flex items-center gap-2 text-foreground/80">
                         {hasChildren ? (
                             isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                         ) : <span className="w-3" />}
                         {getIcon(folder.icon)}
                         <span className="font-medium">{folder.name}</span>
                    </div>
                    {folderNotes.length > 0 && (
                        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 rounded-full">{folderNotes.length}</span>
                    )}
                </button>

                {isExpanded && (
                    <div className="border-l border-border/50 ml-4 pl-1">
                        {children.map(child => renderFolder(child, level + 1))}
                        {/* Only show notes here if NOT searching */}
                        {!searchTerm && folderNotes.map(note => (
                            <button
                                key={note.id}
                                onClick={() => setActiveNote(note.id)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left ml-2",
                                    activeNoteId === note.id 
                                        ? "bg-primary/10 text-primary font-medium" 
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <span className="truncate">{note.title}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const systemFolders = folders.filter(f => f.type === 'SYSTEM');
    const rootFolders = folders.filter(f => !f.parentId && f.type !== 'SYSTEM');

    return (
        <div className="w-64 bg-secondary/5 border-r border-border flex flex-col h-full">
            {/* Search */}
            <div className="p-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter notes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full bg-secondary/30 border border-input rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
                {searchTerm ? (
                    <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-muted-foreground px-2 mb-1 uppercase">Search Results</div>
                        {filteredNotes?.map(note => (
                            <button
                                key={note.id}
                                onClick={() => setActiveNote(note.id)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left",
                                    activeNoteId === note.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <span className="truncate">{note.title}</span>
                            </button>
                        ))}
                        {filteredNotes?.length === 0 && (
                            <div className="text-xs text-muted-foreground px-2">No notes found.</div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-0.5">
                            {systemFolders.map(f => {
                                const folderNotes = notes.filter(n => n.folderId === f.id);
                                return (
                                    <div key={f.id}>
                                        <button 
                                            className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md group"
                                            onClick={() => toggleFolder(f.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {getIcon(f.icon)}
                                                {f.name}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{folderNotes.length}</span>
                                        </button>
                                        {expandedFolders[f.id] && (
                                            <div className="ml-4 border-l border-border/50 pl-2">
                                                {folderNotes.map(note => (
                                                    <button
                                                        key={note.id}
                                                        onClick={() => setActiveNote(note.id)}
                                                        className={cn(
                                                            "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left",
                                                            activeNoteId === note.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                        )}
                                                    >
                                                        <span className="truncate">{note.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div className="border-t border-border/50 pt-2">
                            <div className="text-[10px] font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">Collections</div>
                            {rootFolders.map(f => renderFolder(f))}
                        </div>
                    </>
                )}
            </div>

            {/* Create Actions */}
            <div className="p-3 border-t border-border space-y-3 bg-secondary/5">
                <button 
                    onClick={() => createNote()}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <Layout className="w-4 h-4" />
                    New Note
                </button>
                <div className="grid grid-cols-2 gap-2">
                    {templates.map(tpl => (
                         <button 
                            key={tpl.id}
                            onClick={() => createNote(undefined, tpl.id)}
                            className="flex items-center gap-2 p-2 bg-background border border-border hover:bg-secondary rounded-md text-xs text-muted-foreground transition-colors"
                            title={tpl.name}
                        >
                            <span className="truncate">{tpl.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
