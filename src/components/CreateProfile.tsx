import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Avatar, Text } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { supabase } from "../helper/lib/supabase";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  CreateProfile: { categoryId: string };
};

type CreateProfileScreenRouteProp = RouteProp<RootStackParamList, "CreateProfile">;

const CreateProfile: React.FC = () => {
  const route = useRoute<CreateProfileScreenRouteProp>();
  const { categoryId } = route.params; // Fetching category_id

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [formData, setFormData] = useState({
    user_id: "",
    full_name: "",
    bio: "",
    profession: "",
    website_url: "",
    profile_picture_url: "",
    cover_img_url: "",
    phn_no: "",
    whatsapp_no: "",
    email: "",
    facebook_url: "",
    linkedin_url: "",
    instagram_url: "",
    lat: null as number | null,
    long: null as number | null,
    category_id: categoryId, // Store category_id in formData
  });

  useEffect(() => {
    fetchUserId();
    setStaticLocation();
  }, []);

  const fetchUserId = async () => {
    try {
      setFetchingUser(true);
      console.log("Fetching user session...");
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (!data?.session?.user) {
        throw new Error("User session not found.");
      }

      setFormData((prev) => ({ ...prev, user_id: data.session.user.id }));
    } catch (err) {
      console.error("Error fetching user:", err);
      Alert.alert("Error", "Failed to fetch user session. Please log in again.");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async (type: "profile" | "cover") => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
        return;
      }

      if (!response.assets || response.assets.length === 0) {
        Alert.alert("Error", "No image selected.");
        return;
      }

      const selectedImage = response.assets[0].uri;
      if (!selectedImage) {
        Alert.alert("Error", "Failed to get image URI.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [type === "profile" ? "profile_picture_url" : "cover_img_url"]: selectedImage,
      }));
    });
  };

  const setStaticLocation = () => {
    setFormData((prev) => ({
      ...prev,
      lat: 19.0760, // Example: Mumbai latitude
      long: 72.8777, // Example: Mumbai longitude
    }));
  };

  const handleSubmit = async () => {
    if (!formData.user_id) {
      Alert.alert("Error", "User ID is not available. Please wait.");
      return;
    }
    if (!formData.full_name || !formData.email) {
      Alert.alert("Validation Error", "Full Name and Email are required.");
      return;
    }

    setLoading(true);
    try {
      const cleanData = { ...formData };
      cleanData.lat = formData.lat ?? null;
      cleanData.long = formData.long ?? null;

      console.log("Submitting profile data:", cleanData);

      const { error } = await supabase.from("profiles").insert([cleanData]);

      if (error) throw new Error(error.message);

      Alert.alert("Success", "Profile created successfully!");
    } catch (err) {
      const error = err as Error;
      console.error("Unexpected Error:", error);
      Alert.alert("Error", `Failed to create profile: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Profile</Text>

      {fetchingUser ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <>
          <Text style={styles.userIdText}>User ID: {formData.user_id}</Text>
          <Text style={styles.userIdText}>Category ID: {formData.category_id}</Text>
        </>
      )}

      <Avatar.Image
        size={100}
        source={
          formData.profile_picture_url
            ? { uri: formData.profile_picture_url }
            : require("../assets/icons/avatar.png")
        }
        style={styles.avatar}
      />

      <Button mode="outlined" onPress={() => pickImage("profile")}>Upload Profile Picture</Button>
      <Button mode="outlined" onPress={() => pickImage("cover")}>Upload Cover Image</Button>

      {["full_name", "email", "bio", "profession", "website_url", "phn_no", "whatsapp_no", "facebook_url", "linkedin_url", "instagram_url"].map((field) => (
        <TextInput
          key={field}
          label={field.replace(/_/g, " ").toUpperCase()}
          value={formData[field as keyof typeof formData] as string}
          onChangeText={(value) => handleChange(field as keyof typeof formData, value)}
          style={styles.input}
          mode="outlined"
        />
      ))}

      <Button mode="contained" onPress={setStaticLocation} style={styles.locationButton}>Set Static Location</Button>
      <Text style={styles.locationText}>Latitude: {formData.lat ?? "Fetching..."} | Longitude: {formData.long ?? "Fetching..."}</Text>

      <Button mode="contained" onPress={handleSubmit} disabled={loading || fetchingUser} style={styles.submitButton}>{loading ? <ActivityIndicator color="#fff" /> : "Create Profile"}</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  userIdText: { fontSize: 16, color: "#6200EE", marginVertical: 10 },
  avatar: { marginBottom: 10 },
  input: { width: "100%", marginBottom: 10 },
  locationButton: { marginTop: 10, width: "100%" },
  locationText: { fontSize: 14, marginVertical: 10, color: "#555" },
  submitButton: { marginTop: 10, width: "100%" },
});

export default CreateProfile;
