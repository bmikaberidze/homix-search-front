import { useState, useEffect } from 'react';
import { Page, ScheduledVisit, Property, OwnerChat } from './types';
import HomepageWrapper from './components/HomepageWrapper';
import ConversationPageNew from './components/ConversationPageNew';
import PropertyPage from './components/PropertyPage';
import FeaturesPage from './components/FeaturesPage';
import PricingPage from './components/PricingPage';
import ContactPage from './components/ContactPage';
import ProductsPage from './components/ProductsPage';
import ProfilePage from './components/ProfilePage';
import SavedPropertiesPage from './components/SavedPropertiesPage';
import MessagesPage from './components/MessagesPage';
import SettingsPage from './components/SettingsPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import OnboardingPage from './components/OnboardingPage';
import { UserData } from './components/AuthDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { sampleProperties } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [initialQuery, setInitialQuery] = useState<string>('');
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('1');
  const [initialProperty, setInitialProperty] = useState<Property | null>(null);
  const [ownerChats, setOwnerChats] = useState<OwnerChat[]>([]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [preSelectedPlan, setPreSelectedPlan] = useState<string | undefined>(undefined);
  
  // Saved properties state
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('homix_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load saved properties
    const saved = localStorage.getItem('homix_saved_properties');
    if (saved) {
      setSavedPropertyIds(JSON.parse(saved));
    }
  }, []);

  const handleNavigate = (page: Page, query?: string, property?: Property) => {
    if (page === 'signin' || page === 'signup') {
      toast.error(`${page === 'signin' ? 'Sign In' : 'Sign Up'} is not available yet. Please use guest mode.`);
      return;
    }

    if (query) {
      setInitialQuery(query);
    } else {
      setInitialQuery('');
    }
    
    if (property) {
      setInitialProperty(property);
    } else {
      setInitialProperty(null);
    }
    
    setCurrentPage(page);
  };

  const handleScheduleVisit = (visit: Omit<ScheduledVisit, 'id'>) => {
    const newVisit: ScheduledVisit = {
      ...visit,
      id: Date.now().toString(),
    };
    setScheduledVisits([...scheduledVisits, newVisit]);
  };

  const handleViewProperty = (propertyId: string) => {
    toast.error(`Viewing property is not available yet.`);
    return;
    setSelectedPropertyId(propertyId);
    setCurrentPage('property');
  };

  const handleUpdateOwnerChats = (chats: OwnerChat[]) => {
    setOwnerChats(chats);
  };

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

  const handleOpenAuth = (mode: 'signin' | 'signup', plan?: string) => {
    toast.error(`${mode === 'signin' ? 'Sign In' : 'Sign Up'} is not available yet. Please use guest mode.`);
    return;
    // If using pages, navigate instead of dialog
    if (mode === 'signin') {
      setCurrentPage('signin');
    } else {
      setPreSelectedPlan(plan);
      setCurrentPage('signup');
    }
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
  
  const savedProperties = sampleProperties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <>
      {currentPage === 'home' && (
        <HomepageWrapper 
          onNavigate={handleNavigate} 
          onViewProperty={handleViewProperty}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'conversation' && (
        <ConversationPageNew 
          onNavigate={handleNavigate} 
          initialQuery={initialQuery}
          initialProperty={initialProperty}
          scheduledVisits={scheduledVisits}
          onScheduleVisit={handleScheduleVisit}
          onViewProperty={handleViewProperty}
          ownerChats={ownerChats}
          onUpdateOwnerChats={handleUpdateOwnerChats}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'property' && (
        <PropertyPage 
          onNavigate={handleNavigate}
          propertyId={selectedPropertyId}
          onScheduleVisit={handleScheduleVisit}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'features' && (
        <FeaturesPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'pricing' && (
        <PricingPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'contact' && (
        <ContactPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'products' && (
        <ProductsPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentPage === 'saved-properties' && (
        <SavedPropertiesPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
          onViewProperty={handleViewProperty}
          savedProperties={savedProperties}
          onUnsaveProperty={handleSaveProperty}
        />
      )}
      {currentPage === 'messages' && (
        <MessagesPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'settings' && (
        <SettingsPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />
      )}
      {currentPage === 'signin' && (
        <SignInPage 
          onNavigate={handleNavigate}
          onSuccess={handleAuthSuccess}
        />
      )}
      {currentPage === 'signup' && (
        <SignUpPage 
          onNavigate={handleNavigate}
          onSuccess={handleAuthSuccess}
          preSelectedPlan={preSelectedPlan}
        />
      )}
      {currentPage === 'onboarding' && (
        <OnboardingPage 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      <Toaster />
    </>
  );
}