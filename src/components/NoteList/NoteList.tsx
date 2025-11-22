import toast from "react-hot-toast";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import { useMutation } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import { useQueryClient } from "@tanstack/react-query";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError() {
      toast.error("Something wrong.", { id: "delete-fail" });
    },
  });

  const handleDelete = (id: string) => {
    mutate(id);
  };

  if (notes.length === 0) {
    return null;
  }
  return (
    <ul className={css.list}>
      {notes.map((note: Note) => {
        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                className={css.button}
                onClick={() => handleDelete(note.id)}
                disabled={isPending}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default NoteList;
