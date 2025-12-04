import React, { useState } from 'react';

const RuleConfig = () => {
  const [failedAttempts, setFailedAttempts] = useState(5);
  const [blockedCountry, setBlockedCountry] = useState('India');

  const handleSave = (e) => {
    e.preventDefault();
    // This action would call M5's API to update the rules in the database.
    alert(`Rules updated! Blocking IP after ${failedAttempts} failed attempts. Flagging logins from outside ${blockedCountry}.`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-2">
        ⚙️ Rule Configuration
      </h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 shadow-xl rounded-lg">
        <p className="text-sm text-gray-600">
          Set flag conditions that trigger higher risk scores or blocks.
        </p>
        
        {/* Rule: Block IP after X failed attempts */}
        <div>
          <label htmlFor="attempts" className="block text-sm font-medium text-gray-700">
            Block IP after X Failed Attempts
          </label>
          <input
            id="attempts"
            type="number"
            min="1"
            value={failedAttempts}
            onChange={(e) => setFailedAttempts(e.target.value)}
            className="mt-1 block w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: Block IP after 5 failed attempts (Brute Force Protection).
          </p>
        </div>

        {/* Rule: Flag logins from outside a specific region */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Flag Logins from Outside Country
          </label>
          <input
            id="country"
            type="text"
            value={blockedCountry}
            onChange={(e) => setBlockedCountry(e.target.value)}
            className="mt-1 block w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: Flag logins from outside India.
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Rules
        </button>
      </form>
    </div>
  );
};

export default RuleConfig;