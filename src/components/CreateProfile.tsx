import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Alert,
  ScrollView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Geolocation from "@react-native-community/geolocation";
import DocumentPicker from "react-native-document-picker";
import { Picker } from "@react-native-picker/picker";

const CreateProfile = () => {
  const [formData, setFormData] = useState({
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
    lat: "",
    long: "",
  });

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  

  const pickImage = (type: "profile" | "cover") => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("Image picker error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setFormData({
          ...formData,
          [type === "profile" ? "profile_picture_url" : "cover_img_url"]: response.assets[0].uri,
        });
      }
    });
  };
  

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Allow access to your location?",
          buttonPositive: "OK",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setFormData({
              ...formData,
              lat: position.coords.latitude.toString(),
              long: position.coords.longitude.toString(),
            });
          },
          (error) => Alert.alert("Error", error.message),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert("Permission Denied", "Location access is required.");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSubmit = () => {
    console.log("Profile Data Submitted:", formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Profile</Text>
      
      <TouchableOpacity onPress={() => pickImage("profile")} style={styles.imagePicker}>
        {formData.profile_picture_url ? (
          <Image source={{ uri: formData.profile_picture_url }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Select Profile Picture</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => pickImage("cover")} style={styles.imagePicker}>
        {formData.cover_img_url ? (
          <Image source={{ uri: formData.cover_img_url }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Select Cover Image</Text>
        )}
      </TouchableOpacity>

      {([
        "full_name",
        "bio",
        "profession",
        "website_url",
        "phn_no",
        "whatsapp_no",
        "email",
        "facebook_url",
        "linkedin_url",
        "instagram_url",
        ] as (keyof typeof formData)[]).map((field) => (
        <TextInput
            key={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field]} // Now TypeScript understands field is a valid key
            onChangeText={(value) => handleChange(field, value)}
            style={styles.input}
        />
    ))}


      <TouchableOpacity onPress={getLocation} style={styles.locationButton}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>
      <Text style={styles.locationText}>{`Lat: ${formData.lat}, Long: ${formData.long}`}</Text>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Create Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  imagePicker: {
    width: 120,
    height: 120,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  imageText: {
    color: "#555",
    fontSize: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  locationButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateProfile;