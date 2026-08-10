import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import usePageMeta from '../hooks/usePageMeta';
import MapEmbed from '../components/MapEmbed';
import { Mail, MapPin, Phone } from '../components/Icons';

const initialForm = { name: '', surname: '', email: '', phone: '', message: '' };
const OFFICE_ADDRESS = 'Av. Colectora Panamericana Oeste 1804, Torre B, Piso 3, Villa Adelina, Provincia de Buenos Aires, Argentina';

export default function Contacto() {
  usePageMeta(
    'Contacto',
    'Contactate con Lumina Office para consultar por nuestros edificios de oficinas categoría AAA.'
  );

  const [searchParams] = useSearchParams();
  const edificio = searchParams.get('edificio');

  const [form, setForm] = useState(() =>
    edificio
      ? { ...initialForm, message: `Quisiera recibir más información sobre el edificio ${edificio}.` }
      : initialForm
  );
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  function validate(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Ingresá tu nombre.';
    if (!values.email.trim()) {
      errors.email = 'Ingresá tu email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = 'Ingresá un email válido.';
    }
    if (values.phone.trim() && !/^[0-9+()\s-]{6,}$/.test(values.phone.trim())) {
      errors.phone = 'Ingresá un teléfono válido.';
    }
    if (!values.message.trim()) errors.message = 'Contanos brevemente tu consulta.';
    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('sending');
    setError('');
    try {
      await api.post('/leads', form);
      setStatus('sent');
      setForm(initialForm);
      setFieldErrors({});
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
          Contanos qué estás buscando y un asesor de Lumina Office te va a responder a la brevedad.
        </p>

        <div className="info-list">
          <div className="info-item">
            <span className="info-item-icon">
              <MapPin size={20} />
            </span>
            <div>
              <div className="info-item-label">Dirección</div>
              <div className="info-item-value">{OFFICE_ADDRESS}</div>
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
              <div className="info-item-label">Teléfono</div>
              <a className="info-item-value" href="tel:+541147083253">+54 11 4708 3253</a>
            </div>
          </div>
        </div>

        <MapEmbed address={OFFICE_ADDRESS} title="Ubicación de Lumina Office" />
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
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
                  aria-invalid={fieldErrors.name ? 'true' : undefined}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  required
                />
                <label htmlFor="name">Nombre</label>
                {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
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
                  aria-invalid={fieldErrors.email ? 'true' : undefined}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  required
                />
                <label htmlFor="email">Email</label>
                {fieldErrors.email && <span id="email-error" className="field-error">{fieldErrors.email}</span>}
              </div>
              <div className="field">
                <input
                  id="phone"
                  name="phone"
                  placeholder=" "
                  value={form.phone}
                  onChange={handleChange}
                  aria-invalid={fieldErrors.phone ? 'true' : undefined}
                  aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                />
                <label htmlFor="phone">Teléfono</label>
                {fieldErrors.phone && <span id="phone-error" className="field-error">{fieldErrors.phone}</span>}
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
                aria-invalid={fieldErrors.message ? 'true' : undefined}
                aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                required
              />
              <label htmlFor="message">Mensaje</label>
              {fieldErrors.message && <span id="message-error" className="field-error">{fieldErrors.message}</span>}
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
