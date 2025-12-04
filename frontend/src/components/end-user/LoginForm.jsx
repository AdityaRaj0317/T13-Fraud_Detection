import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Eye, EyeOff, Zap, Activity } from 'lucide-react';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState([]);

  const simulateBackendCall = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockRiskScore = 95;
    if (onLoginSuccess) onLoginSuccess(mockRiskScore);
  };

  const handleSubmit = async () => {
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
    
    try {
      await simulateBackendCall();
    } catch (err) {
      setError('A simulation error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setParticles([]), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background with Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-xl w-full">
          {/* Main Heading */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-glow">
                <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">FraudGuard AI</h1>
                <p className="text-cyan-400 text-sm font-medium">Security Suite</p>
              </div>
            </div>
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              Protect Your
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Digital Assets
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Real-time fraud detection powered by artificial intelligence and machine learning algorithms.
            </p>
          </div>

          {/* Animated Shield Icon - Enhanced */}
          <div className="flex justify-center mb-12 relative">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
              
              {/* Rotating rings - 4 layers */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-48 h-48 border-2 border-cyan-500/40 border-t-cyan-500 rounded-full"></div>
              </div>
              <div className="absolute inset-2 animate-spin-reverse">
                <div className="w-44 h-44 border-2 border-purple-500/40 border-b-purple-500 rounded-full"></div>
              </div>
              <div className="absolute inset-4 animate-spin-slow-delayed">
                <div className="w-40 h-40 border-2 border-pink-500/30 border-r-pink-500 rounded-full"></div>
              </div>
              <div className="absolute inset-6 animate-spin-very-slow">
                <div className="w-36 h-36 border border-cyan-400/20 border-l-cyan-400 rounded-full"></div>
              </div>
              
              {/* Center shield with enhanced glow */}
              <div className="relative w-48 h-48 bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full animate-pulse opacity-50"></div>
                <Shield className="w-24 h-24 text-white relative z-10" strokeWidth={2} />
              </div>
              
              {/* Orbiting particles */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 shadow-lg shadow-cyan-400/50"></div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 shadow-lg shadow-purple-400/50"></div>
              </div>
              <div className="absolute inset-0 animate-spin-slow-delayed">
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-pink-400 rounded-full -translate-y-1/2 shadow-lg shadow-pink-400/50"></div>
              </div>
            </div>
          </div>

          {/* Stats Cards - Enhanced */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text mb-2">99.9%</div>
                <div className="text-gray-400 text-xs font-medium">Detection Rate</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text mb-2">&lt;50ms</div>
                <div className="text-gray-400 text-xs font-medium">Response Time</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text mb-2">1.2M+</div>
                <div className="text-gray-400 text-xs font-medium">Threats Blocked</div>
              </div>
            </div>
          </div>

          {/* Features - Enhanced */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:translate-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-500/60 transition-colors">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-gray-200 text-sm font-medium">Real-time threat detection</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:translate-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:border-purple-500/60 transition-colors">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-gray-200 text-sm font-medium">Behavioral pattern analysis</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:translate-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-pink-500/30 group-hover:border-pink-500/60 transition-colors">
                <Shield className="w-5 h-5 text-pink-400" />
              </div>
              <span className="text-gray-200 text-sm font-medium">Advanced encryption protocols</span>
            </div>
          </div>
        </div>

        {/* Scanning particles */}
        {isLoading && particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          ></div>
        ))}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FraudGuard AI</h1>
              <p className="text-xs text-gray-400">Security Portal</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-glow"></div>
            
            <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Top Accent Line with Animation */}
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
              
              <div className="p-8 md:p-10">
                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Secure Access Portal
                    </span>
                  </h2>
                  <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    AI-Powered Fraud Detection System
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Enter your username"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-cyan-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 pointer-events-none transition-all duration-300"></div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors z-10"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-cyan-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 pointer-events-none transition-all duration-300"></div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm animate-shake">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="relative w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl overflow-hidden group disabled:opacity-50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Analyzing Security...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Authenticate</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Security Info */}
                  <div className="pt-5 border-t border-slate-800">
                    <div className="flex items-start gap-3 text-xs text-gray-400">
                      <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p>
                        Your login is protected by advanced AI-powered fraud detection. We analyze behavioral patterns, device fingerprints, and network security in real-time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              <div className="px-8 py-4 bg-slate-950/50 text-center">
                <p className="text-xs text-gray-500">Protected by AI Security Engine v2.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.7), 0 0 60px rgba(168, 85, 247, 0.5); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-very-slow {
          animation: spin-very-slow 5s linear infinite;
        }
        
        .bg-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
        }
      `}</style>
    </div>
  );
};

export default LoginForm;