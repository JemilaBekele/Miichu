import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter, useNavigation } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";

const locations = ["Hayat", "Megenaga", "Bole", "Bulbula", "Aratkilo"];
const sexOptions = ["Male", "Female"];
const getRouteDescription = (start: string, end: string): string => {
  if (!start || !end) return "Please select both start and end locations.";

  if (start === "Hayat" && end === "Megenaga") return "Travel: Hayat → Megenag. You can also travel from Megenag → Hayat.";
  if (start === "Megenaga" && end === "Hayat") return "Travel: Megenag → Hayat. You can also travel from Hayat → Megenag.";

  if (start === "Hayat" && end === "Bole")
    return "No direct route available. Travel: Hayat → Megenaga and Megenaga → Bole. You can also travel from Bole → Megenaga and Megenaga → Hayat.";

  if (start === "Bole" && end === "Megenaga") return "Direct route available.";
  if (start === "Megenaga" && end === "Bole") return "Direct route available.";
  if (start === "Bole" && end === "Bulbula")
    return "Travel: Bole → Megenaga → Bulbula. You can also travel from Bulbula → Megenaga → Bole.";
  if (start === "Bulbula" && end === "Bole")
    return "No direct route available. Travel via Megenaga: Bulbula → Megenaga → Bole.";
  if (start === "Megenaga" && end === "Aratkilo") return "Direct route available.";
  if (start === "Aratkilo" && end === "Megenaga") return "Direct route available.";

  return "Route not supported.";
};

export interface RegisterFormValues {
  fullName: string;
  phoneNumber: string;
  sex: string;
  password: string;
  confirmPassword: string;
  workplaceId?: string;
  organization?: string;
  locationStart: string;
  locationEnd: string;
  fiydaIdImage?: string;
  fiydaIdImageback?: string;
}

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().min(3, "Too Short!").required("Required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Required"),
  sex: Yup.string().oneOf(sexOptions, "Invalid sex").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
  locationStart: Yup.string().oneOf(locations, "Invalid location").required("Required"),
  locationEnd: Yup.string().oneOf(locations, "Invalid location").required("Required"),
  workplaceId: Yup.string(),
  organization: Yup.string(),
  fiydaIdImage: Yup.string().required("Front image is required"),
  fiydaIdImageback: Yup.string().required("Back image is required"),
});

const Register = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigation = useNavigation();
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("http://192.168.68.6:5000/api/mobile/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, [navigation]);
  const pickImage = async (setFieldValue: any, field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setFieldValue(field, uri);
    }
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    const formData = new FormData();

    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("sex", values.sex);
    formData.append("password", values.password);
    formData.append("locationStart", values.locationStart);
    formData.append("locationEnd", values.locationEnd);

    if (values.workplaceId) {
      formData.append("workplaceId", values.workplaceId);
    }

    if (values.organization) {
      formData.append("organization", values.organization);
    }

    if (values.fiydaIdImage) {
      formData.append("fiydaIdImage", {
        uri: values.fiydaIdImage,
        type: "image/jpeg",
        name: "fiydaIdImage.jpg",
      } as any);
    }

    if (values.fiydaIdImageback) {
      formData.append("fiydaIdImageback", {
        uri: values.fiydaIdImageback,
        type: "image/jpeg",
        name: "fiydaIdImageback.jpg",
      } as any);
    }

    try {
      await mutation.mutateAsync(formData);
      setMessage("Registration successful!");
      setMessageType("success");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("Something went wrong.");
      setMessageType("error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      {message ? (
        <Text style={messageType === "success" ? styles.successText : styles.errorText}>
          {message}
        </Text>
      ) : null}

      <Formik
        initialValues={{
          fullName: "",
          phoneNumber: "",
          sex: "",
          password: "",
          confirmPassword: "",
          locationStart: "",
          locationEnd: "",
          fiydaIdImage: "",
          fiydaIdImageback: "",
          workplaceId: "",
          organization: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.form}>
          {/* Full Name */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            onChangeText={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            value={values.fullName}
          />
          {errors.fullName && touched.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
        
          {/* Phone Number */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            value={values.phoneNumber}
          />
          {errors.phoneNumber && touched.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        
          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {errors.password && touched.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        
          {/* Confirm Password */}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            value={values.confirmPassword}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        
          {/* Sex */}
          <Picker
            selectedValue={values.sex}
            onValueChange={(itemValue) => setFieldValue("sex", itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Sex" value="" />
            {sexOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          {errors.sex && touched.sex && <Text style={styles.errorText}>{errors.sex}</Text>}
        
          {/* Location Start */}
          <Picker
            selectedValue={values.locationStart}
            onValueChange={(itemValue) => setFieldValue("locationStart", itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Start Location" value="" />
            {locations.map((location) => (
              <Picker.Item key={location} label={location} value={location} />
            ))}
          </Picker>
          {errors.locationStart && touched.locationStart && (
            <Text style={styles.errorText}>{errors.locationStart}</Text>
          )}
        
          {/* Location End */}
          <Picker
            selectedValue={values.locationEnd}
            onValueChange={(itemValue) => setFieldValue("locationEnd", itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="End Location" value="" />
            {locations.map((location) => (
              <Picker.Item key={location} label={location} value={location} />
            ))}
          </Picker>
          {errors.locationEnd && touched.locationEnd && (
            <Text style={styles.errorText}>{errors.locationEnd}</Text>
          )}
        
         {/* Display Route Description */}
         <Text style={styles.routeDescription}>
              {getRouteDescription(values.locationStart, values.locationEnd)}
            </Text>

          {/* Workplace ID */}
          <TextInput
            style={styles.input}
            placeholder="Workplace ID"
            onChangeText={handleChange("workplaceId")}
            onBlur={handleBlur("workplaceId")}
            value={values.workplaceId}
          />
          {errors.workplaceId && touched.workplaceId && (
            <Text style={styles.errorText}>{errors.workplaceId}</Text>
          )}
        
          {/* Organization */}
          <TextInput
            style={styles.input}
            placeholder="Organization"
            onChangeText={handleChange("organization")}
            onBlur={handleBlur("organization")}
            value={values.organization}
          />
          {errors.organization && touched.organization && (
            <Text style={styles.errorText}>{errors.organization}</Text>
          )}
        
          {/* Fiyda ID Front Image */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage(setFieldValue, "fiydaIdImage")}
          >
            <Text style={styles.imageButtonText}>Upload Fiyda ID Front Image</Text>
          </TouchableOpacity>
          {values.fiydaIdImage && (
            <Image source={{ uri: values.fiydaIdImage }} style={styles.imagePreview} />
          )}
          {errors.fiydaIdImage && touched.fiydaIdImage && (
            <Text style={styles.errorText}>{errors.fiydaIdImage}</Text>
          )}
        
          {/* Fiyda ID Back Image */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage(setFieldValue, "fiydaIdImageback")}
          >
            <Text style={styles.imageButtonText}>Upload Fiyda ID Back Image</Text>
          </TouchableOpacity>
          {values.fiydaIdImageback && (
            <Image source={{ uri: values.fiydaIdImageback }} style={styles.imagePreview} />
          )}
          {errors.fiydaIdImageback && touched.fiydaIdImageback && (
            <Text style={styles.errorText}>{errors.fiydaIdImageback}</Text>
          )}
        
          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit as any}
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
        
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginBottom: 16,
  },
  routeDescription: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    marginBottom:10,
    textAlign: "center",
    borderWidth: 1, // Adds border thickness
    borderColor: "#ccc", // Sets border color
    borderRadius: 8, // Rounds the corners of the border
    padding: 10, // Adds padding inside the border
    backgroundColor: "#f9f9f9", // Optional: Adds a light background color
  },
  
  button: {
    height: 50,
    backgroundColor: "#ECA4E6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
  successText: {
    color: "green",
    marginBottom: 16,
  },
  imageButton: {
    height: 50,
    backgroundColor: "#ffff",
    borderWidth: 1, // Adds border thickness
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  imageButtonText: {
    color: "#000808",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 8,
  },
});


export default Register;
