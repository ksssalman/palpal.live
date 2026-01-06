import { useState, useEffect } from 'react';
import type { PalPalBridge } from '../utils/palpalBridge';

export function useSettings(user: any, bridge: PalPalBridge | null) {
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load timezone from local storage first
    const savedTz = localStorage.getItem('work_tracker_timezone');
    if (savedTz) setTimezone(savedTz);

    // If authenticated, try loading from cloud
    const loadCloudSettings = async () => {
        if (user && bridge?.isAuthenticated()) {
            try {
                const profile = await bridge.getUserProfile(user.uid);
                if (profile?.settings?.timezone) {
                    setTimezone(profile.settings.timezone);
                    localStorage.setItem('work_tracker_timezone', profile.settings.timezone);
                }
            } catch (e) {
                console.error('Failed to load cloud settings:', e);
            }
        }
    }

    loadCloudSettings();
  }, [user, bridge]);

  const handleTimezoneChange = async (newTimezone: string) => {
    setTimezone(newTimezone);
    localStorage.setItem('work_tracker_timezone', newTimezone);

    if (user && bridge?.isAuthenticated()) {
      try {
        const currentProfile = await bridge.getUserProfile(user.uid);
        const updatedProfile = {
          ...currentProfile,
          settings: {
            ...(currentProfile?.settings || {}),
            timezone: newTimezone
          }
        };
        await bridge.setUserProfile(updatedProfile, user.uid);
      } catch (e) {
        console.error('Failed to save settings to cloud:', e);
      }
    }
  };

  return {
      timezone,
      showSettings,
      setShowSettings,
      setTimezone: handleTimezoneChange
  };
}
