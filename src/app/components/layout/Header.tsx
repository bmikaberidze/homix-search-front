import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import UserMenu from '../UserMenu';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function Header() {
  const location = useLocation();
  const { currentUser, handleSignOut, handleOpenAuth } = useApp();

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#f0effb] py-5 px-8">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[28px] text-[#110229] uppercase tracking-[-1px] cursor-pointer hover:text-[#7065f0] transition-colors"
        >
          HOMIX.AI
        </Link>
        <nav className="hidden md:flex gap-10 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[15px] tracking-[-0.2px] uppercase">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`transition-colors ${
                location.pathname === to
                  ? 'text-[#7065f0]'
                  : 'text-[#110229] hover:text-[#7065f0]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {currentUser ? (
          <UserMenu />
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenAuth('signin')}
              className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[15px] text-[#110229] hover:text-[#7065f0] transition-colors uppercase"
            >
              Sign In
            </button>
            <Button
              onClick={() => toast.error('Get Started is not available yet. Please use guest mode by searching below.')}
              className="uppercase tracking-wide px-8"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
