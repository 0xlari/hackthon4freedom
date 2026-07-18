"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SessionState = "loading" | "authenticated" | "anonymous";

export function SessionAwareNavigation({ mobile = false }: { mobile?: boolean }) {
  const [session, setSession] = useState<SessionState>("loading");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (active) setSession(response.ok ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (active) setSession("anonymous");
      });
    return () => { active = false; };
  }, [pathname]);

  async function signOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    setSession("anonymous");
    router.replace("/");
    router.refresh();
  }

  return (
    <>
      <Link href="/como-funciona">Como funciona</Link>
      <Link href="/pools">Pools</Link>
      {session === "authenticated" ? (
        <>
          <Link href="/painel">Painel</Link>
          <button className={mobile ? "mobile-nav__action" : "nav-action"} type="button" onClick={signOut}>Sair</button>
        </>
      ) : (
        <Link className={mobile ? undefined : "button button--quiet"} href="/entrar">Entrar</Link>
      )}
    </>
  );
}
