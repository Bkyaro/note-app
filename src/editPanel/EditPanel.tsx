import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { useTranslation } from 'react-i18next';

interface EditPanelProps {
    activeNote: Note | null;
    onNoteEdit: (title: string, body: string) => void;
}

export const EditPanel: React.FC<EditPanelProps> = ({ activeNote, onNoteEdit }) => {
    const { t } = useTranslation();
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
        <div className="flex flex-col p-12 md:p-8 flex-grow bg-white dark:bg-gray-900 h-full">
            <input
                type="text"
                className="text-2xl md:text-4xl font-bold border-none outline-none w-full bg-transparent
                           text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                value={title}
                onChange={handleTitleChange}
                placeholder={t('note.new')}
            />
            <textarea
                className="flex-grow text-base md:text-lg leading-relaxed mt-4 md:mt-8 resize-none border-none 
                         outline-none bg-transparent text-gray-800 dark:text-gray-200 
                         placeholder-gray-400 dark:placeholder-gray-600"
                value={body}
                onChange={handleBodyChange}
                placeholder={t('edit.placeholder')}
            />
        </div>
    );
};