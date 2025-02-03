import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { EditPanel } from './editPanel/EditPanel';
import { NotesAPI } from './api';
import { Note } from './types';

const App: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);

    const refreshNotes = () => {
        const notes = NotesAPI.getAllNotes();
        setNotes(notes);
        if (notes.length > 0 && !activeNote) {
            setActiveNote(notes[0]);
        }
    };

    useEffect(() => {
        refreshNotes();
    }, []);

    const onNoteSelect = (noteId: number) => {
        const selectedNote = notes.find(note => note.id === noteId);
        if (selectedNote) setActiveNote(selectedNote);
    };

    const onNoteAdd = () => {
        const newNote = {
            title: "新建笔记",
            body: "开始记录...",
        };
        NotesAPI.saveNote(newNote);
        refreshNotes();
    };

    const onNoteEdit = (title: string, body: string) => {
        if (!activeNote) return;

        NotesAPI.saveNote({
            id: activeNote.id,
            title,
            body,
        });
        refreshNotes();
    };

    const onNoteDelete = (noteId: number) => {
        NotesAPI.deleteNote(noteId);
        refreshNotes();
    };

    return (
        <div className="flex h-full">
            <Sidebar
                notes={notes}
                onNoteSelect={onNoteSelect}
                onNoteAdd={onNoteAdd}
                onNoteDelete={onNoteDelete}
                activeNoteId={activeNote?.id}
            />
            {notes.length > 0 ? (
                <EditPanel
                    activeNote={activeNote}
                    onNoteEdit={onNoteEdit}
                />
            ) : null}
        </div>
    );
};

export default App;