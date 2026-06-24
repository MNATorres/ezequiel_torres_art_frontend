import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { getExperiences, type Experience } from "@/lib/experiences";
import TrayectoriaTimeline from "@/components/TrayectoriaTimeline";

export const metadata: Metadata = {
  title: "Trayectoria | Ezequiel Torres",
  description:
    "Recorrido profesional de Ezequiel Torres: exposiciones, seminarios, reconocimientos y colaboraciones.",
};

export default async function TrayectoriaPage() {
  let experiences: Experience[] = [];
  let failed = false;

  try {
    experiences = await getExperiences();
  } catch {
    failed = true;
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-32 pt-28 md:px-12 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-neutral-500 transition-colors hover:text-white"
        >
          <FiArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <header className="mb-16 mt-10 text-center md:mb-20">
          <h1 className="font-serif text-5xl md:text-6xl">Trayectoria</h1>
          <div className="mx-auto mt-5 h-px w-24 bg-white" />
        </header>

        {failed ? (
          <p className="text-center font-sans text-neutral-500">
            No se pudo cargar la trayectoria en este momento.
          </p>
        ) : (
          <TrayectoriaTimeline experiences={experiences} />
        )}
      </div>
    </main>
  );
}
