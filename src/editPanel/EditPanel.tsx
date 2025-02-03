import React, { useState, useEffect } from 'react';
import { Note } from '../types';

interface EditPanelProps {
    activeNote: Note | null;
    onNoteEdit: (title: string, body: string) => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({ activeNote, onNoteEdit }) => {
    const [title, setTitle] = useState(activeNote?.title || '');
    const [body, setBody] = useState(activeNote?.body || '');

    useEffect(() => {
        if (activeNote) {
            setTitle(activeNote.title);
            setBody(activeNote.body);
        }
    }, [activeNote]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        onNoteEdit(newTitle, body);
    };

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newBody = e.target.value;
        setBody(newBody);
        onNoteEdit(title, newBody);
    };

    if (!activeNote) return null;

    return (
        <div className="flex flex-col p-8 flex-grow">
            <input
                type="text"
                className="text-4xl font-bold border-none outline-none w-full"
                value={title}
                onChange={handleTitleChange}
                placeholder="新笔记..."
            />
            <textarea
                className="flex-grow text-lg leading-relaxed mt-8 resize-none border-none outline-none"
                value={body}
                onChange={handleBodyChange}
                placeholder="编辑笔记..."
            />
        </div>
    );
};