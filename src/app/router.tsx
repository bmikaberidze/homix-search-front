import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ChatLayout from './components/layout/ChatLayout';
import MinimalLayout from './components/layout/MinimalLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

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

export const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        { index: true, element: <HomepageWrapper /> },
        { path: 'property/:id', element: <PropertyPage /> },
        { path: 'features', element: <FeaturesPage /> },
        { path: 'pricing', element: <PricingPage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: 'products', element: <ProductsPage /> },
        {
          path: 'profile',
          element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
        },
        {
          path: 'saved',
          element: <ProtectedRoute><SavedPropertiesPage /></ProtectedRoute>,
        },
        {
          path: 'messages',
          element: <ProtectedRoute><MessagesPage /></ProtectedRoute>,
        },
        {
          path: 'settings',
          element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
        },
      ],
    },
    {
      element: <ChatLayout />,
      children: [
        { path: 'chat', element: <ConversationPageNew /> },
      ],
    },
    {
      element: <MinimalLayout />,
      children: [
        { path: 'signin', element: <SignInPage /> },
        { path: 'signup', element: <SignUpPage /> },
        { path: 'onboarding', element: <OnboardingPage /> },
      ],
    },
  ],
  {
    basename: '/homix-search-front/',
  }
);
