import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name,email, password,passwordConfirm,role) => {
  try {

    console.log(password);
    console.log(passwordConfirm);
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You signed up!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


