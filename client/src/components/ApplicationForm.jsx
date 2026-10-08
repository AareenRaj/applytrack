import { STATUSES } from "../constants.js";

const toDateInputValue = (value) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
};

const emptyForm = {
  company: "",
  role: "",
  status: "Applied",
  appliedDate: toDateInputValue(),
  jobLink: "",
  notes: ""
};

const ApplicationForm = ({
  formData,
  isEditing,
  isSaving,
  onCancel,
  onChange,
  onSubmit
}) => {
  const values = formData || emptyForm;

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Application</p>
          <h2>{isEditing ? "Edit application" : "Add application"}</h2>
        </div>
        {isEditing && (
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="form-grid">
        <label>
          Company
          <input
            name="company"
            value={values.company}
            onChange={onChange}
            required
            placeholder="Acme Labs"
          />
        </label>

        <label>
          Role
          <input
            name="role"
            value={values.role}
            onChange={onChange}
            required
            placeholder="Frontend Intern"
          />
        </label>

        <label>
          Status
          <select name="status" value={values.status} onChange={onChange}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          Applied date
          <input
            name="appliedDate"
            type="date"
            value={values.appliedDate}
            onChange={onChange}
          />
        </label>

        <label className="span-two">
          Job link
          <input
            name="jobLink"
            type="url"
            value={values.jobLink}
            onChange={onChange}
            placeholder="https://example.com/job"
          />
        </label>

        <label className="span-two">
          Notes
          <textarea
            name="notes"
            value={values.notes}
            onChange={onChange}
            rows="4"
            placeholder="Recruiter name, interview prep, next steps..."
          />
        </label>
      </div>

      <button className="button button-primary" type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add application"}
      </button>
    </form>
  );
};

export { emptyForm, toDateInputValue };
export default ApplicationForm;
