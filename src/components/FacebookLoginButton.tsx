import React from 'react'
import { Button, Linking, Platform } from 'react-native'
import { supabase } from '../helper/lib/supabase'

export default function FacebookLoginButton() {
  const handleFacebookLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo:
          Platform.OS === 'android'
            ? 'yourapp://login-callback' // deep link for Android
            : 'yourapp://login-callback', // deep link for iOS
      },
    })

    if (error) {
      console.error('OAuth error:', error.message)
    } else if (data?.url) {
      // Open the Facebook OAuth URL in external browser
      await Linking.openURL(data.url)
    }
  }

  return <Button title="Continue with Facebook" onPress={handleFacebookLogin} />
}
