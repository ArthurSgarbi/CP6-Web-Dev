import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../components/Contact.jsx';
import { validateContact } from '../../shared/contactValidation.js';
const valid = { name: 'Visitante Teste', email: 'teste@example.com', subject: 'Projeto de teste', message: 'Esta é uma mensagem de teste com tamanho válido.' };
async function fill(user) {
  for (const [label, key] of [['Nome', 'name'], ['E-mail', 'email'], ['Assunto', 'subject'], ['Mensagem', 'message']]) await user.type(screen.getByLabelText(label, { exact: true }), valid[key]);
}
describe('Contato', () => {
  it('valida limites e formato no schema compartilhado', () => {
    expect(validateContact(valid)).toEqual({});
    expect(validateContact({ ...valid, message: 'x'.repeat(19), email: 'invalido' })).toHaveProperty('email');
    expect(validateContact({ ...valid, message: 'x'.repeat(19) })).toHaveProperty('message', 'A mensagem deve ter no mínimo 20 caracteres');
    expect(validateContact({ ...valid, message: 'x'.repeat(1001) })).toHaveProperty('message', 'A mensagem deve ter no máximo 1.000 caracteres');
  });
  it('valida blur, associa erro e foca primeiro campo inválido sem enviar', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup(); render(<Contact />);
    await user.click(screen.getByLabelText('Nome', { exact: true })); await user.tab();
    expect(screen.getByLabelText('Nome', { exact: true })).toHaveAttribute('aria-describedby', 'contact-name-error');
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(screen.getByLabelText('Nome', { exact: true })).toHaveFocus(); expect(fetch).not.toHaveBeenCalled();
  });
  it('bloqueia duplicidade, confirma sucesso e só então limpa', async () => {
    let resolve;
    const fetch = vi.fn(() => new Promise((done) => { resolve = done; })); vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup(); render(<Contact />); await fill(user);
    await user.dblClick(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled(); expect(fetch).toHaveBeenCalledTimes(1);
    resolve({ ok: true, json: async () => ({ ok: true }) });
    await screen.findByText('Mensagem recebida com sucesso. Obrigado pelo contato!');
    expect(screen.getByLabelText('Nome', { exact: true })).toHaveValue('');
    await user.type(screen.getByLabelText('Nome', { exact: true }), 'Outra pessoa');
    expect(screen.queryByText('Mensagem recebida com sucesso. Obrigado pelo contato!')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
  it('preserva dados após erro e repete a mesma chave na nova tentativa', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce({ ok: false, status: 502, json: async () => ({}) }).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetch); const user = userEvent.setup(); render(<Contact />); await fill(user);
    const button = screen.getByRole('button', { name: 'Enviar mensagem' });
    await user.click(button); await screen.findByText(/Não foi possível conectar/);
    expect(screen.getByLabelText('Mensagem', { exact: true })).toHaveValue(valid.message);
    await user.click(button); await screen.findByText(/Não foi possível enviar sua mensagem agora/);
    await user.click(button);
    await waitFor(() => expect(screen.getByLabelText('Nome', { exact: true })).toHaveValue(''));
    const keys = fetch.mock.calls.map(([, options]) => JSON.parse(options.body).requestId);
    expect(new Set(keys).size).toBe(1);
  });
});
