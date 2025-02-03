import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { EditPanel } from './editPanel/EditPanel';
import { Modal } from './modals/Modal';
import { NotesAPI } from './api';
import { Note } from './types';
import { Toolbar } from './toolbar/Toolbar';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'delete' | null;
        noteId?: number;
    }>({
        isOpen: false,
        type: null
    });

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

    const handleDeleteClick = (noteId: number) => {
        setModalState({
            isOpen: true,
            type: 'delete',
            noteId
        });
    };

    const handleModalConfirm = () => {
        if (modalState.type === 'delete' && modalState.noteId) {
            NotesAPI.deleteNote(modalState.noteId);
            refreshNotes();
        }
        setModalState({ isOpen: false, type: null });
    };

    const handleModalCancel = () => {
        setModalState({ isOpen: false, type: null });
    };

    return (
        <ThemeProvider>
            <div className="flex h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Sidebar
                    notes={notes}
                    onNoteSelect={onNoteSelect}
                    onNoteAdd={onNoteAdd}
                    onNoteDelete={handleDeleteClick}
                    activeNoteId={activeNote?.id}
                />
                {notes.length > 0 ? (
                    <EditPanel
                        activeNote={activeNote}
                        onNoteEdit={onNoteEdit}
                    />
                ) : null}
                <Modal
                    isOpen={modalState.isOpen}
                    title="删除确认"
                    message="确定要删除这条笔记吗？此操作无法撤销。"
                    onConfirm={handleModalConfirm}
                    onCancel={handleModalCancel}
                />
                <Toolbar />
            </div>
        </ThemeProvider>
    );
};

export default App;