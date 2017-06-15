import axios from 'axios';
import { UNAUTH_USER } from './types';

const API_URL = 'http://localhost:3090';

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

