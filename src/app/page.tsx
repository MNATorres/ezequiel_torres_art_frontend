"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP, FaEnvelope, FaWhatsapp } from "react-icons/fa6";
import ScrollBeam from "@/components/ScrollBeam";
import GlowFrame from "@/components/GlowFrame";
import type { Experience } from "@/lib/experiences";
import type { Artwork } from "@/lib/artworks";

export default function Home() {
  const containerRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [pins, setPins] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [showFloating, setShowFloating] = useState(false);
  const [recentTrayectorias, setRecentTrayectorias] = useState<Experience[]>([]);
  const [loadingTrayectorias, setLoadingTrayectorias] = useState(true);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [pins]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev === 0 ? 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/pinterest')
      .then(res => res.json())
      .then(data => {
        if(data.images) setPins(data.images);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.experiences)) {
          setRecentTrayectorias(data.experiences.slice(0, 2));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingTrayectorias(false));
  }, []);

  useEffect(() => {
    fetch('/api/artworks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.artworks)) setArtworks(data.artworks);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingArtworks(false));
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden" ref={containerRef}>

      <ScrollBeam />

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Background Videos Toggle */}
        <div className="absolute inset-0 w-full h-full z-0 bg-black">
          <video 
            autoPlay loop muted playsInline 
            className={`absolute inset-0 w-full h-full object-cover saturate-150 transition-opacity duration-[2000ms] ease-in-out ${currentVideo === 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/eze_torres_vid1.mp4" type="video/mp4" />
          </video>
          <video 
            autoPlay loop muted playsInline 
            className={`absolute inset-0 w-full h-full object-cover saturate-150 transition-opacity duration-[2000ms] ease-in-out ${currentVideo === 1 ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/eze_torres_vid2.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <motion.div 
          style={{ y: heroY }}
          className="text-center px-4 z-20 text-white"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-serif uppercase tracking-tighter leading-none"
          >
            Ezequiel <br /> Torres
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 text-lg md:text-xl uppercase tracking-widest text-neutral-300 font-sans"
          >
            Artista Visual de la Provincia de Jujuy
          </motion.p>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-[#111] text-white py-32 px-4 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 cursor-pointer"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-xl shadow-2xl shadow-black/50">
              <Image src="/ezequiel_torres.jpg" alt="Ezequiel Torres" fill className="object-cover transition-transform duration-700 hover:scale-110" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 space-y-8 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-6xl font-serif">Perfil Profesional</h2>
            <p className="text-lg md:text-xl font-light leading-relaxed text-neutral-300">
              Ezequiel Torres es un destacado artista visual y body painter profesional con sede en la provincia de Jujuy, Argentina. Con una pasión innata por el arte desde su infancia, ha cultivado su talento a lo largo de los años y se ha convertido en un referente en la escena artística local e internacional.
            </p>
            <p className="text-lg md:text-xl font-light leading-relaxed text-neutral-300">
              Su enfoque vibrante y creativo en el body paint, combinado con su habilidad para contar historias a través de sus obras, lo distingue como un talento único en su campo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PINTEREST SECTION */}
      <section className="bg-[#0a0a0a] text-white pt-32 pb-16 relative z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Inspiración Reciente</h2>
          <div className="w-24 h-1 bg-white mx-auto"></div>
        </motion.div>
        
        {pins.length > 0 ? (
          <motion.div ref={carouselRef} className="cursor-grab active:cursor-grabbing overflow-hidden pl-4 md:pl-12">
            <motion.div 
              drag="x" 
              dragConstraints={{ right: 0, left: -width }} 
              className="flex gap-6 w-max pr-12"
            >
              {pins.map((pin, i) => (
                <motion.div key={i} className="min-w-[280px] md:min-w-[320px] h-[400px] relative rounded-xl overflow-hidden shadow-xl pointer-events-none">
                  <Image src={pin} alt="Pinterest Art" fill className="object-cover" unoptimized />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex justify-center h-[400px] items-center text-neutral-400">
            Cargando inspiración...
          </div>
        )}
      </section>

      {/* TRAYECTORIA SECTION */}
      <section className="pt-16 pb-32 px-4 md:px-12 bg-[#0a0a0a] text-white relative z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Trayectoria</h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </motion.div>

          {loadingTrayectorias ? (
            <div className="space-y-10">
              {[0, 1].map((i) => (
                <div key={i} className="border-l-2 border-neutral-800 pl-6 animate-pulse">
                  <div className="h-3 w-24 rounded bg-white/10 mb-3" />
                  <div className="h-6 w-2/3 rounded bg-white/10 mb-3" />
                  <div className="h-4 w-full rounded bg-white/10 mb-2" />
                  <div className="h-4 w-5/6 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : (
            recentTrayectorias.length > 0 && (
              <div className="space-y-10">
                {recentTrayectorias.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-l-2 border-neutral-700 pl-6"
                  >
                    <p className="text-sm uppercase tracking-widest text-neutral-500 font-serif mb-1">
                      {new Date(item.date).toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
                    </p>
                    <h3 className="text-2xl font-serif font-bold mb-2 break-words">{item.title}</h3>
                    <p className="text-lg text-neutral-400 font-sans break-words line-clamp-3">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )
          )}

          <div className="flex justify-center">
            <Link
              href="/trayectoria"
              className="group relative inline-block overflow-hidden rounded-full border border-white/30 bg-white/5 px-10 py-4 text-sm md:text-base font-sans uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-500 hover:border-white hover:text-black"
            >
              <span className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
              <span className="absolute inset-0 -z-10 rounded-full bg-white/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10">Ver trayectoria completa</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="relative z-10 bg-[#111] text-white py-32 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-40">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif">Arte en Vivo</h2>
            <p className="mt-4 text-neutral-400 text-lg uppercase tracking-widest font-sans">El cuerpo humano como lienzo</p>
          </motion.div>

          {loadingArtworks ? (
            <div className="space-y-40">
              {[0, 1].map((i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-12 animate-pulse">
                  <div className="w-full md:w-1/2">
                    <div className="mx-auto w-[85%] md:w-[70%] aspect-[4/5] rounded-lg bg-white/5" />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="h-10 w-2/3 rounded bg-white/10" />
                    <div className="h-4 w-full rounded bg-white/10" />
                    <div className="h-4 w-5/6 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : artworks.length > 0 ? (
            artworks.map((art, index) => {
              const reversed = index % 2 !== 0;
              return (
                <div
                  key={art._id}
                  className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: reversed ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-1/2"
                  >
                    <div className="mx-auto w-[85%] md:w-[70%]">
                      <GlowFrame>
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-2xl shadow-black/50">
                          {art.imageUrl ? (
                            <Image src={art.imageUrl} alt={art.title} fill className="object-cover transition-transform duration-700 hover:scale-110" />
                          ) : (
                            <div className="absolute inset-0 bg-neutral-800" />
                          )}
                        </div>
                      </GlowFrame>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: reversed ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className={`w-full md:w-1/2 space-y-6 ${reversed ? "md:text-right flex flex-col md:items-end" : ""}`}
                  >
                    <h2 className="text-4xl md:text-5xl font-serif break-words">{art.title}</h2>
                    <p className="text-lg text-neutral-300 leading-relaxed font-sans max-w-md break-words">
                      {art.description}
                    </p>
                  </motion.div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center">
              <p className="text-neutral-500 text-lg uppercase tracking-widest font-sans">Próximamente</p>
            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#111] pt-16 pb-24 md:pb-16 px-4 md:px-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-8">
          <div className="flex items-center gap-8">
            <a href="https://www.instagram.com/ezequiel_torres.art/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="https://web.facebook.com/ezequiel.torres.954812" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300">
              <FaFacebookF className="w-6 h-6" />
            </a>
            <a href="https://www.youtube.com/channel/UC6qjtV4dC9U6OexTildKZJA" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300">
              <FaYoutube className="w-6 h-6" />
            </a>
            <a href="https://pin.it/5gwWyry" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300">
              <FaPinterestP className="w-6 h-6" />
            </a>
            <a href="mailto:bodypaintjujuy@gmail.com" className="text-neutral-400 hover:text-white transition-colors duration-300">
              <FaEnvelope className="w-6 h-6" />
            </a>
          </div>
          <div className="text-neutral-600 font-sans text-sm text-center">
            © {new Date().getFullYear()} Ezequiel Torres. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* FLOATING SOCIAL BUTTONS */}
      <div className={`fixed bottom-8 right-8 z-50 flex flex-col gap-4 transition-all duration-700 transform ${showFloating ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        
        {/* Instagram Button */}
        <a 
          href="https://www.instagram.com/ezequiel_torres.art/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#111] border border-neutral-800 rounded-full shadow-2xl hover:border-[#E1306C]/50 transition-all duration-500 group"
          aria-label="Ir a Instagram"
        >
          <span className="absolute inset-0 rounded-full bg-[#E1306C]/20 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"></span>
          <span className="absolute inset-0 rounded-full border border-[#E1306C]/50 scale-100 group-hover:animate-ping opacity-0 group-hover:opacity-100"></span>
          <FaInstagram className="w-6 h-6 text-neutral-400 group-hover:text-[#E1306C] relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(225,48,108,0.8)]" />
        </a>

        {/* YouTube Button */}
        <a 
          href="https://www.youtube.com/channel/UC6qjtV4dC9U6OexTildKZJA"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#111] border border-neutral-800 rounded-full shadow-2xl hover:border-[#FF0000]/50 transition-all duration-500 group"
          aria-label="Ir a YouTube"
        >
          <span className="absolute inset-0 rounded-full bg-[#FF0000]/20 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"></span>
          <span className="absolute inset-0 rounded-full border border-[#FF0000]/50 scale-100 group-hover:animate-ping opacity-0 group-hover:opacity-100"></span>
          <FaYoutube className="w-6 h-6 text-neutral-400 group-hover:text-[#FF0000] relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
        </a>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/5493884378218?text=Hola%20Ezequiel,%20vengo%20desde%20la%20p%C3%A1gina%20web%20y%20me%20gustar%C3%ADa%20hacer%20una%20consulta."
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#111] border border-neutral-800 rounded-full shadow-2xl hover:border-[#25D366]/50 transition-all duration-500 group"
          aria-label="Contactar por WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366]/20 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"></span>
          <span className="absolute inset-0 rounded-full border border-[#25D366]/50 scale-100 group-hover:animate-ping opacity-0 group-hover:opacity-100"></span>
          <FaWhatsapp className="w-6 h-6 text-neutral-400 group-hover:text-[#25D366] relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(37,211,102,0.8)]" />
        </a>

      </div>

    </main>
  );
}
