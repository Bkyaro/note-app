export interface Note {
	id?: number;
	title: string;
	body: string;
	updated?: string;
}

export interface NotesAPI {
	getAllNotes: () => Note[];
	saveNote: (note: Note) => void;
	deleteNote: (id: number) => void;
}
