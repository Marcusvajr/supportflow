'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SignOut } from '../auth/sign-out';

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: 'dashboard' | 'tickets' | 'customers';
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Visão geral', description: 'Indicadores e atalhos', icon: 'dashboard' },
  { href: '/tickets', label: 'Chamados', description: 'Fila e atendimentos', icon: 'tickets' },
  { href: '/customers', label: 'Clientes', description: 'Base de demonstração', icon: 'customers' },
];

function NavIcon({ name }: Readonly<{ name: NavItem['icon'] }>) {
  if (name === 'dashboard') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v7H4V4Zm10 0h6v4h-6V4ZM4 15h6v5H4v-5Zm10-3h6v8h-6v-8Z" /></svg>;
  }
  if (name === 'tickets') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v3.2a3 3 0 0 0 0 5.6V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3.2a3 3 0 0 0 0-5.6V6a2 2 0 0 1 2-2Zm7 3v2m0 2v2m0 2v2" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20m12-9a3.5 3.5 0 1 0 0-7m4 16v-1.5a4.5 4.5 0 0 0-3.1-4.28M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /></svg>;
}

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="app-frame">
      <a className="skip-link" href="#workspace-content">Ir para o conteúdo</a>
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Link href="/dashboard" aria-label="SupportFlow - Visão geral">
            <span className="brand-mark">SF</span>
            <span>
              <strong>SupportFlow</strong>
              <small>Central de suporte</small>
            </span>
          </Link>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <p className="sidebar-section-label">Operação</p>
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link aria-current={active ? 'page' : undefined} className={active ? 'sidebar-link active' : 'sidebar-link'} href={item.href} key={item.href}>
                <span className="sidebar-icon"><NavIcon name={item.icon} /></span>
                <span className="sidebar-link-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-environment">
          <span className="environment-dot" />
          <div>
            <strong>Ambiente publicado</strong>
            <small>V3 · Dados fictícios</small>
          </div>
        </div>

        <div className="sidebar-footer">
          <SignOut />
        </div>
      </aside>

      <div className="app-content">
        <div className="mobile-brandbar">
          <Link href="/dashboard"><span className="brand-mark">SF</span><strong>SupportFlow</strong></Link>
          <SignOut />
        </div>
        <div id="workspace-content" tabIndex={-1}>{children}</div>
      </div>
    </div>
  );
}
