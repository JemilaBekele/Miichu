import axios from 'axios'; // Importing axios for making HTTP requests









// Login User
interface LoginData {
  phoneNumber: string;
  password: string;
}

export const loginUser = async (user: LoginData) => {
  try {
    console.log('Sending login request to backend:', user);
    const response = await axios.post('http://192.168.68.6:5000/api/mobile/login', user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    
    throw error; // Rethrow the error so that the calling function can handle it kebena 
  }
};
