import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { UserData } from './AuthDialog';
import { useApp } from '@/app/context/AppContext';
import { toast } from 'sonner';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPlan = searchParams.get('plan') || undefined;
  const { handleAuthSuccess } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'seller' | 'broker'>('buyer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (!email || !password || !name) {
        toast.error('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem('homix_users') || '[]');
      if (existingUsers.find((u: UserData) => u.email === email)) {
        toast.error('Email already registered. Please sign in.');
        setIsLoading(false);
        return;
      }

      const newUser: UserData = {
        id: Date.now().toString(),
        email,
        name,
        userType,
        plan: preSelectedPlan,
      };

      existingUsers.push(newUser);
      localStorage.setItem('homix_users', JSON.stringify(existingUsers));
      localStorage.setItem('homix_current_user', JSON.stringify(newUser));

      toast.success(`Welcome ${name}! Your account has been created.`);
      handleAuthSuccess(newUser);

      if (preSelectedPlan) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleSocialSignUp = (provider: string) => {
    toast.info(`${provider} sign up coming soon!`);
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#7065f0] to-[#5048c7] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center text-white">
            <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[48px] mb-6">
              Join Homix.ai Today
            </h1>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[20px] opacity-90">
              AI-powered real estate platform connecting buyers, sellers, and brokers
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-[480px] mx-auto w-full">
          <button onClick={() => navigate('/')} className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[36px] text-[#110229] uppercase tracking-[-1.08px] mb-2 cursor-pointer hover:text-[#7065f0] transition-colors">HOMIX.AI</button>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] mb-8">Create your account</p>

          {preSelectedPlan && (
            <div className="bg-[#f0effb] rounded-[8px] p-3 mb-6">
              <p className="text-[12px] text-[#7065f0] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                ✨ You'll be subscribed to the <strong>{preSelectedPlan}</strong> plan
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button type="button" onClick={() => handleSocialSignUp('Google')} variant="outline" className="w-full h-[48px] border-[1.5px] border-[#f0effb] hover:border-[#7065f0]">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px]">Continue with Google</span>
            </Button>
            <Button type="button" onClick={() => handleSocialSignUp('Facebook')} variant="outline" className="w-full h-[48px] border-[1.5px] border-[#f0effb] hover:border-[#7065f0]">
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px]">Continue with Facebook</span>
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#f0effb]"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">Or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f90a6]" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full h-[48px] pl-10 pr-4 border-[1.5px] border-[#f0effb] rounded-[8px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f90a6]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full h-[48px] pl-10 pr-4 border-[1.5px] border-[#f0effb] rounded-[8px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f90a6]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-[48px] pl-10 pr-4 border-[1.5px] border-[#f0effb] rounded-[8px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors" required />
              </div>
              <p className="text-[11px] text-[#8f90a6] mt-1 font-['Plus_Jakarta_Sans:Medium',sans-serif]">Must be at least 6 characters</p>
            </div>
            <div>
              <label className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] block mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'buyer', label: 'Buyer/Renter', icon: User },
                  { value: 'seller', label: 'Property Owner', icon: Building2 },
                  { value: 'broker', label: 'Broker/Agent', icon: Building2 },
                ] as const).map((type) => (
                  <button key={type.value} type="button" onClick={() => setUserType(type.value)} className={`p-3 border-[1.5px] rounded-[8px] flex flex-col items-center gap-2 transition-all ${userType === type.value ? 'border-[#7065f0] bg-[#f0effb]' : 'border-[#f0effb] hover:border-[#7065f0]'}`}>
                    <type.icon className={`w-5 h-5 ${userType === type.value ? 'text-[#7065f0]' : 'text-[#8f90a6]'}`} />
                    <span className={`font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[10px] text-center ${userType === type.value ? 'text-[#7065f0]' : 'text-[#8f90a6]'}`}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-[48px] bg-[#7065f0] hover:bg-[#5048c7] text-white">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[14px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
              Already have an account?{' '}
              <button onClick={() => navigate('/signin')} className="text-[#7065f0] font-['Plus_Jakarta_Sans:Bold',sans-serif] hover:underline">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
