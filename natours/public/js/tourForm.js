import axios from 'axios';
import { showAlert } from './alert';

export const tourForm = async (name,duration,maxGroupSize,difficulty,price,summary,description) => {
  try {

    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/tours',
      data: {
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        summary,
        description
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Added tour!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
