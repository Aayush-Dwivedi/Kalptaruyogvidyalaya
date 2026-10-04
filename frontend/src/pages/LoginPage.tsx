import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginDemoStudent, loginDemoAdmin, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      const loggedUser = await login({ email, password });
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'admin' || loggedUser.role === 'super_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleStudentDemo = async () => {
    setLocalError(null);
    try {
      await loginDemoStudent();
      navigate(from || '/dashboard', { replace: true });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Student demo login failed.');
    }
  };

  const handleAdminDemo = async () => {
    setLocalError(null);
    try {
      await loginDemoAdmin();
      navigate(from || '/admin', { replace: true });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Admin demo login failed.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-canvas flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-surface p-8 sm:p-10 rounded-sm border border-border shadow-card relative overflow-hidden">
        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-plum-700 via-gold-500 to-plum-900" />

        <div className="text-center space-y-2">
          <Link to="/" className="inline-block hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Kalptaru Yog Vidyalaya Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/60 shadow-card mx-auto mb-1"
            />
          </Link>
          <span className="text-[11px] font-mono tracking-widest-editorial uppercase text-gold-600 font-semibold block">
            Kalptaru Portal
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-plum-900 font-normal">
            Welcome to Sadhana
          </h1>
          <p className="text-xs text-ink-muted font-sans max-w-xs mx-auto">
            Sign in to access your student coursework or the institute administration console.
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="bg-canvas-warm border border-gold-400/40 rounded p-3.5 space-y-2.5 text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span className="text-[11px] font-mono uppercase font-semibold text-plum-900 tracking-wider">
              1-Click Demo Accounts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleStudentDemo}
              disabled={isLoading}
              className="px-2.5 py-2 text-[11px] font-mono font-medium rounded border border-border bg-surface hover:bg-gold-50 hover:border-gold-400 text-plum-900 transition-colors flex flex-col items-start"
            >
              <span className="font-semibold text-gold-700">Student Portal</span>
              <span className="text-[10px] text-ink-faint truncate w-full">student@kalptaru</span>
            </button>

            <button
              type="button"
              onClick={handleAdminDemo}
              disabled={isLoading}
              className="px-2.5 py-2 text-[11px] font-mono font-medium rounded border border-plum-900/30 bg-plum-900/5 hover:bg-plum-900/10 text-plum-900 transition-colors flex flex-col items-start"
            >
              <span className="font-semibold text-plum-900 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-gold-600" /> Admin Console
              </span>
              <span className="text-[10px] text-ink-faint truncate w-full">admin@kalptaru</span>
            </button>
          </div>
        </div>

        {(localError || error) && (
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded p-3 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="login-email"
            label="Email Address"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@kalptaruyog.org"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="relative">
            <Input
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-ink-faint hover:text-plum-900 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="pt-3 border-t border-border/80 text-center">
          <p className="text-xs text-ink-muted">
            New to Kalptaru Yog Vidyalaya?{' '}
            <Link
              to="/register"
              className="text-gold-600 hover:text-gold-700 font-semibold underline underline-offset-2 ml-1"
            >
              Create student account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
