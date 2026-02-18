import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export default function UserMenu() {
  const navigate = useNavigate();
  const { currentUser, handleSignOut, handleOpenAuth } = useApp();

  if (!currentUser) {
    return (
      <button
        onClick={() => handleOpenAuth('signin')}
        className="bg-[#7065f0] text-white rounded-[8px] px-4 py-2 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#5048c7] transition-colors uppercase"
      >
        Sign In
      </button>
    );
  }

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#f0effb] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7065f0] to-[#5048c7] flex items-center justify-center">
          <span className="text-white font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[14px]">
            {currentUser.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] hidden md:block">
          {currentUser.name.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[240px] bg-white rounded-[12px] shadow-lg border border-[#f0effb] py-2 z-50">
          <div className="px-4 py-3 border-b border-[#f0effb]">
            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[14px] text-[#110229]">
              {currentUser.name}
            </p>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[12px] text-[#8f90a6]">
              {currentUser.email}
            </p>
            {currentUser.plan && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#f0effb] rounded-[4px]">
                <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[10px] text-[#7065f0]">
                  {currentUser.plan} Plan
                </span>
              </div>
            )}
          </div>

          <div className="py-2">
            <button
              onClick={() => { setIsOpen(false); navigate('/profile'); }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <User className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">My Profile</span>
            </button>

            <button
              onClick={() => { setIsOpen(false); navigate('/saved'); }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">Saved Properties</span>
            </button>

            <button
              onClick={() => { setIsOpen(false); navigate('/messages'); }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">Messages</span>
            </button>

            <button
              onClick={() => { setIsOpen(false); navigate('/settings'); }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">Settings</span>
            </button>
          </div>

          <div className="border-t border-[#f0effb] pt-2">
            <button
              onClick={() => { setIsOpen(false); handleSignOut(); }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#fee2e2] transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#dc2626]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#dc2626]">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
