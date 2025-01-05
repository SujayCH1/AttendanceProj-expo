import { Button, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

// Required for web browser authentication
WebBrowser.maybeCompleteAuthSession();

// Create redirect URI with explicit scheme
const redirectTo = makeRedirectUri({
  scheme: 'myapp',
  path: 'auth/callback'
});

const createSessionFromUrl = async (url: string) => {
  try {
    // Handle both # and ? parameters
    const hasHashParams = url.includes('#');
    const hasQueryParams = url.includes('?');
    
    let params: any = {};
    if (hasHashParams) {
      const hashString = url.split('#')[1];
      params = Object.fromEntries(new URLSearchParams(hashString));
    } else if (hasQueryParams) {
      const { params: queryParams, errorCode } = QueryParams.getQueryParams(url);
      if (errorCode) throw new Error(errorCode);
      params = queryParams;
    }

    const { access_token, refresh_token } = params;

    if (!access_token) {
      console.log('No access token found in URL parameters');
      return;
    }

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    
    if (error) throw error;
    
    console.log('Session created successfully');
    return data.session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

const performOAuth = async (router: any) => {
  try {
    console.log('Starting OAuth flow with redirect URI:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error("No authorization URL returned from Supabase");

    console.log('Opening auth URL:', data.url);

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo,
      {
        showInRecents: true,
        preferEphemeralSession: true,
      }
    );

    console.log('Auth result:', result);

    if (result.type === 'success' && result.url) {
      const session = await createSessionFromUrl(result.url);
      if (session) {
        // Don't use dismissAuthSession, just navigate
        router.push('/components/TeacherView');
      }
    } else {
      console.log('Authentication was cancelled or failed:', result.type);
    }
  } catch (error) {
    console.error('OAuth error:', error);
  }
};

function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    // Handle deep linking
    const handleDeepLink = async (url: string) => {
      if (!mounted || !url) return;
      
      try {
        setIsLoading(true);
        const session = await createSessionFromUrl(url);
        if (session && mounted) {
          router.push('/components/TeacherView');
        }
      } catch (error) {
        console.error('Deep linking error:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Setup deep linking handler
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link URL:', url);
      handleDeepLink(url);
    });

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      console.log('Initial URL:', url);
      if (url) handleDeepLink(url);
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [router]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await performOAuth(router);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        onPress={handleLogin}
        title={isLoading ? "Signing in..." : "Sign in with Github"}
        disabled={isLoading}
      />
    </View>
  );
}

// Add default export
export default Login;