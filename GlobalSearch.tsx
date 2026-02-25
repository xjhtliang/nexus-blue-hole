
import React, { useEffect, useState, useRef } from 'react';
import { Search, Command, FileText, CheckSquare, User, ArrowRight, Lightbulb, Layers } from 'lucide-react';
import { useWindowStore } from '../../store/useWindowStore';
import { useNeuronStore } from '../../store/useNeuronStore';
import { useCrmStore } from '../../store/useCrmStore';
import { neuronService } from '../../services/neuronMockService'; // Direct service access for suggestions
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const { tasks } = useNeuronStore();
    const { notes } = useNeuronStore();
    const { leads } = useCrmStore();
    const { closeWindow } = useWindowStore();
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce for suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 1) {
                const results = await neuronService.getSuggestions(query);
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Filter results (Client-side for now, would be server-side in real app)
    const taskResults = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
    const noteResults = notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
    const leadResults = leads.filter(l => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

    const handleNavigate = (path: string) => {
        navigate(path);
        closeWindow('global-search');
        onClose();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        // Could trigger immediate navigation or filter update here
    };

    return (
        <div className="flex flex-col h-full space-y-4" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                    autoFocus
                    type="text"
                    placeholder="Search anything..."
                    className="w-full bg-secondary/30 border border-input rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setShowSuggestions(true)}
                />
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2"
                            >
                                <Search className="w-3 h-3 text-muted-foreground" />
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {query && (
                    <>
                        {taskResults.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1">Tasks</h4>
                                {taskResults.map(task => (
                                    <button 
                                        key={task.id}
                                        onClick={() => handleNavigate('/neuron/tasks')}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary text-sm group"
                                    >
                                        <CheckSquare className="w-4 h-4 text-blue-500" />
                                        <span>{task.title}</span>
                                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {noteResults.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1">Notes</h4>
                                {noteResults.map(note => (
                                    <button 
                                        key={note.id}
                                        onClick={() => handleNavigate('/neuron/notes')}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary text-sm group"
                                    >
                                        <FileText className="w-4 h-4 text-orange-500" />
                                        <span>{note.title}</span>
                                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {leadResults.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1">CRM Leads</h4>
                                {leadResults.map(lead => (
                                    <button 
                                        key={lead.id}
                                        onClick={() => handleNavigate('/work/crm/leads')}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary text-sm group"
                                    >
                                        <User className="w-4 h-4 text-green-500" />
                                        <span>{lead.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2">{lead.company}</span>
                                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {taskResults.length === 0 && noteResults.length === 0 && leadResults.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No results found.
                            </div>
                        )}
                    </>
                )}
                {!query && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        Type to search across tasks, notes, leads and more.
                    </div>
                )}
            </div>
            
            <div className="text-[10px] text-muted-foreground border-t border-border pt-2 flex gap-4">
                <span>Select <kbd className="bg-secondary px-1 rounded">↵</kbd></span>
                <span>Navigate <kbd className="bg-secondary px-1 rounded">↑↓</kbd></span>
                <span>Close <kbd className="bg-secondary px-1 rounded">Esc</kbd></span>
            </div>
        </div>
    );
};
