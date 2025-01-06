  import { useContext } from "react";
  import { supabase } from "../utils/supabase";
  import { UUIDContext } from "../context/uuidContext";

  export const fetchSessionData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
          return null;
        }

        if (session) {
          const userID = session.user.id;
          console.log('userID:', userID);
          return userID;
        } else {
          console.log('No active session');
          return null;
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        return null;
      }
  };

  export const fetchStudentInfo = async (UUID: string) => {
      try {
        // Fetch student information based on UUID
        const { data, error } = await supabase
          .from("student_info")
          .select("*")
          .eq("user_id", UUID); 
    
        if (error) {
          console.error("Error fetching student info:", error.message);
          return null;
        }
    
        if (data && data.length > 0) {
          console.log("Student data:", data[0]);
          return data[0];
        } else {
          console.log("No student info found for the given UUID");
          return null;
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        return null;
      }
  };

  export const fetchFacultyInfo = async () => {
      // Implement the faculty data fetching logic here
  };

