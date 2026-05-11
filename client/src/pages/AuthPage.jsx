import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema, signupSchema } from '../validation/auth.schema';

const AuthPage = () => {
  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSignupSuccess('');

    // Validate
    const schema = tab === 'login' ? loginSchema : signupSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login({ email: form.email, password: form.password });
        navigate('/');
      } else {
        await signup(form);
        setSignupSuccess('Account created! You can now log in.');
        setTab('login');
        setForm((f) => ({ ...f, password: '' }));
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(140deg, #312e81 0%, #4f46e5 55%, #818cf8 100%)',
        }}
      >
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-white opacity-5 pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-white opacity-5 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <RefreshCw size={22} className="text-white" />
          </div>
          <span
            className="text-white text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            SyncFlow
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <blockquote
            className="text-2xl font-medium leading-snug mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            "Collaborate, track, and deliver — all in one place."
          </blockquote>
          <p
            className="text-sm"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Trusted by teams worldwide for seamless project management.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            ['10k+', 'Teams'],
            ['99.9%', 'Uptime'],
            ['4.9★', 'Rating'],
          ].map(([v, l]) => (
            <div
              key={l}
              className="text-center p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="text-white text-xl font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {v}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{
                background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
              }}
            >
              <RefreshCw size={20} />
            </div>
            <span
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              SyncFlow
            </span>
          </div>

          <h1
            className="text-3xl font-bold text-slate-900 mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {tab === 'login'
              ? 'Sign in to your collaborative workspace.'
              : 'Get started with your free account.'}
          </p>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setErrors({});
                  setApiError('');
                  setSignupSuccess('');
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Messages */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {apiError}
            </div>
          )}
          {signupSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              {signupSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Alex Johnson"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all duration-200 active:scale-95 mt-2 disabled:opacity-60 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
                boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
              }}
            >
              {loading
                ? 'Please wait…'
                : tab === 'login'
                  ? 'Sign In to SyncFlow →'
                  : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {tab === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
            <button
              onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
              className="text-brand-600 font-bold hover:underline cursor-pointer"
            >
              {tab === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
