"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Script from "next/script";
import { useRef, useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa6";

export default function Home() {
  const containerRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [pins, setPins] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden" ref={containerRef}>
      
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
              <Image src="/ezequiel_torres.jpg" alt="Ezequiel Torres" fill className="object-cover saturate-150 contrast-110 transition-transform duration-700 hover:scale-110" />
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
      <section className="bg-[#FAFAFA] text-[#111] pt-32 pb-16 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Inspiración Reciente</h2>
          <div className="w-24 h-1 bg-[#111] mx-auto"></div>
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
      <section className="pt-16 pb-32 px-4 md:px-12 bg-[#FAFAFA] text-[#111] relative z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Trayectoria</h2>
            <div className="w-24 h-1 bg-[#111] mx-auto"></div>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                title: "Fundador y Gestor - ANIMARTE",
                desc: "Creación y gestión de ANIMARTE, un espacio dedicado al arte, dibujo y pintura. Impartición de talleres y cursos de body paint."
              },
              {
                title: "Organizador - Seminario Provincial de Body Paint Jujuy",
                desc: "Organización y participación activa en el Seminario Provincial de Body Paint Jujuy, un evento anual que celebra la creatividad y la expresión artística a través del cuerpo humano."
              },
              {
                title: "Exposiciones de Arte",
                desc: "Exhibición de obras de body paint en prestigiosos espacios y galerías de arte, incluyendo el Centro Cultural Héctor Tizón y el Museo de Bellas Artes de Jujuy."
              },
              {
                title: "Reconocimientos y Premios",
                desc: "Ganador de varios concursos y premios de arte a nivel local, nacional e internacional. Reconocimiento por parte del gobernador de Jujuy y la Universidad Nacional de Jujuy."
              },
              {
                title: "Colaboración Mediática",
                desc: "Colaboraciones con diversos medios de comunicación y cultura, incluyendo Jujuy FM 1017, Radio Nacional, El Tribuno de Jujuy y Notinor."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-50px" }}
                whileHover={{ x: 10, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="border-l-2 border-neutral-300 pl-6 cursor-pointer"
              >
                <h3 className="text-2xl font-serif font-bold mb-2">{item.title}</h3>
                <p className="text-lg text-neutral-600 font-sans">{item.desc}</p>
              </motion.div>
            ))}
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

          {/* Art Piece 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-2xl shadow-black/50">
                <Image src="/murales.png" alt="Murales Humanos" fill className="object-cover saturate-150 contrast-125 transition-transform duration-700 hover:scale-110" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-full md:w-1/2 space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-serif">Murales Humanos</h2>
              <p className="text-lg text-neutral-300 leading-relaxed font-sans max-w-md">
                Cada pincelada transforma la piel en una obra maestra respirante, mezclando la forma humana con narrativas abstractas e hiperrealistas.
              </p>
            </motion.div>
          </div>

          {/* Art Piece 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-2xl shadow-black/50">
                <Image src="/bodyPaint.jpg" alt="Identidad e Ilusion" fill className="object-cover saturate-150 contrast-125 transition-transform duration-700 hover:scale-110" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-full md:w-1/2 space-y-6 md:text-right flex flex-col md:items-end"
            >
              <h2 className="text-4xl md:text-5xl font-serif">Identidad e Ilusión</h2>
              <p className="text-lg text-neutral-300 leading-relaxed font-sans max-w-md">
                Técnicas avanzadas de pintura corporal que juegan con la perspectiva, la luz y la sombra para crear ilusiones ópticas impactantes.
              </p>
            </motion.div>
          </div>

          {/* Art Piece 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-2xl shadow-black/50">
                <Image src="/seminarios.png" alt="Seminarios y Talleres" fill className="object-cover saturate-150 contrast-125 transition-transform duration-700 hover:scale-110" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-full md:w-1/2 space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-serif">Seminarios y Talleres</h2>
              <p className="text-lg text-neutral-300 leading-relaxed font-sans max-w-md">
                Compartiendo la técnica y la pasión con nuevas generaciones de artistas a través de talleres intensivos y seminarios provinciales.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#111] py-12 px-4 md:px-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-neutral-500 font-sans text-sm">
            © {new Date().getFullYear()} Ezequiel Torres. Todos los derechos reservados.
          </div>
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
          </div>
        </div>
      </footer>

    </main>
  );
}
