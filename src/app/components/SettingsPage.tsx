import { Button } from './ui/button';
import { Settings, Bell, Lock, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newListings, setNewListings] = useState(true);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 flex-grow w-full">
      <div className="max-w-[800px] mx-auto">
        {/* Page Header */}
        <h1 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[48px] text-[#110229] mb-2 flex items-center gap-3">
          <Settings className="w-12 h-12 text-[#7065f0]" />
          Settings
        </h1>
        <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[18px] text-[#8f90a6] mb-8">
          Manage your account preferences
        </p>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white border-2 border-[#f0effb] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#7065f0]" />
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[24px] text-[#110229]">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#f0effb]">
                <div>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                    Email Notifications
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6]">
                    Receive updates via email
                  </p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7065f0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#f0effb]">
                <div>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                    Push Notifications
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6]">
                    Receive browser notifications
                  </p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7065f0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#f0effb]">
                <div>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                    Price Alerts
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6]">
                    Get notified of price changes
                  </p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={priceAlerts}
                    onChange={(e) => setPriceAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7065f0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                    New Listings
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6]">
                    Alert me about new properties
                  </p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={newListings}
                    onChange={(e) => setNewListings(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7065f0]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white border-2 border-[#f0effb] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-[#7065f0]" />
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[24px] text-[#110229]">
                Privacy & Security
              </h2>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="text-left">
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                    Change Password
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6]">
                    Update your account password
                  </p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="text-left">
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                    Two-Factor Authentication
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6]">
                    Add extra security to your account
                  </p>
                </div>
              </Button>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white border-2 border-[#f0effb] rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-[#7065f0]" />
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[24px] text-[#110229]">
                Language & Region
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] block mb-2">
                  Language
                </label>
                <select className="w-full h-[48px] px-4 border-[1.5px] border-[#f0effb] rounded-[8px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] focus:border-[#7065f0] focus:outline-none transition-colors">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] block mb-2">
                  Currency
                </label>
                <select className="w-full h-[48px] px-4 border-[1.5px] border-[#f0effb] rounded-[8px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] focus:border-[#7065f0] focus:outline-none transition-colors">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            onClick={handleSaveSettings}
            className="bg-[#7065f0] text-white hover:bg-[#5048c7] w-full h-[56px]"
          >
            <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px]">
              Save Settings
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
