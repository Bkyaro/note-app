import React from 'react';
import { Note } from '../types';

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
    return (
        <div className="h-full border-r-2 border-gray-200 dark:border-gray-700 
                flex-shrink-0 overflow-y-auto p-4 bg-white dark:bg-gray-900
                w-full md:w-[300px]">
            <button
                onClick={onNoteAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded w-full mb-4 text-lg"
            >
                添加新的笔记 📒
            </button>
            <div className="notes__list">
                {notes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => note.id && onNoteSelect(note.id)}
                        onDoubleClick={() => {
                            if (note.id) {
                                onNoteDelete(note.id);
                            }
                        }}
                        className={`cursor-pointer border-2 border-dotted m-2 rounded-lg p-4 
                            ${note.id === activeNoteId 
                                ? 'bg-gray-100 dark:bg-gray-800 font-bold' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                            dark:border-gray-700`}
                    >
                        <div className="text-ellipsis overflow-hidden text-lg dark:text-white">{note.title}</div>
                        <div className="text-ellipsis overflow-hidden text-gray-600 dark:text-gray-400">
                            {note.body.substring(0, 60)}
                            {note.body.length > 60 ? "..." : ""}
                        </div>
                        <div className=" text-gray-400 dark:text-gray-500 italic text-right text-sm">
                            {new Date(note.updated!).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};