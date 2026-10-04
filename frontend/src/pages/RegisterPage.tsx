import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !phone || !password || !confirmPassword) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await register({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-canvas flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 bg-surface p-8 sm:p-10 rounded-sm border border-border shadow-card relative overflow-hidden">
        {/* Decorative subtle accent line */}
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
            Student Enrolment
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-plum-900 font-normal">
            Begin Your Sadhana
          </h1>
          <p className="text-sm text-ink-muted font-sans max-w-md mx-auto">
            Create your student portal profile to enroll in classical yogic training, reserve shala slots, and access course materials.
          </p>
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
            id="register-name"
            label="Full Name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav Sharma"
            required
            leftIcon={<UserIcon className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="register-email"
              label="Email Address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              id="register-phone"
              label="Phone Number"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
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

            <Input
              id="register-confirm-password"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Student Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-border/80 text-center">
          <p className="text-xs text-ink-muted">
            Already registered as a student?{' '}
            <Link
              to="/login"
              className="text-gold-600 hover:text-gold-700 font-semibold underline underline-offset-2 ml-1"
            >
              Sign In to Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
