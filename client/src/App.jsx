import { useEffect, useMemo, useRef, useState } from "react";
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication
} from "./api/applications.js";
import ApplicationForm, {
  emptyForm,
  toDateInputValue
} from "./components/ApplicationForm.jsx";
import ApplicationList from "./components/ApplicationList.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import Filters from "./components/Filters.jsx";
import StatusMessage from "./components/StatusMessage.jsx";
import SummaryCards from "./components/SummaryCards.jsx";

const initialFilters = {
  search: "",
  status: ""
};

const normalizePayload = (formData) => ({
  company: formData.company.trim(),
  role: formData.role.trim(),
  status: formData.status,
  appliedDate: formData.appliedDate,
  jobLink: formData.jobLink.trim(),
  notes: formData.notes.trim()
});

const App = () => {
  const formPanelRef = useRef(null);
  const [allApplications, setAllApplications] = useState([]);
  const [visibleApplications, setVisibleApplications] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [formData, setFormData] = useState(emptyForm);
  const [editingApplication, setEditingApplication] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search.trim() || filters.status),
    [filters]
  );

  const loadApplications = async (nextFilters = filters) => {
    setIsLoading(true);
    setError("");

    try {
      const [allData, filteredData] = await Promise.all([
        listApplications(),
        listApplications(nextFilters)
      ]);

      setAllApplications(allData);
      setVisibleApplications(filteredData);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleFilterChange = (event) => {
    const nextFilters = {
      ...filters,
      [event.target.name]: event.target.value
    };

    setFilters(nextFilters);
    loadApplications(nextFilters);
  };

  const handleFormChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const resetForm = () => {
    setEditingApplication(null);
    setFormData(emptyForm);
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
    setFormData({
      company: application.company || "",
      role: application.role || "",
      status: application.status || "Applied",
      appliedDate: toDateInputValue(application.appliedDate),
      jobLink: application.jobLink || "",
      notes: application.notes || ""
    });
    setSuccess("");
    setError("");

    requestAnimationFrame(() => {
      formPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      formPanelRef.current?.querySelector("input")?.focus();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = normalizePayload(formData);

      if (editingApplication) {
        await updateApplication(editingApplication._id, payload);
        setSuccess("Application updated.");
      } else {
        await createApplication(payload);
        setSuccess("Application added.");
      }

      resetForm();
      await loadApplications(filters);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      await deleteApplication(deleteTarget._id);
      setDeleteTarget(null);
      setSuccess("Application deleted.");
      await loadApplications(filters);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">MERN tracker</p>
          <h1>ApplyTrack</h1>
          <p className="hero-copy">
            Keep your internship applications organized from first apply to final
            decision.
          </p>
        </div>
      </header>

      <SummaryCards applications={allApplications} />

      <StatusMessage message={error} type="error" />
      <StatusMessage message={success} type="success" />

      <div className="dashboard-grid">
        <div ref={formPanelRef}>
          <ApplicationForm
            formData={formData}
            isEditing={Boolean(editingApplication)}
            isSaving={isSaving}
            onCancel={resetForm}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        </div>

        <section className="applications-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pipeline</p>
              <h2>Applications</h2>
            </div>
            {hasActiveFilters && (
              <span className="filter-note">
                Showing filtered results
              </span>
            )}
          </div>

          {editingApplication && (
            <div className="editing-banner">
              <span>
                Editing {editingApplication.role} at{" "}
                {editingApplication.company}
              </span>
              <button
                className="button button-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          )}

          <Filters filters={filters} onChange={handleFilterChange} />

          <ApplicationList
            applications={visibleApplications}
            isLoading={isLoading}
            onDelete={setDeleteTarget}
            onEdit={handleEdit}
          />
        </section>
      </div>

      <DeleteConfirmation
        application={deleteTarget}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
};

export default App;
