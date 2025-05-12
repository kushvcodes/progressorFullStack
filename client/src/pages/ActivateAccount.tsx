// src/pages/ActivateAccount.js
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ActivateAccount() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Activating...');

  useEffect(() => {
    axios.post('http://localhost:8080/api/v1/auth/users/activation/', {
      uid,
      token
    })
    .then(response => {
      setStatus('Account successfully activated!');
      setTimeout(() => navigate('/login'), 3000); // redirect after 3s
    })
    .catch(error => {
      setStatus('Activation failed. Invalid or expired link.');
    });
  }, [uid, token, navigate]);

  return (
    <div>
      <h2>{status}</h2>
    </div>
  );
}

export default ActivateAccount;