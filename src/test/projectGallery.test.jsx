import { StrictMode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProjectGallery from '../components/project-details/ProjectGallery.jsx';

const images = [
  { src: '/images/projects/exemplo/01-painel.webp', alt: 'Painel com resumo financeiro', caption: 'Visão geral financeira', width: 1440, height: 900 },
  { src: '/images/projects/exemplo/02-compras.webp', alt: 'Lista de compras e parcelas', caption: 'Organização das compras', width: 1200, height: 800 },
  { src: '/images/projects/exemplo/03-relatorio.webp', alt: 'Relatório por categoria', caption: 'Distribuição das despesas' },
];

function renderGallery(galleryImages = images) {
  return {
    user: userEvent.setup(),
    ...render(<StrictMode><ProjectGallery images={galleryImages} projectTitle="Meu projeto" /></StrictMode>),
  };
}

describe('galeria do estudo de caso', () => {
  it('apresenta região nomeada, legendas, dimensões e imagens secundárias sob demanda', () => {
    renderGallery();
    const gallery = screen.getByRole('region', { name: 'Galeria de imagens' });
    const image = within(gallery).getByRole('img', { name: images[0].alt });
    expect(image).toHaveAttribute('src', images[0].src);
    expect(image).toHaveAttribute('width', '1440');
    expect(image).toHaveAttribute('height', '900');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(within(gallery).getByText(images[0].caption)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('substitui imagens ausentes pelo caminho esperado e impede sua abertura', async () => {
    const { user } = renderGallery();
    fireEvent.error(screen.getByRole('img', { name: images[1].alt }));
    expect(screen.getByText('Imagem do processo ainda não adicionada')).toBeInTheDocument();
    expect(screen.getByText(images[1].src).tagName).toBe('CODE');
    expect(screen.queryByRole('img', { name: images[1].alt })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: `Ampliar imagem: ${images[1].alt}` })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `Ampliar imagem: ${images[0].alt}` }));
    const dialog = screen.getByRole('dialog', { name: 'Meu projeto' });
    expect(within(dialog).getByRole('status')).toHaveTextContent('Imagem 1 de 2');
    await user.click(within(dialog).getByRole('button', { name: 'Próxima imagem' }));
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', images[2].src);
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', images[0].src);
  });

  it('mostra pendências editoriais sem solicitar arquivos conhecidos como ausentes', async () => {
    const { user } = renderGallery([images[0], { ...images[1], pending: true }, images[2]]);
    expect(screen.getByText('Imagem do processo ainda não adicionada')).toBeInTheDocument();
    expect(screen.getByText(images[1].src).tagName).toBe('CODE');
    expect(screen.queryByRole('img', { name: images[1].alt })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: `Ampliar imagem: ${images[1].alt}` })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `Ampliar imagem: ${images[0].alt}` }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('status')).toHaveTextContent('Imagem 1 de 2');
    await user.click(within(dialog).getByRole('button', { name: 'Próxima imagem' }));
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', images[2].src);
  });

  it('abre por teclado, mantém o foco ao navegar e devolve o foco com Escape', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    const { user } = renderGallery();
    const trigger = screen.getByRole('button', { name: `Ampliar imagem: ${images[0].alt}` });
    trigger.focus();
    await user.keyboard('{Enter}');
    const dialog = screen.getByRole('dialog', { name: 'Meu projeto' });
    const close = within(dialog).getByRole('button', { name: 'Fechar imagem ampliada' });
    expect(close).toHaveFocus();
    const openings = showModal.mock.calls.length;
    await user.tab({ shift: true });
    const next = within(dialog).getByRole('button', { name: 'Próxima imagem' });
    expect(next).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', images[1].src);
    expect(within(dialog).getByRole('status')).toHaveTextContent('Imagem 2 de 3');
    expect(within(dialog).getByText(images[1].caption)).toBeInTheDocument();
    expect(next).toHaveFocus();
    expect(showModal).toHaveBeenCalledTimes(openings);
    await user.tab();
    expect(close).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', images[0].src);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    showModal.mockRestore();
  });

  it('fecha pelo botão e pelo cancelamento nativo, restaurando o overflow anterior', async () => {
    document.documentElement.style.overflow = 'auto';
    const { user } = renderGallery([images[0]]);
    const trigger = screen.getByRole('button', { name: `Ampliar imagem: ${images[0].alt}` });
    await user.click(trigger);
    expect(document.documentElement.style.overflow).toBe('hidden');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).queryByRole('button', { name: 'Próxima imagem' })).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Fechar imagem ampliada' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('auto');
    await user.click(trigger);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    document.documentElement.style.overflow = '';
  });

  it('remove uma imagem que falha ampliada e fecha quando nenhuma permanece disponível', async () => {
    const { user } = renderGallery(images.slice(0, 2));
    await user.click(screen.getByRole('button', { name: `Ampliar imagem: ${images[0].alt}` }));
    fireEvent.error(within(screen.getByRole('dialog')).getByRole('img'));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', images[1].src);
    expect(within(dialog).getByRole('status')).toHaveTextContent('Imagem 1 de 1');
    fireEvent.error(within(dialog).getByRole('img'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByText('Imagem do processo ainda não adicionada')).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'Galeria de imagens' })).toHaveFocus();
  });
});
