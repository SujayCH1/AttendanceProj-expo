import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient(
  "https://pmwcdyigjbvcwtitbyxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtd2NkeWlnamJ2Y3d0aXRieXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5ODY1OTAsImV4cCI6MjA1MTU2MjU5MH0.-fQddZ_ddi8Y3SZnLpEqX__FMo9T-Y8N4ehULS_v_8Y",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

