import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ScheduledVisit, Property, OwnerChat } from '../types';
import { UserData } from '../components/AuthDialog';
import { sampleProperties } from '../data';
import { toast } from 'sonner';

interface AppContextValue {
  currentUser: UserData | null;
  handleAuthSuccess: (user: UserData) => void;
  handleSignOut: () => void;
  handleOpenAuth: (mode: 'signin' | 'signup', plan?: string) => void;
  handleUpdateUser: (user: UserData) => void;

  savedPropertyIds: string[];
  savedProperties: Property[];
  handleSaveProperty: (propertyId: string) => void;

  scheduledVisits: ScheduledVisit[];
  handleScheduleVisit: (visit: Omit<ScheduledVisit, 'id'>) => void;

  ownerChats: OwnerChat[];
  handleUpdateOwnerChats: (chats: OwnerChat[]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);
  const [ownerChats, setOwnerChats] = useState<OwnerChat[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('homix_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    const saved = localStorage.getItem('homix_saved_properties');
    if (saved) {
      setSavedPropertyIds(JSON.parse(saved));
    }
  }, []);

  const handleAuthSuccess = (user: UserData) => {
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem('homix_current_user');
    localStorage.removeItem('homix_chat_session_id');
    localStorage.removeItem('homix_conversation_id');
    setCurrentUser(null);
    toast.success('Signed out successfully');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup', _plan?: string) => {
    toast.error(`${mode === 'signin' ? 'Sign In' : 'Sign Up'} is not available yet. Please use guest mode.`);
  };

  const handleUpdateUser = (user: UserData) => {
    setCurrentUser(user);
  };

  const handleSaveProperty = (propertyId: string) => {
    const newSaved = savedPropertyIds.includes(propertyId)
      ? savedPropertyIds.filter(id => id !== propertyId)
      : [...savedPropertyIds, propertyId];

    setSavedPropertyIds(newSaved);
    localStorage.setItem('homix_saved_properties', JSON.stringify(newSaved));

    if (newSaved.includes(propertyId)) {
      toast.success('Property saved!');
    } else {
      toast.success('Property removed from saved');
    }
  };

  const handleScheduleVisit = (visit: Omit<ScheduledVisit, 'id'>) => {
    const newVisit: ScheduledVisit = {
      ...visit,
      id: Date.now().toString(),
    };
    setScheduledVisits(prev => [...prev, newVisit]);
  };

  const handleUpdateOwnerChats = (chats: OwnerChat[]) => {
    setOwnerChats(chats);
  };

  const savedProperties = sampleProperties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <AppContext.Provider value={{
      currentUser,
      handleAuthSuccess,
      handleSignOut,
      handleOpenAuth,
      handleUpdateUser,
      savedPropertyIds,
      savedProperties,
      handleSaveProperty,
      scheduledVisits,
      handleScheduleVisit,
      ownerChats,
      handleUpdateOwnerChats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
