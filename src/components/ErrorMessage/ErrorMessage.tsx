import css from "./ErrorMessage.module.css";

const ErrorMessage = () => {
  return <p className={css.text}>An error occurred. Please try again later.</p>;
};

export default ErrorMessage;
