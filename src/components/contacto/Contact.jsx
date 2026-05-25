import { useState, useEffect, useRef } from 'react';
import { Send, User, Mail, MessageSquare, Instagram } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(false);
  const [visible, setVisible] = useState({ header: false, card: false });

  const headerRef = useRef(null);
  const cardRef   = useRef(null);

  const contactConfig = {
    whatsapp: '+52 6271745436',
    email: 'ventas@geckcodex.com',
    instagram: 'https://www.instagram.com/geckcodex/',
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisible(prev => ({ ...prev, [e.target.dataset.reveal]: true }));
        });
      },
      { threshold: 0.1, rootMargin: '-40px 0px -40px 0px' }
    );
    [headerRef, cardRef].forEach(r => { if (r.current) obs.observe(r.current); });
    return () => obs.disconnect();
  }, []);

  const handleWhatsApp = () => {
    const msg = t.contact.waMsg(formData.name);
    window.open(`https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleGmail = () => {
    const body = `${t.contact.name}: ${formData.name}\nEmail: ${formData.email}\n\n${t.contact.msg}:\n${formData.message}`;
    window.open(`https://mail.google.com/mail/?view=cm&to=${contactConfig.email}&su=${encodeURIComponent(t.contact.emailSubject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'TU_ACCESS_KEY_AQUI',
          subject: 'Nuevo contacto desde geckcodex.com',
          from_name: 'Geck Codex Web',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => { setFormData({ name: '', email: '', message: '' }); setSubmitted(false); }, 4000);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .ct-root {
          position: relative;
          width: 100%;
          background: #1e1e1c;
          padding: 8rem 2rem;
          overflow: hidden;
          font-family: inherit;
        }

        /* respira suave — igual que ProcessTimeline */
        .ct-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.05), transparent);
          animation: ctBreathe 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ctBreathe {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.08); }
        }

        .ct-wrap {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        /* ── HEADER ── */
        .ct-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1);
        }
        .ct-header.ct-in {
          opacity: 1; transform: translateY(0);
        }

        .ct-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1.1rem;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.28);
          border-radius: 50px;
          color: #D4AF37;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          animation: badgePulse 3s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.3); }
          50%      { box-shadow: 0 0 18px 4px rgba(212,175,55,0.12); }
        }

        .ct-h1 {
          font-size: 4.2rem;
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.025em;
          margin: 0;
          color: #F4E4BC;
        }
        .ct-h1 span {
          color: #D4AF37;
        }

        .ct-desc {
          font-size: 1rem;
          color: rgba(212,175,55,0.4);
          margin: 0;
          max-width: 480px;
          line-height: 1.7;
          letter-spacing: 0.03em;
        }

        /* ── CARD principal ── */
        .ct-card {
          border-radius: 32px;
          border: 1px solid rgba(212,175,55,0.18);
          background: #242422;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          box-shadow:
            inset 0 1px 0 rgba(212,175,55,0.08),
            0 48px 100px rgba(0,0,0,0.55);

          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1) 0.15s, transform 0.8s cubic-bezier(0.23,1,0.32,1) 0.15s;
        }
        .ct-card.ct-in {
          opacity: 1; transform: translateY(0);
        }

        /* divisor vertical dorado */
        .ct-divider {
          background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.2) 20%, rgba(212,175,55,0.2) 80%, transparent);
        }

        /* ── PANEL COMPARTIDO ── */
        .ct-left, .ct-right {
          padding: 52px 48px;
        }

        /* ── LEFT ── */
        .ct-left {
          display: flex;
          flex-direction: column;
        }

        .ct-eyebrow {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ct-eyebrow::before {
          content: ''; width: 26px; height: 1px;
          background: #D4AF37; display: block; flex-shrink: 0;
        }

        .ct-left-title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin: 0 0 10px;
          color: #D4AF37;
        }

        .ct-left-sub {
          font-size: 0.8rem;
          color: rgba(212,175,55,0.35);
          margin: 0 0 44px;
          letter-spacing: 0.04em;
        }

        .ct-methods {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: auto;
        }

        .ct-method {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 16px;
          background: rgba(212,175,55,0.03);
          border: 1px solid rgba(212,175,55,0.1);
          border-radius: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.28s cubic-bezier(0.23,1,0.32,1);
          position: relative;
          overflow: hidden;
        }
        .ct-method::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0; width: 3px;
          background: #D4AF37;
          transform: scaleY(0);
          transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
          transform-origin: center;
        }
        .ct-method:hover {
          border-color: rgba(212,175,55,0.28);
          transform: translateX(6px);
          background: rgba(212,175,55,0.06);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .ct-method:hover::after { transform: scaleY(1); }

        .ct-icon {
          width: 42px; height: 42px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.28s ease;
        }
        .ct-icon.wa { background: rgba(16,185,129,0.12); }
        .ct-icon.gm { background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.14); }
        .ct-icon.ig { background: rgba(193,53,132,0.12); }
        .ct-method:hover .ct-icon.wa { background: rgba(16,185,129,0.2); box-shadow: 0 0 16px rgba(16,185,129,0.2); }
        .ct-method:hover .ct-icon.gm { background: rgba(212,175,55,0.18); box-shadow: 0 0 16px rgba(212,175,55,0.15); }
        .ct-method:hover .ct-icon.ig { background: rgba(193,53,132,0.2); box-shadow: 0 0 16px rgba(193,53,132,0.2); }

        .ct-mlabel   { font-size: 0.9rem; font-weight: 600; color: #F4E4BC; display: block; }
        .ct-msub     { font-size: 0.7rem; color: rgba(212,175,55,0.32); display: block; margin-top: 2px; }

        .ct-marrow {
          margin-left: auto; font-size: 1rem;
          color: rgba(212,175,55,0.18);
          transition: all 0.25s ease; flex-shrink: 0;
        }
        .ct-method:hover .ct-marrow { color: #D4AF37; transform: translateX(4px); }

        .ct-avail {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid rgba(212,175,55,0.08);
          display: flex; align-items: center; gap: 8px;
          font-size: 0.7rem;
          color: rgba(212,175,55,0.32);
          letter-spacing: 0.06em;
        }
        .ct-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #10b981; flex-shrink: 0;
          box-shadow: 0 0 8px rgba(16,185,129,0.7);
          animation: dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%,100% { box-shadow: 0 0 6px rgba(16,185,129,0.7); }
          50%      { box-shadow: 0 0 16px rgba(16,185,129,1); }
        }

        /* ── RIGHT / FORM ── */
        .ct-right {
          background: #272725;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .ct-flabel {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.38);
          margin-bottom: 32px;
          display: flex; align-items: center; gap: 12px;
        }
        .ct-flabel::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(212,175,55,0.1);
        }

        .ct-field { margin-bottom: 18px; }

        .ct-field-label {
          display: block;
          font-size: 0.64rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(212,175,55,0.42);
          margin-bottom: 7px;
          transition: color 0.2s;
        }
        .ct-field:focus-within .ct-field-label { color: #D4AF37; }

        .ct-iw { position: relative; }

        .ct-ii {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          color: rgba(212,175,55,0.2);
          pointer-events: none; transition: color 0.2s;
        }
        .ct-txi { top: 15px; transform: none; }
        .ct-field:focus-within .ct-ii { color: #D4AF37; }

        .ct-input, .ct-ta {
          width: 100%;
          background: #222220;
          border: 1px solid rgba(212,175,55,0.12);
          border-radius: 11px;
          color: #F4E4BC;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          padding: 13px 14px 13px 42px;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
        }
        .ct-input:focus, .ct-ta:focus {
          border-color: #D4AF37;
          background: #252523;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
        }
        .ct-input::placeholder, .ct-ta::placeholder {
          color: rgba(212,175,55,0.17);
        }
        .ct-ta {
          resize: vertical; min-height: 130px;
          line-height: 1.7; padding-top: 13px;
        }
        .ct-char {
          position: absolute; bottom: 10px; right: 12px;
          font-size: 0.62rem; color: rgba(212,175,55,0.16);
          pointer-events: none;
        }

        .ct-row {
          display: flex; align-items: center;
          gap: 14px; margin-top: 8px;
        }

        .ct-btn {
          flex: 1; padding: 15px 24px;
          background: #D4AF37;
          border: none; border-radius: 11px;
          color: #0B1D33;
          font-family: inherit; font-size: 0.82rem;
          font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: all 0.28s cubic-bezier(0.23,1,0.32,1);
          box-shadow: 0 4px 24px rgba(212,175,55,0.35);
          position: relative; overflow: hidden;
        }
        .ct-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(212,175,55,0.5); background: #e8c84a; }
        .ct-btn:active { transform: translateY(0); }

        .ct-hint {
          font-size: 0.66rem; color: rgba(212,175,55,0.2);
          text-align: right; line-height: 1.6; flex-shrink: 0;
        }
        .ct-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
        .ct-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(11,29,51,0.3);
          border-top-color: #0B1D33;
          animation: ct-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes ct-spin { to { transform: rotate(360deg); } }
        .ct-error {
          font-size: 0.72rem; color: #f87171;
          margin-top: 8px; text-align: center;
        }

        /* ── SUCCESS ── */
        .ct-success {
          position: absolute; inset: 0;
          background: #272725;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 20;
          animation: ctIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes ctIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }

        .ct-sring {
          width: 88px; height: 88px; border-radius: 50%;
          border: 2px solid rgba(212,175,55,0.45);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; position: relative;
          animation: ctRingIn 0.55s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes ctRingIn {
          from { transform: scale(0) rotate(-90deg); opacity: 0; }
          to   { transform: scale(1) rotate(0); opacity: 1; }
        }
        .ct-sring::before, .ct-sring::after {
          content: ''; position: absolute; inset: -14px;
          border: 1.5px solid #D4AF37;
          border-radius: 50%; opacity: 0;
          animation: ctRingExp 2.2s ease-out infinite;
        }
        .ct-sring::after { animation-delay: 0.6s; }
        @keyframes ctRingExp {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .ct-check { color: #D4AF37; animation: ctPop 0.35s 0.5s both; }
        @keyframes ctPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .ct-stitle {
          font-size: 2.2rem; font-weight: 900;
          color: #D4AF37;
          margin: 0 0 8px;
          animation: ctUp 0.4s 0.6s both;
        }
        .ct-ssub {
          font-size: 0.75rem; color: rgba(212,175,55,0.32);
          letter-spacing: 0.12em;
          animation: ctUp 0.4s 0.7s both;
        }
        @keyframes ctUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          /* Card pasa a una sola columna */
          .ct-card {
            grid-template-columns: 1fr;
          }

          /* El divisor vertical se convierte en horizontal */
          .ct-divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(212,175,55,0.2) 20%, rgba(212,175,55,0.2) 80%, transparent);
          }

          .ct-left { padding: 40px 32px 36px; }
          .ct-right { padding: 36px 32px 40px; }

          .ct-left-title { font-size: 2.2rem; }

          /* En móvil los botones de contacto en grid 2 columnas
             para aprovechar el espacio horizontal */
          .ct-methods {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          /* Cada método se adapta a layout vertical */
          .ct-method {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding: 16px 14px;
          }

          /* Ocultar flecha en móvil — no hay hover */
          .ct-marrow { display: none; }

          /* La línea dorada pasa a ser superior */
          .ct-method::after {
            left: 0; right: 0; top: 0; bottom: auto;
            width: 100%; height: 3px;
            transform: scaleX(0);
            transform-origin: left;
          }
          .ct-method:hover::after { transform: scaleX(1); }
          .ct-method:hover { transform: translateX(0) translateY(-3px); }

          .ct-mlabel { font-size: 0.82rem; }
          .ct-msub   { font-size: 0.66rem; }

          /* Disponibilidad ocupa la fila completa */
          .ct-avail {
            grid-column: 1 / -1;
            margin-top: 20px;
          }
        }

        @media (max-width: 600px) {
          .ct-root { padding: 5rem 1rem; }

          .ct-h1 { font-size: 2.4rem; }
          .ct-desc { font-size: 0.9rem; }

          .ct-left  { padding: 32px 20px 28px; }
          .ct-right { padding: 28px 20px 32px; }

          .ct-left-title { font-size: 1.9rem; }

          /* En pantallas muy pequeñas volvemos a una columna para los métodos */
          .ct-methods { grid-template-columns: 1fr; }
          .ct-method  {
            flex-direction: row;
            align-items: center;
            gap: 12px;
            padding: 13px 14px;
          }
          .ct-marrow { display: block; }
          .ct-method::after {
            left: 0; top: 0; right: auto; bottom: 0;
            width: 3px; height: auto;
            transform: scaleY(0);
            transform-origin: center;
          }
          .ct-method:hover::after { transform: scaleY(1); }
          .ct-method:hover { transform: translateX(4px) translateY(0); }
          .ct-avail { grid-column: auto; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section className="ct-root">
        <div className="ct-bg" />

        <div className="ct-wrap">

          {/* HEADER */}
          <div
            className={`ct-header ${visible.header ? 'ct-in' : ''}`}
            ref={headerRef}
            data-reveal="header"
          >
            <span className="ct-badge">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z"/>
              </svg>
              {t.contact.badge}
            </span>

            <h2 className="ct-h1">
              {t.contact.title}{' '}
              <span>{t.contact.titleSpan}</span>
            </h2>

            <p className="ct-desc">
              {t.contact.desc}
            </p>
          </div>

          {/* CARD */}
          <div
            className={`ct-card ${visible.card ? 'ct-in' : ''}`}
            ref={cardRef}
            data-reveal="card"
          >

            {/* LEFT */}
            <div className="ct-left">
              <span className="ct-eyebrow">{t.contact.eyebrow}</span>

              <h3 className="ct-left-title">
                {t.contact.chooseTitle.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h3>
              <p className="ct-left-sub">{t.contact.chooseSub}</p>

              <div className="ct-methods">
                <button className="ct-method" onClick={handleWhatsApp}>
                  <div className="ct-icon wa">
                    <svg width="18" height="18" fill="#10b981" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="ct-mlabel">WhatsApp</span>
                    <span className="ct-msub">{t.contact.waSub}</span>
                  </div>
                  <span className="ct-marrow">→</span>
                </button>

                <button className="ct-method" onClick={handleGmail}>
                  <div className="ct-icon gm">
                    <Mail width={18} height={18} color="#D4AF37" />
                  </div>
                  <div>
                    <span className="ct-mlabel">{t.contact.emailLabel}</span>
                    <span className="ct-msub">{contactConfig.email}</span>
                  </div>
                  <span className="ct-marrow">→</span>
                </button>

                <a className="ct-method" href={contactConfig.instagram} target="_blank" rel="noopener noreferrer">
                  <div className="ct-icon ig">
                    <Instagram width={18} height={18} color="#c13584" />
                  </div>
                  <div>
                    <span className="ct-mlabel">Instagram</span>
                    <span className="ct-msub">@geckcodex</span>
                  </div>
                  <span className="ct-marrow">→</span>
                </a>
              </div>

              <div className="ct-avail">
                <span className="ct-dot" />
                {t.contact.available}
              </div>
            </div>

            {/* DIVISOR */}
            <div className="ct-divider" />

            {/* RIGHT */}
            <div className="ct-right">
              <span className="ct-flabel">{t.contact.formLabel}</span>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', flex:1 }}>
                <div className="ct-field">
                  <label className="ct-field-label" htmlFor="ct-name">{t.contact.name}</label>
                  <div className="ct-iw">
                    <User className="ct-ii" />
                    <input id="ct-name" type="text" name="name" value={formData.name}
                      onChange={handleChange} placeholder={t.contact.namePh} required className="ct-input" />
                  </div>
                </div>

                <div className="ct-field">
                  <label className="ct-field-label" htmlFor="ct-email">Email</label>
                  <div className="ct-iw">
                    <Mail className="ct-ii" />
                    <input id="ct-email" type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder={t.contact.emailPh} required className="ct-input" />
                  </div>
                </div>

                <div className="ct-field" style={{ flex:1 }}>
                  <label className="ct-field-label" htmlFor="ct-msg">{t.contact.msg}</label>
                  <div className="ct-iw">
                    <MessageSquare className="ct-ii ct-txi" />
                    <textarea id="ct-msg" name="message" value={formData.message}
                      onChange={handleChange} placeholder={t.contact.msgPh}
                      required className="ct-ta" />
                    <span className="ct-char">{formData.message.length}</span>
                  </div>
                </div>

                <div className="ct-row">
                  <button type="submit" className="ct-btn" disabled={loading}>
                    {loading
                      ? <><span className="ct-spinner" />{t.contact.sending}</>
                      : <><Send width={14} height={14} />{t.contact.send}</>
                    }
                  </button>
                  <p className="ct-hint">{t.contact.noSpam.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
                </div>
                {error && (
                  <p className="ct-error">{t.contact.error}</p>
                )}
              </form>

              {submitted && (
                <div className="ct-success">
                  <div className="ct-sring">
                    <svg className="ct-check" width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="ct-stitle">{t.contact.successTitle}</h3>
                  <p className="ct-ssub">{t.contact.successSub}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}