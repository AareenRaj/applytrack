import { STATUSES } from "../constants.js";

const SummaryCards = ({ applications }) => {
  const counts = applications.reduce(
    (totals, application) => {
      totals.Total += 1;
      totals[application.status] += 1;
      return totals;
    },
    {
      Total: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    }
  );

  return (
    <section className="summary-grid" aria-label="Application summary">
      {["Total", ...STATUSES].map((label) => (
        <article className="summary-card" key={label}>
          <p>{label}</p>
          <strong>{counts[label]}</strong>
        </article>
      ))}
    </section>
  );
};

export default SummaryCards;
