const IncidentLog = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">📋 Incident Log</h1>
    <div className="p-4 bg-white border rounded-lg">
      <p className="text-gray-700">
        Placeholder for detailed list of flagged attempts with reasons (e.g., "Velocity Limit Exceeded").
      </p>
      {/* M2 will replace this with a filterable, sortable table connected to the database */}
    </div>
  </div>
);
export default IncidentLog;