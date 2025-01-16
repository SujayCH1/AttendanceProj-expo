import { useContext, useState } from "react";
import { supabase } from "../utils/supabase";

let currentUUID: string | null = null

export const fetchSessionData = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error.message);
      return null;
    }

    if (session) {
      const userID = session.user.id;
      currentUUID = userID //for dynamically fetching
      // currentUUID = '33333333-3333-3333-3333-333333333333' // for student temp
      // currentUUID = '22222222-2222-2222-2222-222222222222' // for teacher temp
      console.log('current uuid, updated from fetchSessionData: ', currentUUID)
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

export const fetchStudentInfo = async () => {
  try {
    // Fetch student information based on UUID
    const { data, error } = await supabase
      .from("student_info")
      .select("*")
      .eq("user_id", currentUUID);


    if (error) {
      console.error("Error fetching student info:", error.message);
      return null;
    }

    if (data && data.length > 0) {
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
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("user_id", currentUUID)

    if (error) {
      console.log("Error fetching teacher info:", error.message)
    }

    if (data && data.length > 0) {
      return data[0];
    } else {
      console.log("No student info found for the given UUID");
      return null;
    }
  } catch (err) {
    console.error("Unexcpected error: ", err)
    return null
  }
};

export const getFacultyIdsInSV = async (studentInfo: any) => {
  try {
    const { data: facultyUUIDs, error } = await supabase
      .from('sem_info')
      .select('faculty:faculty_id(user_id)')
      .eq('semester', studentInfo['semester'])
      .eq('branch', studentInfo['branch'])
      .eq('division', studentInfo['division'])
      .eq('batch', studentInfo['batch']);

    if (error) {
      throw new Error(`Error fetching faculty UUIDs: ${error.message}`);
    }

    if (!facultyUUIDs || facultyUUIDs.length === 0) {
      throw new Error('No faculty UUIDs found for the given student info');
    }

    // Extract all user_ids from the nested faculty objects
    const facultyUserIds = facultyUUIDs.map((record) => record.faculty?.user_id).filter(Boolean);

    return facultyUserIds;
  } catch (error) {
    console.error('Error in getFacultyIdsInSV:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
};

