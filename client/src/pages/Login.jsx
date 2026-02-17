import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type:null, text:'' });

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e){
    e.preventDefault();
    setMsg({ type:null, text:'' });
    setLoading(true);

    try{
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      login(
        {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || '',
          role: 'student'
        },
        null
      );

      nav('/dashboard');

    }catch(err){
      let text = 'Error al iniciar sesión';

      if (err.code === 'auth/user-not-found')
        text = 'Usuario no registrado';
      else if (err.code === 'auth/wrong-password')
        text = 'Contraseña incorrecta';
      else if (err.code === 'auth/invalid-email')
        text = 'Correo inválido';

      setMsg({ type:'error', text });
    }finally{
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Bienvenido" subtitle="Inicia sesión para continuar">
      <form onSubmit={onSubmit} className="row" style={{gap:14}}>
        <input className="input" name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={onChange} required />
        <input className="input" name="password" type="password" placeholder="Contraseña" value={form.password} onChange={onChange} required />
        <button className="btn" disabled={loading}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</button>
        {msg.text && <div className={msg.type === 'error' ? 'error':'success'}>{msg.text}</div>}
      </form>

      <div className="footer-link">
        <span className="helper">¿No tienes cuenta? </span>
        <Link to="/signup">Regístrate</Link>
      </div>
    </AuthCard>
  );
}
