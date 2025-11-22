import axios from "axios";
import type { NewNote, Note } from "../types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<NotesHttpResponse> => {
  const response = await axios.get<NotesHttpResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        page,
        perPage,
        search,
      },
      headers: { Authorization: `Bearer ${myKey}` },
    }
  );
  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await axios.post<Note>(
    `https://notehub-public.goit.study/api/notes`,
    newNote,
    {
      headers: { Authorization: `Bearer ${myKey}` },
    }
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: { Authorization: `Bearer ${myKey}` },
    }
  );
  return response.data;
};
