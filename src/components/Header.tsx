"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const LINKS = [{ label: "Trayectoria", href: "/trayectoria" }];

export default function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // On the landing the header only appears once the user scrolls past the hero
  // video. On every other page (no hero) it's visible from the top.
  useEffect(() => {
    if (!isLanding) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  // Close the mobile menu with Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={visible ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ pointerEvents: visible ? "auto" : "none" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-12">
          {/* Logo (same as the site icon) */}
          <Link href="/" aria-label="Inicio" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.ico" alt="Ezequiel Torres" className="h-9 w-9 rounded-md" />
            <span className="hidden font-serif text-lg tracking-wide text-white sm:block">
              Ezequiel Torres
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative font-sans text-sm uppercase tracking-[0.2em] text-neutral-300 transition-colors duration-300 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="-mr-2 p-2 text-white md:hidden"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top bar: logo + close */}
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicon.ico" alt="Ezequiel Torres" className="h-9 w-9 rounded-md" />
                <span className="font-serif text-lg tracking-wide text-white">Ezequiel Torres</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="-mr-2 p-2 text-white"
              >
                <FiX className="h-7 w-7" />
              </button>
            </div>

            {/* Links */}
            <motion.nav
              className="flex flex-1 flex-col items-center justify-center gap-10"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              {LINKS.map((l) => (
                <motion.div
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-5xl text-white transition-colors duration-300 hover:text-neutral-400"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
