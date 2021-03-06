import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import {signup} from './signup';
import {tourForm} from './tourForm'

const mapBox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const formTour = document.querySelector('.form--tourForm');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }
  
if (loginForm)
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  
if (signupForm)
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordconfirm = document.getElementById('passwordconfirm').value;
      const role = document.getElementById('role').value;
      signup(name,email, password,passwordconfirm,role);
    });
    
if (formTour)
    formTour.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const duration = document.getElementById('duration').value;
      const maxGroupSize = document.getElementById('maxGroupSize').value;
      const difficulty = document.getElementById('difficulty').value;
      const price = document.getElementById('price').value;
      const summary = document.getElementById('summary').value;
      const description = document.getElementById('description').value;
      tourForm(name,duration, maxGroupSize,difficulty,price,summary,description);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();

   /*  const name = document.getElementById('name').value;
    const email = document.getElementById('email').value; */
     const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value); 
    form.append('photo', document.getElementById('photo').files[0]);
    
    await updateSettings(form, 'data');
    //await updateSettings({name,email},'data');

  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });