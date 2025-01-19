import { useContext, useState } from "react";
import { supabase } from "../utils/supabase";

let currentUUID: string | null = null


//login 
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

// studunt view
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

// teacher view
export const fetchFacultyInfo = async () => {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select("*, user_id") // Make sure to select user_id
      .eq("user_id", currentUUID)
      .single();

    if (error) {
      console.log("Error fetching teacher info:", error.message);
      return null;
    }

    if (data) {
      return {
        ...data,
        user_id: data.user_id // Ensure user_id is included
      };
    } else {
      console.log("No faculty info found for the given UUID");
      return null;
    }
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
};

// student view
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


//teacher view 
export const getCourseLectures = async (facultyUUID) => {
  try {
    // Fetch sem_id and student user_ids in a single query using a join
    const { data, error } = await supabase
      .from("sem_info")
      .select(`
        sem_id,
        student_info(user_id)
      `)
      .eq("faculty_id", facultyUUID);

    if (error) {
      throw new Error(`Error fetching course lectures: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("No data found for the given faculty UUID");
    }

    // Extract sem_ids and student user_ids from the result
    const semIDs = data.map((record) => record.sem_id);
    const studentList = data
      .flatMap((record) => record.student_info || [])
      .map((student) => student.user_id);

    return { semIDs, studentList };
  } catch (error) {
    console.error("Error in getCourseLectures:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};

export const getTeacherSubjects = async (facultyId) => {
  try {
    const { data, error } = await supabase
      .from('sem_info')
      .select(`
        *,
        subject:subject_id (
          subject_id,
          subject_name
        )
      `)
      .eq('faculty_id', facultyId);

    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      subject_id: item.subject.subject_id,
      subject_name: item.subject.subject_name
    }));
  } catch (err) {
    console.error("Error fetching teacher subjects:", err);
    return [];
  }
};

export const getActiveSessionsForStudent = async (studentInfo) => {
  try {
    const { data, error } = await supabase
      .from('active_sessions')
      .select(`
        *,
        subject:subject_id (subject_name)
      `)
      .eq('semester', studentInfo.semester)
      .eq('branch', studentInfo.branch)
      .eq('division', studentInfo.division)
      .eq('batch', studentInfo.batch)
      .is('end_time', null);

    if (error) throw error;

    console.log("active session data fetched: ", data)

    return data;
  } catch (err) {
    console.error("Error fetching active sessions:", err);
    return [];
  }
};

export const insertStudentUUIDinActiveSessions = async (
  faculty_uuid : string, // Faculty UUID
  student_uuid : string// Student UUID
) => {
  try {
    // Check if the faculty_uuid exists in the table
    const { data: existingData, error: selectError } = await supabase
      .from('active_sessions')
      .select('student_user_id_array')
      .eq('faculty_user_id', faculty_uuid);

    if (selectError) throw selectError;

    if (existingData.length > 0) {
      // Faculty UUID exists, append the student_uuid to the array
      const { error: updateError } = await supabase
        .from('active_sessions')
        .update({
          student_user_id_array: supabase.rpc('array_append', {
            array: existingData[0].student_user_id_array,
            value: student_uuid,
          }),
        })
        .eq('faculty_user_id', faculty_uuid);

      if (updateError) throw updateError;
    } else {
      // Faculty UUID doesn't exist, insert a new row with the student_uuid in an array
      const { error: insertError } = await supabase
        .from('active_sessions')
        .insert({
          faculty_user_id: faculty_uuid,
          student_user_id_array: [student_uuid], // Initialize with the student UUID in an array
        });

      if (insertError) throw insertError;
    }

    console.log('Operation successful');
  } catch (error) {
    console.error('Error Inserting/Updating Data:', error);
    throw error;
  }
};



