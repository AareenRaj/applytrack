const DeleteConfirmation = ({ application, isDeleting, onCancel, onConfirm }) => {
  if (!application) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        aria-labelledby="delete-title"
        aria-modal="true"
        className="modal"
        role="dialog"
      >
        <h2 id="delete-title">Delete application?</h2>
        <p>
          This will remove the application for{" "}
          <strong>{application.role}</strong> at{" "}
          <strong>{application.company}</strong>.
        </p>
        <div className="modal-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="button button-danger"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
