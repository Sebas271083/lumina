import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from './Icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">LUMINA OFFICE</div>
          <p>Edificios de oficinas categoria AAA en el corredor norte del Gran Buenos Aires.</p>
        </div>

        <div className="footer-col">
          <h4>Navegacion</h4>
          <Link to="/institucional">Institucional</Link>
          <Link to="/edificios">Edificios</Link>
          <Link to="/sustentabilidad">Sustentabilidad</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p className="footer-contact-item">
            <MapPin size={17} />
            <span>Av. Colectora Panamericana Oeste 1804, Torre B, Piso 3, Villa Adelina</span>
          </p>
          <p className="footer-contact-item">
            <Mail size={17} />
            <a href="mailto:Info@luminaoffice.com.ar">Info@luminaoffice.com.ar</a>
          </p>
          <p className="footer-contact-item">
            <Phone size={17} />
            <a href="tel:+541147083253">+54 11 4708 3253</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Lumina Office. Todos los derechos reservados.
      </div>
    </footer>
  );
}
