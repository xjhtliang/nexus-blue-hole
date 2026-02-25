
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, BookOpen, Star, Calendar, Link as LinkIcon, SidebarOpen, History, LayoutTemplate, Layers } from 'lucide-react';
import { Note, NoteTemplate } from '../../../../types/neuron';
import { cn, formatDate } from '../../../../lib/utils';
import { useNeuronStore } from '../../../../store/useNeuronStore';

interface NoteEditorProps {
    note: Note | null;
}

const ContextPanel = ({ note, onClose }: { note: Note, onClose: () => void }) => {
    const { domains, updateNote } = useNeuronStore();

    return (
        <div className="w-72 border-l border-border bg-secondary/5 flex flex-col h-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-sm">Context & Links</h3>
                <button onClick={onClose}><SidebarOpen className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
                {/* Domain Selector */}
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Knowledge Domain
                    </h4>
                    <select 
                        className="w-full bg-card border border-input rounded-md px-2 py-1.5 text-sm"
                        value={note.domainId || ''}
                        onChange={(e) => updateNote({ id: note.id, domainId: e.target.value })}
                    >
                        <option value="">-- Assign Domain --</option>
                        {domains.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Linked Goals</h4>
                    <div className="text-sm text-muted-foreground italic">No goals linked yet.</div>
                    <button className="mt-2 text-xs text-primary hover:underline">+ Link Goal</button>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Referenced Tasks</h4>
                    <div className="text-sm text-muted-foreground italic">No tasks referenced.</div>
                    <button className="mt-2 text-xs text-primary hover:underline">+ Mention Task</button>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Backlinks</h4>
                    <div className="text-sm text-muted-foreground italic">No backlinks found.</div>
                </div>
            </div>
        </div>
    );
};

export const NoteEditor: React.FC<NoteEditorProps> = ({ note }) => {
    const { updateNote, createNote, templates } = useNeuronStore();
    const [showContext, setShowContext] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: note?.content || '',
        editable: !!note,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert mx-auto focus:outline-none min-h-[500px] p-8 max-w-3xl',
            },
        },
        onUpdate: ({ editor }) => {
            if (note) {
                updateNote({ id: note.id, content: editor.getHTML() });
            }
        }
    }, [note?.id]); 

    if (!note) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/5 space-y-6">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 mb-4 opacity-20 mx-auto" />
                    <h2 className="text-lg font-medium text-foreground">No Note Selected</h2>
                    <p className="text-sm">Select a note from the sidebar or create a new one.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => createNote()}
                        className="flex flex-col items-center p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all w-40"
                    >
                        <div className="p-2 bg-primary/10 rounded-full mb-2 text-primary">
                            <Bold className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Blank Note</span>
                    </button>
                    {templates.slice(0, 3).map(tpl => (
                        <button 
                            key={tpl.id}
                            onClick={() => createNote(undefined, tpl.id)}
                            className="flex flex-col items-center p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all w-40"
                        >
                            <div className="p-2 bg-secondary rounded-full mb-2 text-muted-foreground">
                                <LayoutTemplate className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">{tpl.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const ToolbarButton = ({ onClick, isActive, icon: Icon, title }: any) => (
        <button
            onClick={onClick}
            title={title}
            className={cn(
                "p-1.5 rounded hover:bg-secondary transition-colors",
                isActive ? "bg-secondary text-primary" : "text-muted-foreground"
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="flex h-full bg-background overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
                {/* Book Metadata Header (Conditional) */}
                {note.type === 'BOOK' && note.bookMetadata && (
                    <div className="bg-secondary/10 border-b border-border p-6 flex gap-6 shrink-0">
                        <div className="w-20 h-28 bg-secondary rounded shadow-sm flex-shrink-0 overflow-hidden relative">
                             {note.bookMetadata.coverUrl ? (
                                 <img src={note.bookMetadata.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Cover</div>
                             )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex gap-2 mb-1">
                                 <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full font-medium">Reading</span>
                                 <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">{note.bookMetadata.author || 'Unknown Author'}</span>
                            </div>
                            <input 
                                type="text" 
                                value={note.title}
                                onChange={(e) => updateNote({ id: note.id, title: e.target.value })}
                                className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full"
                            />
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span>{note.bookMetadata.rating}/5</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Added {formatDate(note.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Standard Header (if not Book) */}
                {note.type !== 'BOOK' && (
                    <div className="px-8 py-6 border-b border-border shrink-0">
                        <input 
                            type="text" 
                            value={note.title}
                            onChange={(e) => updateNote({ id: note.id, title: e.target.value })}
                            className="text-4xl font-bold bg-transparent border-none focus:outline-none w-full placeholder:text-muted-foreground/50"
                            placeholder="Untitled Note"
                        />
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-2">
                                {note.tags.map(t => (
                                    <span key={t} className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground">#{t}</span>
                                ))}
                                <button className="text-xs text-muted-foreground hover:text-primary px-2 py-0.5 border border-dashed rounded-full">+ Tag</button>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Last edited {formatDate(note.updatedAt)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                {editor && (
                    <div className="flex items-center justify-between px-8 py-2 border-b border-border bg-background sticky top-0 z-10">
                        <div className="flex items-center gap-1">
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                isActive={editor.isActive('bold')}
                                icon={Bold}
                                title="Bold"
                            />
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                isActive={editor.isActive('italic')}
                                icon={Italic}
                                title="Italic"
                            />
                            <div className="w-px h-5 bg-border mx-2" />
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                isActive={editor.isActive('heading', { level: 1 })}
                                icon={Heading1}
                                title="H1"
                            />
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                isActive={editor.isActive('heading', { level: 2 })}
                                icon={Heading2}
                                title="H2"
                            />
                             <div className="w-px h-5 bg-border mx-2" />
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                isActive={editor.isActive('bulletList')}
                                icon={List}
                                title="Bullet List"
                            />
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                isActive={editor.isActive('orderedList')}
                                icon={ListOrdered}
                                title="Ordered List"
                            />
                            <ToolbarButton 
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                isActive={editor.isActive('blockquote')}
                                icon={Quote}
                                title="Quote"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground" title="History">
                                <History className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setShowContext(!showContext)}
                                className={cn("p-1.5 rounded hover:bg-secondary text-muted-foreground", showContext && "bg-secondary text-primary")}
                                title="Toggle Context Panel"
                            >
                                <SidebarOpen className="w-4 h-4 transform rotate-180" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-background scroll-smooth">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Context Panel */}
            {showContext && (
                <ContextPanel note={note} onClose={() => setShowContext(false)} />
            )}
        </div>
    );
};
