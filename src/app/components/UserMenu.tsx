import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Heart, MessageCircle } from 'lucide-react';
import { UserData } from './AuthDialog';
import { Page } from '../types';

interface UserMenuProps {
  user?: UserData | null;
  currentUser?: UserData | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onNavigate?: (page: Page) => void;
}

export default function UserMenu({ user, currentUser, onOpenAuth, onSignOut, onNavigate }: UserMenuProps) {
  const activeUser = user || currentUser;

  // If no user and onOpenAuth is provided, show sign in button
  if (!activeUser && onOpenAuth) {
    return (
      <button
        onClick={() => onOpenAuth('signin')}
        className="bg-[#7065f0] text-white rounded-[8px] px-4 py-2 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#5048c7] transition-colors uppercase"
      >
        Sign In
      </button>
    );
  }

  if (!activeUser) return null;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#f0effb] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7065f0] to-[#5048c7] flex items-center justify-center">
          <span className="text-white font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[14px]">
            {activeUser.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] hidden md:block">
          {activeUser.name.split(' ')[0]}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[240px] bg-white rounded-[12px] shadow-lg border border-[#f0effb] py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[#f0effb]">
            <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[14px] text-[#110229]">
              {activeUser.name}
            </p>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[12px] text-[#8f90a6]">
              {activeUser.email}
            </p>
            {activeUser.plan && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#f0effb] rounded-[4px]">
                <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[10px] text-[#7065f0]">
                  {activeUser.plan} Plan
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('profile');
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <User className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">
                My Profile
              </span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('saved-properties');
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">
                Saved Properties
              </span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('messages');
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">
                Messages
              </span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('settings');
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f0effb] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#8f90a6]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">
                Settings
              </span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-[#f0effb] pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#fee2e2] transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#dc2626]" />
              <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#dc2626]">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}