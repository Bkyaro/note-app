import React from 'react';
import { Note } from '../types';
import { useScrollShadow } from '../hooks/useScrollShadow';

interface SidebarProps {
    notes: Note[];
    onNoteSelect: (id: number) => void;
    onNoteAdd: () => void;
    onNoteDelete: (id: number) => void;
    activeNoteId?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
    notes,
    onNoteSelect,
    onNoteAdd,
    onNoteDelete,
    activeNoteId
}) => {
    const scrollContainerRef = useScrollShadow();

    return (
        <div className="h-full border-r-2 border-gray-200 dark:border-gray-700 
                    flex-shrink-0 bg-white dark:bg-gray-900
                    w-full md:w-[300px] relative flex flex-col">
            <div className="p-4 flex-shrink-0">
                <button
                    onClick={onNoteAdd}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded w-full text-lg"
                >
                    添加新的笔记 📒
                </button>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 py-2 pt-0 px-4 space-y-3 overflow-y-auto relative
                          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                style={{
                    '--top-shadow-opacity': '0',
                    '--bottom-shadow-opacity': '0'
                } as React.CSSProperties}
            >
                <div className="fixed inset-x-0 h-4 bg-gradient-to-b from-black/10 to-transparent 
                              dark:from-white/10 pointer-events-none transition-opacity duration-200"
                    style={{ opacity: 'var(--top-shadow-opacity)' }}
                />

                {notes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => note.id && onNoteSelect(note.id)}
                        onDoubleClick={() => {
                            if (note.id) {
                                onNoteDelete(note.id);
                            }
                        }}
                        className={`
                            cursor-pointer border border-gray-200 dark:border-gray-700 
                            rounded-lg p-4 hover:shadow-md transition-shadow duration-200
                            ${note.id === activeNoteId
                                ? 'bg-gray-100 dark:bg-gray-800 border-emerald-500 dark:border-emerald-600'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                        `}
                    >
                        <div className="text-lg font-medium dark:text-white truncate mb-2">
                            {note.title}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 truncate mb-2">
                            {note.body.substring(0, 50)}
                        </div>
                        <div className="text-gray-400 dark:text-gray-500 text-xs italic text-right">
                            {new Date(note.updated!).toLocaleString()}
                        </div>
                    </div>
                ))}

                <div className="fixed inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/30 to-transparent 
                              dark:from-white/10 pointer-events-none transition-opacity duration-200"
                    style={{ opacity: 'var(--bottom-shadow-opacity)' }}
                />
            </div>
        </div>
    );
};