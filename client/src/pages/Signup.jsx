import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase'; // Asegúrate de que apunta a tu archivo firebaseConfig
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Signup() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: null, text: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: null, text: '' });
    setLoading(true);

    try {
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Actualizar nombre del usuario en Firebase
      await updateProfile(userCredential.user, { displayName: form.name });

      // Guardar en contexto local (login)
      login(
        { uid: userCredential.user.uid, email: form.email, name: form.name, role: form.role },
        null // token no es necesario manejarlo aquí con Firebase Auth
      );

      nav('/dashboard');
    } catch (err) {
      let text = 'Error del servidor';
      if (err.code === 'auth/email-already-in-use') text = 'El correo ya está registrado';
      else if (err.code === 'auth/invalid-email') text = 'Correo no válido';
      else if (err.code === 'auth/weak-password') text = 'La contraseña es muy débil';
      setMsg({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Crea tu cuenta" subtitle="Regístrate para acceder a CARE-U">
      <form onSubmit={onSubmit} className="row" style={{ gap: 14 }}>
        <input
          className="input"
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          className="input"
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Contraseña (mín. 6)"
          value={form.password}
          onChange={onChange}
          minLength={6}
          required
        />
        <div className="row cols-2">
          <select className="input" name="role" value={form.role} onChange={onChange}>
            <option value="student">Estudiante</option>
            <option value="staff">Personal</option>
            <option value="admin">Administrador</option>
          </select>
          <button className="btn" disabled={loading}>
            {loading ? 'Creando…' : 'Registrarme'}
          </button>
        </div>
        {msg.text && <div className={msg.type === 'error' ? 'error' : 'success'}>{msg.text}</div>}
      </form>
      <div className="footer-link">
        <span className="helper">¿Ya tienes cuenta? </span>
        <Link to="/login">Inicia sesión</Link>
      </div>
    </AuthCard>
  );
}
