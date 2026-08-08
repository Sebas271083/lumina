import { useState } from 'react';
import api from '../services/api';
import { Mail, MapPin, Phone } from '../components/Icons';

const initialForm = { name: '', surname: '', email: '', phone: '', message: '' };

export default function Contacto() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/leads', form);
      setStatus('sent');
      setForm(initialForm);
    } catch (err) {
      setStatus('idle');
      setError(err.response?.data?.message || 'No se pudo enviar la consulta. Intenta nuevamente.');
    }
  }

  return (
    <div className="section contact-section">
      <div className="contact-info">
        <span className="section-eyebrow">Hablemos</span>
        <h1>Contacto</h1>
        <p>
          Contanos que estas buscando y un asesor de Lumina Office te va a responder a la brevedad.
        </p>

        <div className="info-list">
          <div className="info-item">
            <span className="info-item-icon">
              <MapPin size={20} />
            </span>
            <div>
              <div className="info-item-label">Direccion</div>
              <div className="info-item-value">Av. Colectora Panamericana Oeste 1804, Torre B, Piso 3, Villa Adelina</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-item-icon">
              <Mail size={20} />
            </span>
            <div>
              <div className="info-item-label">Email</div>
              <a className="info-item-value" href="mailto:Info@luminaoffice.com.ar">Info@luminaoffice.com.ar</a>
            </div>
          </div>
          <div className="info-item">
            <span className="info-item-icon">
              <Phone size={20} />
            </span>
            <div>
              <div className="info-item-label">Telefono</div>
              <a className="info-item-value" href="tel:+541147083253">+54 11 4708 3253</a>
            </div>
          </div>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Dejanos tu consulta</h2>

        {status === 'sent' ? (
          <p className="form-success">Gracias, tu consulta fue enviada correctamente.</p>
        ) : (
          <>
            <div className="form-row">
              <div className="field">
                <input
                  id="name"
                  name="name"
                  placeholder=" "
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="name">Nombre</label>
              </div>
              <div className="field">
                <input
                  id="surname"
                  name="surname"
                  placeholder=" "
                  value={form.surname}
                  onChange={handleChange}
                />
                <label htmlFor="surname">Apellido</label>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="field">
                <input
                  id="phone"
                  name="phone"
                  placeholder=" "
                  value={form.phone}
                  onChange={handleChange}
                />
                <label htmlFor="phone">Telefono</label>
              </div>
            </div>
            <div className="field">
              <textarea
                id="message"
                name="message"
                placeholder=" "
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
              <label htmlFor="message">Mensaje</label>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
