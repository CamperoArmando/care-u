import { useState } from 'react';
import AuthCard from '../components/AuthCard';
import { createAlert } from '../api/alerts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/alerts-red.css';

const CATS = [
  { value:'maintenance', label:'Mantenimiento' },
  { value:'safety',      label:'Seguridad' },
  { value:'cleaning',    label:'Limpieza' },
  { value:'it',          label:'TI' },
  { value:'other',       label:'Otro' },
];

export default function CreateIncident(){
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ text:'', category:'maintenance', locationLabel:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type:null, text:'' });

  const onChange = e => setForm(f=>({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e){
    e.preventDefault(); 
    setMsg({type:null,text:''}); 
    setLoading(true);

    try{
      await createAlert({
        text: form.text.trim(),
        category: form.category,
        location: { label: form.locationLabel.trim() }
      }, token);

      nav('/alert-feed');
    }catch(err){
      const text = err?.response?.data?.error || 'Error del servidor';
      setMsg({type:'error', text});
    }finally{ 
      setLoading(false); 
    }
  }

  return (
    <div className="alerts-red-bg">
      <div className="alerts-red-card">
        <AuthCard title="Reportar Alerta" subtitle="Describe, categoriza y localiza el problema">
          
          <form onSubmit={onSubmit} className="row" style={{gap:14}}>

            <textarea
              className="input"
              name="text"
              rows={4}
              placeholder="¿Qué pasó?"
              value={form.text}
              onChange={onChange}
              required
              minLength={5}
              maxLength={500}
              style={{resize:'vertical'}}
            />

            <div className="row cols-2">
              <select
                className="input"
                name="category"
                value={form.category}
                onChange={onChange}
              >
                {CATS.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                className="input"
                name="locationLabel"
                placeholder="Ubicación (p. ej., Edificio A, Lab 3)"
                value={form.locationLabel}
                onChange={onChange}
                required
              />
            </div>

            <button className="alerts-red-btn" disabled={loading}>
              {loading ? 'Enviando…' : 'Crear Alerta'}
            </button>

            {msg.text && (
              <div className={msg.type === 'error' ? 'error' : 'success'}>
                {msg.text}
              </div>
            )}
          </form>

        </AuthCard>
      </div>
    </div>
  );
}
