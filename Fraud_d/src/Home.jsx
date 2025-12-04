import React from 'react';

export default function FraudDetectionHomepage() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    alert('Redirecting to login page...');
    // In your actual app: navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900 bg-opacity-95 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">
              🛡️
            </div>
            <span className="text-white text-2xl font-bold">FraudGuard</span>
          </div>
          <div className="hidden md:flex gap-8">
           
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white pt-40 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 px-6 py-2 rounded-full text-sm mb-8 animate-fade-in">
            🔒 Next-Generation Security Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Protect Your Account with Intelligent Login Security
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white text-opacity-90">
            Advanced fraud detection powered by real-time risk analysis and adaptive authentication
          </p>
          
          <button 
            onClick={handleLogin}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-2 transition-all duration-300"
          >
            <span>Get Started - Login</span>
            <span className="text-2xl">→</span>
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gradient-to-br from-red-50 to-yellow-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 text-slate-900">
            The Growing Threat
          </h2>
          <p className="text-xl text-center text-slate-600 mb-16">
            Modern cyber attacks are sophisticated and relentless
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Brute Force Attacks', desc: 'Automated attempts to crack passwords through rapid-fire login attempts' },
              { icon: '🔑', title: 'Credential Stuffing', desc: 'Using stolen credentials from data breaches to access multiple accounts' },
              { icon: '🤖', title: 'Botnet Attacks', desc: 'Coordinated attacks from distributed networks of compromised devices' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-black border-opacity-5">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-red-500/30">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="bg-gradient-to-br from-blue-50 to-purple-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 text-slate-900">
            Intelligent Real-Time Protection
          </h2>
          <p className="text-xl text-center text-slate-600 mb-16">
            Multi-layered security with adaptive authentication
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📍', title: 'Geolocation Analysis', desc: 'Detect impossible travel and geographic anomalies in real-time' },
              { icon: '⚡', title: 'Velocity Checks', desc: 'Monitor login frequency and patterns to identify suspicious behavior' },
              { icon: '🖥️', title: 'Device Fingerprinting', desc: 'Track device metadata, browser info, and unique identifiers' },
              { icon: '🧠', title: 'AI Risk Engine', desc: 'Machine learning algorithms analyze patterns and calculate risk scores' },
              { icon: '🔐', title: 'Adaptive MFA', desc: 'Dynamic multi-factor authentication triggered by risk level' },
              { icon: '🔔', title: 'Real-Time Alerts', desc: 'Instant notifications for security teams and affected users' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-black border-opacity-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blue-500/30">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Flow Section */}
      <section id="how-it-works" className="bg-slate-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 text-slate-900">
            How It Works
          </h2>
          <p className="text-xl text-center text-slate-600 mb-16">
            Seamless security that adapts to risk level
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { badge: 'Low Risk', badgeClass: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow-green-500/20', icon: '✅', title: 'Direct Access', desc: 'Trusted devices and locations receive immediate access without friction' },
              { badge: 'Medium Risk', badgeClass: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 shadow-yellow-500/20', icon: '📱', title: 'OTP Verification', desc: 'Suspicious patterns trigger one-time password verification via email or SMS' },
              { badge: 'High Risk', badgeClass: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-red-500/20', icon: '🚫', title: 'Account Locked', desc: 'Critical threats result in immediate account lock with security team notification' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center border border-black border-opacity-5">
                <div className={`inline-block px-8 py-3 rounded-full font-bold text-lg mb-6 shadow-lg ${item.badgeClass}`}>
                  {item.badge}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.icon} {item.title}</h3>
                <p className="text-slate-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section id="admin" className="bg-gradient-to-br from-green-50 to-emerald-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 text-slate-900">
            Security Analyst Dashboard
          </h2>
          <p className="text-xl text-center text-slate-600 mb-16">
            Complete visibility and control over your security posture
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌍', title: 'Live Threat Map', desc: 'Visual representation of login attempts worldwide with real-time risk indicators and geographic distribution' },
              { icon: '📊', title: 'Incident Log', desc: 'Comprehensive audit trail of all security events with detailed metadata and investigation tools' },
              { icon: '⚙️', title: 'Rule Configuration', desc: 'Customize risk thresholds, create custom rules, and fine-tune detection algorithms' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-black border-opacity-5">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-green-500/30">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-5xl font-black text-center mb-12">
            Built with Modern Technology
          </h2>
          
          <div className="flex justify-center gap-16 flex-wrap">
            {[
              { icon: '⚛️', name: 'React' },
              { icon: '🟢', name: 'Node.js' },
              { icon: '🗄️', name: 'MongoDB' },
              { icon: '🔥', name: 'Redis' },
              { icon: '🤖', name: 'ML Models' }
            ].map((item, idx) => (
              <div key={idx} className="text-center hover:-translate-y-3 transition-transform duration-300">
                <div className="text-6xl mb-4 drop-shadow-2xl">{item.icon}</div>
                <p className="font-semibold text-xl">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white text-center py-12 px-8">
        <p className="text-lg font-semibold mb-2">
          &copy; 2024 FraudGuard - Intelligent Login Security
        </p>
        <p className="text-white text-opacity-80">
          Protecting digital identities with advanced fraud detection
        </p>
      </footer>
    </div>
  );
}