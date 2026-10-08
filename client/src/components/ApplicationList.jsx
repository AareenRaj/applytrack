const formatDate = (value) => {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
};

const ApplicationList = ({ applications, isLoading, onDelete, onEdit }) => {
  if (isLoading) {
    return <div className="state-box">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="state-box">
        No applications match your current search or filter.
      </div>
    );
  }

  return (
    <div className="list-panel" aria-live="polite">
      {applications.map((application) => (
        <article className="application-card" key={application._id}>
          <div>
            <p className="company-name">{application.company}</p>
            <h3>{application.role}</h3>
            <p className="application-date">
              Applied {formatDate(application.appliedDate)}
            </p>
            {application.jobLink && (
              <a
                className="job-link"
                href={application.jobLink}
                rel="noreferrer"
                target="_blank"
              >
                View posting
              </a>
            )}
            {application.notes && <p className="notes">{application.notes}</p>}
          </div>

          <div className="card-actions">
            <span className={`status-pill status-${application.status}`}>
              {application.status}
            </span>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => onEdit(application)}
            >
              Edit
            </button>
            <button
              className="button button-danger"
              type="button"
              onClick={() => onDelete(application)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ApplicationList;
