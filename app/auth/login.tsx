import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter, useNavigation } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/api";

interface LoginData {
  phoneNumber: string;
  password: string;
}

// Import the image
const loginImage = require('@/assets/images/loginn.jpg'); // Adjust the path if needed

const LoginSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

export default function Login() {
  const router = useRouter();
  const navigation = useNavigation();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Login mutation using React Query with explicit types
  const mutation = useMutation<any, Error, LoginData>({
    mutationFn: loginUser,
    onSuccess: () => {
      setMessage("Login successful!");
      setMessageType("success");
      router.push("/(tabs)");
    },
    onError: (error: Error) => {
      const errorMessage =
        "Invalid phone number or password. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Image above the title */}
      <Image source={loginImage} style={styles.image} />

      <Text style={styles.title}>Login</Text>
      
      {/* Display login error message if present */}
      {message ? (
        <Text style={messageType === "error" ? styles.errorText : styles.successText}>
          {message}
        </Text>
      ) : null}

      <Formik
        initialValues={{ phoneNumber: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          setMessage(""); // Clear previous messages
          mutation.mutate(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && touched.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              disabled={mutation.status === "pending"}
            >
              {mutation.status === "pending" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      {/* Sign Up Navigation */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.signupButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  image: {
    width: 600, // Adjust width
    height: 250, // Adjust height
    resizeMode: "contain",
    marginBottom: 20,
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
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 16,
    textAlign: "center",
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
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: "#333",
  },
  signupButton: {
    fontSize: 16,
    color: "#6200ea",
    fontWeight: "bold",
    marginLeft: 4,
  },
});
