import { useEffect, useState } from "react";
import css from "./App.module.css";
import toast from "react-hot-toast";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { NotesHttpResponse } from "../../services/noteService";
import { fetchNotes } from "../../services/noteService";
import { useDebounce } from "../../hooks/useDebounce";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchNote, setSearchNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchNote, 500);

  const { data, isLoading, isError, isSuccess } = useQuery<NotesHttpResponse>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch.trim(),
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (
      isSuccess &&
      debouncedSearch.trim() !== "" &&
      data?.notes.length === 0
    ) {
      toast.error("No notes found for your search.", { id: "no-results" });
    }
  }, [isSuccess, data?.notes, debouncedSearch]);

  const handleChange = (query: string) => {
    setCurrentPage(1);
    setSearchNote(query);
  };

  const handleCreated = () => {
    closeModal();
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChange} />

        {isSuccess && !isError && data?.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            setCurrentPage={setCurrentPage}
          />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onCreated={handleCreated} />
        </Modal>
      )}
    </div>
  );
};

export default App;
