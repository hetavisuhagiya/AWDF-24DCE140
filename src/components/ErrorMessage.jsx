function ErrorMessage({ message }) {
  return (
    <div>
      <h2 style={{ color: "red" }}>
        Error : {message}
      </h2>
    </div>
  );
}

export default ErrorMessage;