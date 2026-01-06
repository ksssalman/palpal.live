import { useState, useEffect } from 'react';
import { getPalPalBridge } from '../utils/palpalBridge';
import { auth as dedicatedAuth, googleProvider } from '../utils/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export function usePalPalAuth() {
  const [user, setUser] = useState<any>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const bridge = getPalPalBridge();

  useEffect(() => {
    if (bridge) {
      const currentUser = bridge.getUser();
      setUser(currentUser);

      let unsubscribe: (() => void) | undefined;

      if (!bridge.isDedicated) {
        unsubscribe = (window as any).palpalAuth?.onAuthStateChanged((u: any) => {
          const user = u ? { uid: u.uid, email: u.email } : null;
          setUser(user);
        });
      } else {
        unsubscribe = onAuthStateChanged(dedicatedAuth, (u) => {
          const user = u ? { uid: u.uid, email: u.email } : null;
          setUser(user);
        });
      }

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [bridge]);

  const handleSignIn = async (isTemporaryData: boolean) => {
    try {
      setIsSigningIn(true);
      setSignInError(null);

      if (isTemporaryData) {
        console.log('User signing in with temporary data in state');
      }

      if (bridge && !bridge.isDedicated) {
        await (window as any).palpalAuth.signInWithGoogle();
      } else {
        await signInWithPopup(dedicatedAuth, googleProvider);
      }
    } catch (e: any) {
      const errorMessage = e?.message || 'Sign in failed. Please try again.';
      setSignInError(errorMessage);
      setTimeout(() => setSignInError(null), 5000);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (bridge && !bridge.isDedicated) {
        await (window as any).palpalAuth.signOut();
      } else {
        await signOut(dedicatedAuth);
      }
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  return {
    user,
    isSigningIn,
    signInError,
    handleSignIn,
    handleSignOut,
    bridge
  };
}
