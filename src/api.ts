import { Note } from "./types";

export const NotesAPI = {
	getAllNotes(): Note[] {
		const notes = JSON.parse(
			localStorage.getItem("notesapp-notes") || "[]"
		);
		return notes.sort((a: Note, b: Note) => {
			return new Date(a.updated!) > new Date(b.updated!) ? -1 : 1;
		});
	},

	saveNote(noteToSave: Note): void {
		const notes = this.getAllNotes();
		const existing = notes.find((note) => note.id === noteToSave.id);

		if (existing) {
			existing.title = noteToSave.title;
			existing.body = noteToSave.body;
			existing.updated = new Date().toISOString();
		} else {
			noteToSave.id = Math.floor(Math.random() * 1000000);
			noteToSave.updated = new Date().toISOString();
			notes.push(noteToSave);
		}

		localStorage.setItem("notesapp-notes", JSON.stringify(notes));
	},

	deleteNote(id: number): void {
		const notes = this.getAllNotes();
		const newNotes = notes.filter((note) => note.id !== id);
		localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
	},
};
