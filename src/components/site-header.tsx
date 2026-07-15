import Link from "next/link";
import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/button-link";

const navigation = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/pools", label: "Pools" },
  { href: "/limite", label: "Meu limite" },
  { href: "/recebivel", label: "Recebível" },
  { href: "/demo", label: "Demo" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/entrar" variant="quiet">
            Entrar
          </ButtonLink>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Abrir menu">Menu</summary>
          <nav aria-label="Navegação móvel">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/entrar">Entrar</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
