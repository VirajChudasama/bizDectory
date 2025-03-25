// src/services/authService.ts

import { supabase } from '../../helper/lib/supabase';

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};



// `additionalData` can include phone, full name, etc.
export const signUpUser = async (
    email: string,
    password: string,
    additionalData: { [key: string]: any }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData,
      },
    });
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  };