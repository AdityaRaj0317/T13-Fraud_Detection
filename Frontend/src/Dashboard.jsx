import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AlertTriangle, Shield, Activity, Users, Globe, Lock, TrendingUp, TrendingDown, RefreshCw, Download, Filter, Settings, MapPin, List, Sliders, Save, Plus, Trash2, Eye, Ban, CheckCircle, XCircle, Clock, Navigation } from 'lucide-react';

// API Configuration
const API_BASE = 'http://localhost:5000/api';
const IPINFO_TOKEN = 'your_ipinfo_token_here'; // Get from https://ipinfo.io
const MAXMIND_LICENSE = 'your_maxmind_license'; // Get from https://www.maxmind.com

// IP Geolocation Service
const getGeolocation = async (ip) => {
  try {
    // Try ipinfo.io first (free tier: 50k requests/month)
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`);
    if (response.ok) {
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city || 'Unknown',
        region: data.region || '',
        country: data.country || 'Unknown',
        countryName: data.country || 'Unknown',
        loc: data.loc ? data.loc.split(',') : [0, 0], // [lat, lng]
        lat: data.loc ? parseFloat(data.loc.split(',')[0]) : 0,
        lng: data.loc ? parseFloat(data.loc.split(',')[1]) : 0,
        org: data.org || 'Unknown ISP',
        timezone: data.timezone || '',
        postal: data.postal || '',
        provider: 'ipinfo'
      };
    }
  } catch (error) {
    console.warn('ipinfo.io failed, trying MaxMind...', error);
  }

  try {
    // Fallback to MaxMind (via your backend)
    const response = await fetch(`${API_BASE}/geolocation/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip })
    });
    if (response.ok) {
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city?.names?.en || 'Unknown',
        region: data.subdivisions?.[0]?.names?.en || '',
        country: data.country?.iso_code || 'Unknown',
        countryName: data.country?.names?.en || 'Unknown',
        lat: data.location?.latitude || 0,
        lng: data.location?.longitude || 0,
        timezone: data.location?.time_zone || '',
        postal: data.postal?.code || '',
        provider: 'maxmind'
      };
    }
  } catch (error) {
    console.error('MaxMind lookup failed:', error);
  }

  // Return default location if all services fail
  return {
    ip,
    city: 'Unknown',
    country: 'Unknown',
    countryName: 'Unknown',
    lat: 0,
    lng: 0,
    provider: 'none'
  };
};

const fetchDashboardStats = async () => {
  return {
    totalLogins: 12847,
    suspiciousLogins: 342,
    blockedAttempts: 89,
    activeUsers: 8234,
    trends: { logins: 12.5, suspicious: -8.3, blocked: 15.7 }
  };
};

const fetchLiveThreatMap = async () => {
  // Replace with: return await fetch(`${API_BASE}/admin/threat-map`).then(r => r.json());
  // Example with real geolocation:
  const loginAttempts = [
    { id: 1, ip: '103.21.58.132', user: 'user_1234', type: 'success', timestamp: new Date().toISOString() },
    { id: 2, ip: '103.106.200.45', user: 'user_5678', type: 'failed', timestamp: new Date().toISOString(), attempts: 3 },
    { id: 3, ip: '192.0.2.1', user: 'user_9012', type: 'blocked', timestamp: new Date().toISOString(), reason: 'Brute Force' },
    { id: 4, ip: '81.2.69.142', user: 'user_3456', type: 'success', timestamp: new Date().toISOString() },
    { id: 5, ip: '103.21.124.98', user: 'user_7890', type: 'suspicious', timestamp: new Date().toISOString(), reason: 'New Device' },
    { id: 6, ip: '218.251.112.25', user: 'user_2468', type: 'blocked', timestamp: new Date().toISOString(), reason: 'Geo-Block' },
    { id: 7, ip: '103.252.86.100', user: 'user_1357', type: 'success', timestamp: new Date().toISOString() },
    { id: 8, ip: '1.2.3.4', user: 'user_8642', type: 'failed', timestamp: new Date().toISOString(), attempts: 2 },
  ];

  // Enrich with geolocation data
  const enrichedAttempts = await Promise.all(
    loginAttempts.map(async (attempt) => {
      const geoData = await getGeolocation(attempt.ip);
      return {
        ...attempt,
        ...geoData
      };
    })
  );

  return enrichedAttempts;
};

const fetchIncidentLog = async () => {
  // Replace with: return await fetch(`${API_BASE}/admin/incidents`).then(r => r.json());
  return [
    {
      id: 'INC-001',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      user: 'user_8234',
      email: 'john.doe@example.com',
      ip: '192.168.1.100',
      location: 'New York, USA',
      type: 'blocked',
      reason: 'Velocity Limit Exceeded',
      details: 'User attempted 8 logins in 2 minutes',
      riskScore: 95,
      action: 'IP Blocked for 1 hour'
    },
    {
      id: 'INC-002',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      user: 'user_5621',
      email: 'sarah.smith@example.com',
      ip: '10.0.0.45',
      location: 'Beijing, China',
      type: 'flagged',
      reason: 'Login from Outside India',
      details: 'User typically logs in from Mumbai, India',
      riskScore: 72,
      action: 'OTP Challenge Sent'
    },
    {
      id: 'INC-003',
      timestamp: new Date(Date.now() - 480000).toISOString(),
      user: 'user_3401',
      email: 'mike.jones@example.com',
      ip: '172.16.0.22',
      location: 'Moscow, Russia',
      type: 'blocked',
      reason: 'Brute Force Attack Detected',
      details: 'Multiple failed password attempts with different passwords',
      riskScore: 98,
      action: 'Account Temporarily Locked'
    },
    {
      id: 'INC-004',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      user: 'user_9012',
      email: 'lisa.wang@example.com',
      ip: '192.168.2.50',
      location: 'Singapore',
      type: 'flagged',
      reason: 'Unusual Login Time',
      details: 'Login at 3:00 AM local time (usual pattern: 9 AM - 6 PM)',
      riskScore: 58,
      action: 'Email Notification Sent'
    },
    {
      id: 'INC-005',
      timestamp: new Date(Date.now() - 720000).toISOString(),
      user: 'user_7788',
      email: 'raj.patel@example.com',
      ip: '10.10.10.10',
      location: 'Delhi, India',
      type: 'flagged',
      reason: 'Device Fingerprint Mismatch',
      details: 'New browser/device detected for this account',
      riskScore: 65,
      action: 'Additional Verification Required'
    },
  ];
};

const fetchSecurityRules = async () => {
  // Replace with: return await fetch(`${API_BASE}/admin/rules`).then(r => r.json());
  return [
    {
      id: 'rule_1',
      name: 'Brute Force Protection',
      enabled: true,
      condition: 'failed_attempts',
      threshold: 5,
      timeWindow: 300,
      action: 'block_ip',
      duration: 3600,
      description: 'Block IP after 5 failed attempts within 5 minutes'
    },
    {
      id: 'rule_2',
      name: 'Geographic Restriction',
      enabled: true,
      condition: 'location_outside',
      allowedCountries: ['India'],
      action: 'flag_and_otp',
      description: 'Flag logins from outside India and require OTP'
    },
    {
      id: 'rule_3',
      name: 'Velocity Check',
      enabled: true,
      condition: 'login_velocity',
      threshold: 3,
      timeWindow: 60,
      action: 'flag',
      description: 'Flag if more than 3 login attempts in 1 minute'
    },
    {
      id: 'rule_4',
      name: 'Unusual Time Detection',
      enabled: false,
      condition: 'unusual_time',
      allowedHours: { start: 6, end: 23 },
      action: 'flag_and_notify',
      description: 'Flag logins outside 6 AM - 11 PM local time'
    },
  ];
};

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-blue-900">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      {change && (
        <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </div>
);

const ThreatMapView = ({ threats }) => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [geoFilter, setGeoFilter] = useState('all');

  const typeColors = {
    success: { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-300' },
    failed: { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-300' },
    suspicious: { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300' },
    blocked: { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-300' }
  };

  const groupedByCountry = threats.reduce((acc, threat) => {
    if (!acc[threat.countryName]) acc[threat.countryName] = [];
    acc[threat.countryName].push(threat);
    return acc;
  }, {});

  const threatStats = {
    total: threats.length,
    success: threats.filter(t => t.type === 'success').length,
    failed: threats.filter(t => t.type === 'failed').length,
    suspicious: threats.filter(t => t.type === 'suspicious').length,
    blocked: threats.filter(t => t.type === 'blocked').length
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Live Threat Map</h3>
            <p className="text-sm text-gray-400">Real-time geolocation of login attempts</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400">Success ({threatStats.success})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-400">Failed ({threatStats.failed})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-400">Suspicious ({threatStats.suspicious})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-400">Blocked ({threatStats.blocked})</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{threatStats.total}</p>
          <p className="text-xs text-gray-400">Total Events</p>
        </div>
        <div className="bg-green-900 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-400">{threatStats.success}</p>
          <p className="text-xs text-green-300">Success</p>
        </div>
        <div className="bg-yellow-900 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-400">{threatStats.failed}</p>
          <p className="text-xs text-yellow-300">Failed</p>
        </div>
        <div className="bg-orange-900 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-orange-400">{threatStats.suspicious}</p>
          <p className="text-xs text-orange-300">Suspicious</p>
        </div>
        <div className="bg-red-900 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-400">{threatStats.blocked}</p>
          <p className="text-xs text-red-300">Blocked</p>
        </div>
      </div>

      {/* Map substitute - Country grouped cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedByCountry).map(([country, countryThreats]) => (
          <div key={country} className="border border-gray-700 rounded-lg p-4 bg-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <h4 className="font-semibold text-white">{country}</h4>
              </div>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{countryThreats.length} events</span>
            </div>
            <div className="space-y-2">
              {countryThreats.map(threat => (
                <div 
                  key={threat.id} 
                  className={`flex items-center justify-between p-2 bg-gray-800 rounded border ${typeColors[threat.type].border} cursor-pointer hover:shadow transition`}
                  onClick={() => setSelectedThreat(threat)}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${typeColors[threat.type].bg} animate-pulse`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{threat.city}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-400 truncate">{threat.user}</p>
                        <p className="text-xs text-gray-500">{threat.ip}</p>
                      </div>
                    </div>
                  </div>
                  {threat.reason && (
                    <span className="text-xs text-red-400 font-medium ml-2 whitespace-nowrap">{threat.reason}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Threat Details Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedThreat(null)}>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Threat Details</h3>
              <button onClick={() => setSelectedThreat(null)} className="text-gray-500 hover:text-gray-400">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Event ID</p>
                  <p className="text-sm text-white">{selectedThreat.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedThreat.type === 'success' ? 'bg-green-900 text-green-400' :
                    selectedThreat.type === 'failed' ? 'bg-yellow-900 text-yellow-400' :
                    selectedThreat.type === 'suspicious' ? 'bg-orange-900 text-orange-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    {selectedThreat.type.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">User ID</p>
                  <p className="text-sm text-white">{selectedThreat.user}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Timestamp</p>
                  <p className="text-sm text-white">{new Date(selectedThreat.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">IP Address</p>
                  <p className="text-sm text-white font-mono">{selectedThreat.ip}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Geolocation Provider</p>
                  <p className="text-sm text-white capitalize">{selectedThreat.provider || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <p className="text-sm font-semibold text-gray-400 mb-2">Location Information</p>
                <div className="bg-blue-900 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">City:</span>
                    <span className="text-sm font-medium text-white">{selectedThreat.city}</span>
                  </div>
                  {selectedThreat.region && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Region:</span>
                      <span className="text-sm font-medium text-white">{selectedThreat.region}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Country:</span>
                    <span className="text-sm font-medium text-white">{selectedThreat.countryName} ({selectedThreat.country})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Coordinates:</span>
                    <span className="text-sm font-medium text-white font-mono">{selectedThreat.lat}, {selectedThreat.lng}</span>
                  </div>
                  {selectedThreat.timezone && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Timezone:</span>
                      <span className="text-sm font-medium text-white">{selectedThreat.timezone}</span>
                    </div>
                  )}
                  {selectedThreat.org && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">ISP:</span>
                      <span className="text-sm font-medium text-white">{selectedThreat.org}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedThreat.reason && (
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm font-semibold text-gray-400 mb-2">Threat Reason</p>
                  <p className="text-sm text-red-400 bg-red-900 p-3 rounded border border-red-700">{selectedThreat.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IncidentLogView = ({ incidents }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filteredIncidents = filterType === 'all' 
    ? incidents 
    : incidents.filter(inc => inc.type === filterType);

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'blocked': return <Ban className="w-4 h-4" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <List className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Incident Log</h3>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          >
            <option value="all">All Types</option>
            <option value="blocked">Blocked</option>
            <option value="flagged">Flagged</option>
          </select>
          <button className="px-3 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-700 flex items-center space-x-2 text-gray-300">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Risk Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredIncidents.map(incident => (
              <tr 
                key={incident.id} 
                className="hover:bg-gray-700 cursor-pointer transition"
                onClick={() => setSelectedIncident(incident)}
              >
                <td className="px-4 py-3 text-sm font-medium text-white">{incident.id}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(incident.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{incident.user}</p>
                    <p className="text-xs text-gray-400">{incident.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-white">{incident.location}</p>
                    <p className="text-xs text-gray-400">{incident.ip}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(incident.type)}
                    <span className="text-sm font-medium text-white">{incident.reason}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(incident.riskScore)}`}>
                    {incident.riskScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{incident.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedIncident(null)}>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Incident Details</h3>
              <button onClick={() => setSelectedIncident(null)} className="text-gray-500 hover:text-gray-400">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Incident ID</p>
                  <p className="text-sm text-white">{selectedIncident.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Timestamp</p>
                  <p className="text-sm text-white">{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">User</p>
                  <p className="text-sm text-white">{selectedIncident.user}</p>
                  <p className="text-xs text-gray-400">{selectedIncident.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">IP Address</p>
                  <p className="text-sm text-white">{selectedIncident.ip}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Location</p>
                  <p className="text-sm text-white">{selectedIncident.location}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Risk Score</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(selectedIncident.riskScore)}`}>
                    {selectedIncident.riskScore}/100
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-2">Reason</p>
                <p className="text-sm text-white bg-gray-700 p-3 rounded">{selectedIncident.reason}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-2">Details</p>
                <p className="text-sm text-white bg-gray-700 p-3 rounded">{selectedIncident.details}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-2">Action Taken</p>
                <p className="text-sm text-white bg-blue-900 p-3 rounded border border-blue-700">{selectedIncident.action}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RuleConfigurationView = ({ rules: initialRules }) => {
  const [rules, setRules] = useState(initialRules);
  const [editingRule, setEditingRule] = useState(null);
  const [showAddRule, setShowAddRule] = useState(false);

  const toggleRule = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    // Call API: PUT /api/admin/rules/${ruleId}/toggle
  };

  const saveRule = () => {
    // Call API: PUT /api/admin/rules/${editingRule.id}
    setRules(rules.map(rule => 
      rule.id === editingRule.id ? editingRule : rule
    ));
    setEditingRule(null);
  };

  const deleteRule = (ruleId) => {
    // Call API: DELETE /api/admin/rules/${ruleId}
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sliders className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Security Rules Configuration</h3>
        </div>
        <button 
          onClick={() => setShowAddRule(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition bg-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-white">{rule.name}</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  {rule.enabled ? (
                    <span className="px-2 py-1 bg-green-900 text-green-400 text-xs font-medium rounded">Active</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs font-medium rounded">Disabled</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{rule.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rule.threshold && (
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-400">Threshold</p>
                      <p className="text-sm font-semibold text-white">{rule.threshold}</p>
                    </div>
                  )}
                  {rule.timeWindow && (
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-400">Time Window</p>
                      <p className="text-sm font-semibold text-white">{rule.timeWindow}s</p>
                    </div>
                  )}
                  {rule.action && (
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-400">Action</p>
                      <p className="text-sm font-semibold text-white">{rule.action.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {rule.duration && (
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-semibold text-white">{rule.duration / 60}m</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  onClick={() => setEditingRule(rule)}
                  className="p-2 text-blue-400 hover:bg-gray-600 rounded transition"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-red-400 hover:bg-gray-600 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingRule(null)}>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Edit Rule: {editingRule.name}</h3>
              <button onClick={() => setEditingRule(null)} className="text-gray-500 hover:text-gray-400">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Rule Name</label>
                <input 
                  type="text"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
                <textarea 
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({...editingRule, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {editingRule.threshold !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Threshold</label>
                    <input 
                      type="number"
                      value={editingRule.threshold}
                      onChange={(e) => setEditingRule({...editingRule, threshold: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                    />
                  </div>
                )}
                
                {editingRule.timeWindow !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Time Window (seconds)</label>
                    <input 
                      type="number"
                      value={editingRule.timeWindow}
                      onChange={(e) => setEditingRule({...editingRule, timeWindow: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [threatMap, setThreatMap] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, threatMapData, incidentsData, rulesData] = await Promise.all([
        fetchDashboardStats(),
        fetchLiveThreatMap(),
        fetchIncidentLog(),
        fetchSecurityRules()
      ]);
      
      setStats(statsData);
      setThreatMap(threatMapData);
      setIncidents(incidentsData);
      setRules(rulesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
                <p className="text-sm text-gray-400">Fraud Detection & Login Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg ${autoRefresh ? 'bg-blue-900 text-blue-400' : 'bg-gray-700 text-gray-400'}`}
              >
                <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === 'overview'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('threat-map')}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === 'threat-map'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Live Threat Map</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === 'incidents'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span>Incident Log</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === 'rules'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>Rule Configuration</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Logins" 
                value={stats.totalLogins} 
                change={stats.trends.logins}
                trend="up"
                icon={Activity}
              />
              <StatCard 
                title="Suspicious Attempts" 
                value={stats.suspiciousLogins} 
                change={stats.trends.suspicious}
                trend="down"
                icon={AlertTriangle}
              />
              <StatCard 
                title="Blocked Attempts" 
                value={stats.blockedAttempts} 
                change={stats.trends.blocked}
                trend="up"
                icon={Lock}
              />
              <StatCard 
                title="Active Users" 
                value={stats.activeUsers} 
                icon={Users}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Threat Activity</h3>
                <div className="space-y-3">
                  {threatMap.slice(0, 5).map(threat => (
                    <div key={threat.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          threat.type === 'success' ? 'bg-green-500' :
                          threat.type === 'failed' ? 'bg-yellow-500' :
                          threat.type === 'suspicious' ? 'bg-orange-500' : 'bg-red-500'
                        } animate-pulse`}></div>
                        <div>
                          <p className="text-sm font-medium text-white">{threat.city}, {threat.country}</p>
                          <p className="text-xs text-gray-400">{threat.user}</p>
                        </div>
                      </div>
                      {threat.reason && (
                        <span className="text-xs text-red-400 font-medium">{threat.reason}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Active Security Rules</h3>
                <div className="space-y-3">
                  {rules.filter(r => r.enabled).map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{rule.name}</p>
                        <p className="text-xs text-gray-400">{rule.description}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Threat Map Tab */}
        {activeTab === 'threat-map' && (
          <ThreatMapView threats={threatMap} />
        )}

        {/* Incidents Tab */}
        {activeTab === 'incidents' && (
          <IncidentLogView incidents={incidents} />
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <RuleConfigurationView rules={rules} />
        )}
      </main>
    </div>
  );
}