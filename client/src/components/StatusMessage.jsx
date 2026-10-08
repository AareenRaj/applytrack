const StatusMessage = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`status-message ${type}`} role="status">
      {message}
    </div>
  );
};

export default StatusMessage;
