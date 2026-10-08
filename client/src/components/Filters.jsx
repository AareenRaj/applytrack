import { STATUSES } from "../constants.js";

const Filters = ({ filters, onChange }) => (
  <div className="filters-panel">
    <label>
      Search company or role
      <input
        name="search"
        type="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Search applications"
      />
    </label>

    <label>
      Status
      <select name="status" value={filters.status} onChange={onChange}>
        <option value="">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default Filters;
