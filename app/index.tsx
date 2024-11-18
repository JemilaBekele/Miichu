import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const PlaceholderImage = require('@/assets/images/micbest1.png'); // Replace with your image path

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Full-Width Top Image */}
      <ImageBackground source={PlaceholderImage} style={styles.topImage} resizeMode="cover" />

      {/* Login Section */}
      <View style={styles.loginContainer}>
      <Text style={styles.title}>Miichu</Text>
        <Text style={styles.title}>Get the Bike</Text>
        <Text style={styles.subtitle}>Affordable Rides, Endless Adventures.</Text>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity style={styles.signupButton} onPress={() => router.push("/auth/login")}>
            <Text style={styles.buttonTextSecondary}>GET Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topImage: {
    width: '100%',
    height: '80%', // Adjust the height as needed
    justifyContent: 'flex-end',
  },
  loginContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
    marginTop: -130, // This overlays the login container slightly over the image
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
 
  signupButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 19,
    color: '#fff',
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 19,
    color: '#fff',
    fontWeight: '600',
  },
});

