import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { NewNote, Note } from "../../types/note";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

interface NoteFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}
const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Min 3 chars")
    .max(50, "Max 50 chars")
    .required("Title is required"),
  content: Yup.string().max(500, "Max 500 chars"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

const NoteForm = ({ onCancel, onCreated }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<Note, unknown, FormValues>({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note added");
      onCreated();
    },
    onError: () => {
      toast.error("Something wrong.", { id: "create-fail" });
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={(values, helpers) => {
        mutate(values, {
          onSettled: () => {
            helpers.setSubmitting(false);
          },
        });
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          <fieldset>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                type="text"
                name="title"
                className={css.input}
              />
              <ErrorMessage
                name="title"
                component={"span"}
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as={"textarea"}
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component={"span"}
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as={"select"} id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage
                name="tag"
                component={"span"}
                className={css.error}
              />
            </div>
          </fieldset>
          <div className={css.actions}>
            <button
              onClick={onCancel}
              type="button"
              className={css.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {isSubmitting && <Loader />}
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
