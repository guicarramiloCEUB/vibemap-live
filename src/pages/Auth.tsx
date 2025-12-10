import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import VibeMapLogo from '@/components/VibeMapLogo';
import authHero from '@/assets/auth-hero.jpg';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach(err => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Bem-vindo de volta!');
          navigate('/');
        }
      } else {
        const validation = registerSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Record<string, string> = {};
          validation.error.errors.forEach(err => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Conta criada com sucesso!');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Image Section */}
      <div className="relative h-[35vh] overflow-hidden">
        <img
          src={authHero}
          alt="Party atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <VibeMapLogo size="lg" showText={true} />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-background px-6 pt-8 pb-12 -mt-6 rounded-t-[2rem] relative z-10">
        <h1 className="text-2xl font-bold text-center text-foreground mb-8">
          {isLogin ? 'Sign In' : 'Register'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="auth-input"
              />
              {errors.username && (
                <p className="text-destructive text-sm mt-1 ml-4">{errors.username}</p>
              )}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              name="email"
              placeholder={isLogin ? 'Username or email' : 'Email'}
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1 ml-4">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && (
              <p className="text-destructive text-sm mt-1 ml-4">{errors.password}</p>
            )}
          </div>

          {isLogin && (
            <div className="flex justify-between items-center text-sm px-2">
              <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Register
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold 
                       hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 
                       disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Register'
            )}
          </button>

          {!isLogin && (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
