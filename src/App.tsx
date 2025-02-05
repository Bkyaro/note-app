import React, { useState, useEffect, useRef } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './sidebar/Sidebar';
import { EditPanel } from './editPanel/EditPanel';
import { Modal } from './modals/Modal';
import { NotesAPI } from './api';
import { Note } from './types';
import { Toolbar } from './toolbar/Toolbar';
import { ThemeProvider } from './contexts/ThemeContext';
import gsap from 'gsap';

const App: React.FC = () => {
    const { t } = useTranslation();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'delete' | 'export' | 'import' | null;
        noteId?: number;
    }>({
        isOpen: false,
        type: null
    });
    const [importFile, setImportFile] = useState<File | null>(null);
    const [notification, setNotification] = useState<string>("");
    const notificationRef = useRef<HTMLDivElement>(null);

    const refreshNotes = () => {
        const allNotes = NotesAPI.getAllNotes();
        setNotes(allNotes);
        if (allNotes.length === 0) {
            setActiveNote(null);
        } else if (!activeNote || !allNotes.some(note => note.id === activeNote.id)) {
            setActiveNote(allNotes[0]);
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
            title: t('note.new'),
            body: t('note.start')
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
        if (modalState.type === 'delete' && modalState.noteId !== undefined) {
            NotesAPI.deleteNote(modalState.noteId);
            refreshNotes();
        }
        setModalState({ isOpen: false, type: null });
    };

    const handleModalCancel = () => {
        setModalState({ isOpen: false, type: null });
        setImportFile(null);
    };

    const handleExportClick = () => {
        setModalState({
            isOpen: true,
            type: 'export'
        });
    };

    const handleExportConfirm = (format: 'csv' | 'xml') => {
        if (notes.length === 0) {
            setModalState({ isOpen: false, type: null });
            return;
        }

        if (format === 'csv') {
            let csvContent = "id,title,body,updated\n";
            notes.forEach(note => {
                csvContent += `${note.id},"${note.title.replace(/"/g, '""')}","${note.body.replace(/"/g, '""')}",${note.updated}\n`;
            });
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'notes.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if (format === 'xml') {
            let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<notes>\n`;
            notes.forEach(note => {
                xmlContent += "  <note>\n";
                xmlContent += `    <id>${note.id}</id>\n`;
                xmlContent += `    <title><![CDATA[${note.title}]]></title>\n`;
                xmlContent += `    <body><![CDATA[${note.body}]]></body>\n`;
                xmlContent += `    <updated>${note.updated}</updated>\n`;
                xmlContent += "  </note>\n";
            });
            xmlContent += `</notes>`;
            const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'notes.xml');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        setModalState({ isOpen: false, type: null });
    };

    const handleImportClick = () => {
        setModalState({
            isOpen: true,
            type: 'import'
        });
    };

    const parseCSV = (csvText: string): Array<{ title: string, body: string }> => {
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        const result: Array<{ title: string, body: string }> = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.split(/,(?=(?:"[^"]*"|[^"]*$))/);
            if (cells.length >= 4) {
                let title = cells[1].trim();
                let body = cells[2].trim();
                if (title.startsWith('"') && title.endsWith('"')) {
                    title = title.slice(1, -1).replace(/""/g, '"');
                }
                if (body.startsWith('"') && body.endsWith('"')) {
                    body = body.slice(1, -1).replace(/""/g, '"');
                }
                result.push({ title, body });
            }
        }
        return result;
    };

    const parseXML = (xmlText: string): Array<{ title: string, body: string }> => {
        const result: Array<{ title: string, body: string }> = [];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const noteElements = xmlDoc.getElementsByTagName("note");
        for (let i = 0; i < noteElements.length; i++) {
            const noteElem = noteElements[i];
            const titleElem = noteElem.getElementsByTagName("title")[0];
            const bodyElem = noteElem.getElementsByTagName("body")[0];
            const title = titleElem ? titleElem.textContent || "" : "";
            const body = bodyElem ? bodyElem.textContent || "" : "";
            result.push({ title, body });
        }
        return result;
    };

    const handleImportConfirm = () => {
        if (!importFile) {
            alert(t('select.file'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const fileName = importFile.name.toLowerCase();
            let importedNotes: Array<{ title: string, body: string }> = [];

            if (fileName.endsWith('.csv')) {
                importedNotes = parseCSV(content);
            } else if (fileName.endsWith('.xml')) {
                importedNotes = parseXML(content);
            } else {
                alert("仅支持 CSV 或 XML 格式的文件");
                return;
            }

            importedNotes.forEach(note => {
                NotesAPI.saveNote({
                    title: note.title,
                    body: note.body
                });
            });
            refreshNotes();
            setModalState({ isOpen: false, type: null });
            setImportFile(null);
            setNotification(t('import.success'));
        };
        reader.readAsText(importFile);
    };

    useEffect(() => {
        if (notification && notificationRef.current) {
            gsap.fromTo(
                notificationRef.current,
                { y: -50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power3.out",
                    onComplete: () => {
                        gsap.to(notificationRef.current, {
                            y: -50,
                            opacity: 0,
                            duration: 0.5,
                            ease: "power3.in",
                            delay: 2.5,
                            onComplete: () => setNotification("")
                        });
                    }
                }
            );
        }
    }, [notification]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
                {notification && (
                    <div ref={notificationRef} className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-6 py-3 bg-green-500 text-white rounded-b shadow-lg z-50">
                        {notification}
                    </div>
                )}
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

                {modalState.isOpen && modalState.type === 'delete' && (
                    <Modal
                        isOpen={modalState.isOpen}
                        title={t('delete.confirmTitle')}
                        message={t('delete.confirmMessage')}
                        onConfirm={handleModalConfirm}
                        onCancel={handleModalCancel}
                    />
                )}
                {modalState.isOpen && modalState.type === 'export' && (
                    <Modal
                        isOpen={modalState.isOpen}
                        title={t('export.note')}
                        message={t('export.message')}
                        onConfirm={() => {}}
                        onCancel={handleModalCancel}
                    >
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleExportConfirm('csv')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {t('export.csv')}
                            </button>
                            <button
                                onClick={() => handleExportConfirm('xml')}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {t('export.xml')}
                            </button>
                            <button
                                onClick={handleModalCancel}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded"
                            >
                                {t('delete.cancel')}
                            </button>
                        </div>
                    </Modal>
                )}
                {modalState.isOpen && modalState.type === 'import' && (
                    <Modal
                        isOpen={modalState.isOpen}
                        title={t('import.note')}
                        message={t('import.message')}
                        onConfirm={handleImportConfirm}
                        onCancel={handleModalCancel}
                    >
                        <div className="mb-4">
                            <input
                                id="importFileInput"
                                type="file"
                                accept=".csv,.xml"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setImportFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <label
                                htmlFor="importFileInput"
                                className="cursor-pointer inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                {importFile ? importFile.name : t('select.file')}
                            </label>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleImportConfirm}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {t('import.note')}
                            </button>
                            <button
                                onClick={handleModalCancel}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded"
                            >
                                {t('delete.cancel')}
                            </button>
                        </div>
                    </Modal>
                )}
                <Toolbar onExport={handleExportClick} onImport={handleImportClick} />
            </div>
        </ThemeProvider>
    );
};

export default App;