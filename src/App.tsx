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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
                <button
                    onClick={toggleSidebar}
                    className={`
                        py-6 px-2 md:hidden fixed top-[50%] -translate-y-1/2 z-50 
                        rounded-r bg-gray-100 dark:bg-gray-800
                        transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700
                        ${isSidebarOpen ? 'left-[75vw]' : 'left-0'}
                    `}
                >
                    <div className="flex gap-1.5">
                        <div className="w-0.5 h-4 bg-gray-600 dark:bg-gray-400"></div>
                        <div className="w-0.5 h-4 bg-gray-600 dark:bg-gray-400"></div>
                    </div>
                </button>

                <div className={`
                    transition-transform duration-300 ease-in-out
                    fixed md:relative z-40 md:translate-x-0 h-full
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:w-auto w-[75vw]
                `}>
                    <Sidebar
                        notes={notes}
                        onNoteSelect={(id) => {
                            onNoteSelect(id);
                            setIsSidebarOpen(false);
                        }}
                        onNoteAdd={onNoteAdd}
                        onNoteDelete={handleDeleteClick}
                        activeNoteId={activeNote?.id}
                    />
                </div>

                {isSidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="flex-1">
                    {notes.length > 0 ? (
                        <EditPanel
                            activeNote={activeNote}
                            onNoteEdit={onNoteEdit}
                        />
                    ) : null}
                </div>

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