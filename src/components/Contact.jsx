import { useRef, useState } from 'react';
import SectionLabel from './SectionLabel.jsx';
import Icon from './Icon.jsx';
import { contactFields, limits, validateContact } from '../../shared/contactValidation.js';
import { sendContact } from '../services/contactApi.js';
import './contact.css';

const empty = { name: '', email: '', subject: '', message: '', website: '' };
const labels = { name: 'Nome', email: 'E-mail', subject: 'Assunto', message: 'Mensagem' };
export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const inputs = useRef({});
  const locked = useRef(false);
  const attempt = useRef(null);
  function change(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    if (state === 'success') { setState('idle'); setFeedback(''); }
    attempt.current = null;
    if (errors[key]) setErrors((current) => ({ ...current, [key]: validateContact({ ...values, [key]: value })[key] }));
  }
  async function submit(event) {
    event.preventDefault();
    if (locked.current) return;
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    const first = contactFields.find((key) => nextErrors[key]);
    if (first) { inputs.current[first].focus(); return; }
    locked.current = true;
    setState('sending'); setFeedback('');
    attempt.current ??= crypto.randomUUID();
    try {
      await sendContact(values, attempt.current);
      setValues(empty); attempt.current = null; setState('success');
      setFeedback('Mensagem recebida com sucesso. Obrigado pelo contato!');
    } catch (error) {
      setState('error'); setFeedback(error.message);
      if (error.fields) {
        setErrors(error.fields);
        inputs.current[contactFields.find((key) => error.fields[key])]?.focus();
      }
    } finally { locked.current = false; }
  }
  return (
    <section id="contato" tabIndex="-1" className="contact page-width section-space" aria-labelledby="contact-title">
      <SectionLabel number="04">Contato</SectionLabel>
      <div className="contact-layout">
        <div className="contact-intro">
          <h2 id="contact-title">Vamos criar<br />algo juntos<span className="title-dot">?</span></h2>
          <p>Uma ideia, um projeto ou uma conversa. Conte o que você tem em mente.</p>
          <span className="contact-note">Preencha todos os campos para começar.</span>
          <div className="contact-alternatives" aria-label="Outros canais de contato">
            <a href="mailto:arthursgarbi037@gmail.com">arthursgarbi037@gmail.com <Icon /></a>
            <a href="https://www.linkedin.com/in/arthur-sgarbi/" target="_blank" rel="noopener noreferrer">Meu perfil no LinkedIn <Icon /></a>
          </div>
          <details className="contact-privacy">
            <summary>Como seus dados são usados</summary>
            <p>Seu nome, e-mail e mensagem ficam disponíveis no painel privado do portfólio para que eu possa ler e responder ao contato. Se a notificação por e-mail estiver habilitada, uma cópia também é enviada ao meu e-mail.</p>
          </details>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate aria-busy={state === 'sending'}>
          <fieldset disabled={state === 'sending'}>
            <legend className="contact-sr">Envie sua mensagem</legend>
            <div className="contact-fields">
              {contactFields.map((key) => {
                const description = `${key === 'message' ? 'contact-counter ' : ''}${errors[key] ? `contact-${key}-error` : ''}`.trim();
                const props = {
                  id: `contact-${key}`, name: key, value: values[key], required: true,
                  maxLength: key === 'message' ? undefined : limits[key],
                  onChange: (event) => change(key, event.target.value),
                  onBlur: () => setErrors((current) => ({ ...current, [key]: validateContact(values)[key] })),
                  'aria-invalid': errors[key] ? 'true' : undefined,
                  'aria-describedby': description || undefined,
                  ref: (element) => { inputs.current[key] = element; },
                };
                return <div key={key} className={`contact-field contact-field-${key}`}>
                  <label htmlFor={props.id}>{labels[key]}</label>
                  {key === 'message' ? <textarea {...props} rows={5} /> :
                    <input {...props} type={key === 'email' ? 'email' : 'text'} autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : 'off'} />}
                  {key === 'message' && <span id="contact-counter" className="contact-counter">{values.message.length} / 1.000 caracteres</span>}
                  {errors[key] && <p className="contact-error" id={`contact-${key}-error`}>Erro: {errors[key]}</p>}
                </div>;
              })}
            </div>
            <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => change('website', event.target.value)} /></div>
            <button className="contact-submit" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Enviando…' : 'Enviar mensagem'}<Icon name="arrow-up-right" />
            </button>
          </fieldset>
          <div className={`contact-feedback contact-feedback-${state}`} role="status" aria-live="polite" aria-atomic="true">{feedback}</div>
        </form>
      </div>
    </section>
  );
}
