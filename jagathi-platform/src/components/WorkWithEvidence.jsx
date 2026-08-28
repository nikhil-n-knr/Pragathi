'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SubpageKineticMarquee from './SubpageKineticMarquee';

export default function WorkWithEvidence({ pageType = 'construction', onSelectProject }) {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const projectData = {
    construction: [
      { id: 1, num: '01', title: 'Orion Link Bridge', tag: 'Infrastructure', image: '/assets/images/construction/bridge.webp', desc: 'From foundational piling to a completed elevated metro viaduct spanning an urban core.', aspect: '[ URBAN TRANSIT ]', location: 'Metropolis, IN', coords: '13.0640° N, 80.2460° E', metric: '15km Span · Grade M60' },
      { id: 2, num: '02', title: 'Silicon Arc Tower', tag: 'Commercial', image: '/assets/images/construction/highrise.webp', desc: 'A complex deep excavation transitioning into a towering 80-story commercial skyscraper.', aspect: '[ SKYLINE PILLAR ]', location: 'Downtown, IN', coords: '12.9716° N, 77.5946° E', metric: '80 Floors · 1.2M SqFt' },
      { id: 3, num: '03', title: 'Cogen Industrial', tag: 'Industrial', image: '/assets/images/construction/industrial.webp', desc: 'Bare steel framework evolving into a state-of-the-art automated manufacturing facility.', aspect: '[ HEAVY DUTY ]', location: 'Industrial Hub, IN', coords: '19.0760° N, 72.8777° E', metric: '500,000 SqFt · Smart Grid' },
      { id: 4, num: '04', title: 'Suspension Bridge', tag: 'Engineering', image: '/assets/images/construction/bridge.webp', desc: 'Raw concrete pylons and tension cables transformed into a majestic suspension bridge over deep waters.', aspect: '[ SPANNING GORGES ]', location: 'Valley Pass, IN', coords: '11.0168° N, 76.9558° E', metric: '2.5km Length · High Tension' },
      { id: 5, num: '05', title: 'Highrise Framework', tag: 'Architecture', image: '/assets/images/construction/highrise.webp', desc: 'A geometric tension blueprint realized as a spectacular cantilevered fabric canopy over a modern sports arena.', aspect: '[ ARENA ROOFING ]', location: 'Capital City, IN', coords: '28.6139° N, 77.2090° E', metric: '60,000 Capacity · PTFE Fabric' }
    ],
    interior: [
      { id: 1, num: '01', title: 'Corporate Boardroom', tag: 'Commercial', image: '/assets/images/interior/corporate.webp', desc: 'A bare office shell meticulously transformed into a hyper-luxury executive boardroom.', aspect: '[ EXECUTIVE SUITE ]', location: 'Tech Park, IN', coords: '12.8399° N, 77.6770° E', metric: 'Custom Acoustics · Walnut Finish' },
      { id: 2, num: '02', title: 'Luxury Hotel Lobby', tag: 'Hospitality', image: '/assets/images/interior/hospitality.webp', desc: 'Concrete voids elevated into a grand, sweeping hotel lobby featuring crystal chandeliers and marble floors.', aspect: '[ GRAND ENTRANCE ]', location: 'Coastal Resort, IN', coords: '15.2993° N, 74.1240° E', metric: '5-Star Rating · Italian Marble' },
      { id: 3, num: '03', title: 'Minimalist Art Gallery', tag: 'Curation', image: '/assets/images/interior/concept.webp', desc: 'An exposed brick warehouse converted into a pristine, light-controlled minimalist art gallery.', aspect: '[ PURE WHITE SPACE ]', location: 'Art District, IN', coords: '18.5204° N, 73.8567° E', metric: 'Museum-Grade Lighting' },
      { id: 4, num: '04', title: 'Michelin Star Restaurant', tag: 'Hospitality', image: '/assets/images/interior/fabrication.webp', desc: 'A raw commercial unit curated into an upscale fine-dining experience with intimate mood lighting and velvet seating.', aspect: '[ FINE DINING ]', location: 'Urban Center, IN', coords: '22.5726° N, 88.3639° E', metric: 'Bespoke Brass Fixtures' },
      { id: 5, num: '05', title: 'High-End Retail Boutique', tag: 'Commercial', image: '/assets/images/interior/penthouse.webp', desc: 'A storefront blueprint transitioned to a sleek, luxurious fashion boutique designed to highlight premium garments.', aspect: '[ LUXURY RETAIL ]', location: 'High Street, IN', coords: '17.3850° N, 78.4867° E', metric: 'Custom Stone Displays' }
    ],
    civil: [
      { id: 1, num: '01', title: 'Multi-level Interchange', tag: 'Infrastructure', image: '/assets/images/civil/commercial.webp', desc: 'Complex topographical grading transformed into a fully operational multi-level highway interchange.', aspect: '[ HIGHWAY FLOW ]', location: 'Expressway, IN', coords: '19.0760° N, 72.8777° E', metric: '5 Levels · 12 Lanes' },
      { id: 2, num: '02', title: 'Urban Waterfront', tag: 'Development', image: '/assets/images/civil/residential.webp', desc: 'An undeveloped riverbank converted into a vibrant, modern urban waterfront promenade with cafes and walkways.', aspect: '[ CIVIC PROMENADE ]', location: 'Riverfront, IN', coords: '23.0225° N, 72.5714° E', metric: '5km Walkway · Green Zones' },
      { id: 3, num: '03', title: 'Smart City Grid', tag: 'Masterplan', image: '/assets/images/civil/mapping.webp', desc: 'A masterplan grid realized as a high-tech sustainable smart city district with underground utility trenches.', aspect: '[ FUTURE URBAN ]', location: 'New City, IN', coords: '28.5355° N, 77.3910° E', metric: '100% Sustainable Energy' },
      { id: 4, num: '04', title: 'Topographical Dam', tag: 'Heavy Civil', image: '/assets/images/civil/industrial.webp', desc: 'A deep gorge engineered into a colossal, fully functional concrete hydroelectric dam.', aspect: '[ HYDRO POWER ]', location: 'Mountain Gorge, IN', coords: '31.1048° N, 77.1666° E', metric: '1500 MW Capacity' },
      { id: 5, num: '05', title: 'Solar Farm Grading', tag: 'Energy', image: '/assets/images/civil/commercial.webp', desc: 'Vast uneven terrain perfectly graded to host a massive operational solar energy farm.', aspect: '[ RENEWABLE SPRAWL ]', location: 'Desert Plains, IN', coords: '26.9124° N, 75.7873° E', metric: '200 Acres · 50MW Peak' }
    ]
  };

  const projects = projectData[pageType] || projectData.construction;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!section || !scrollContainer) return;

    const pin = ScrollTrigger.create({
      trigger: section,
      pin: true,
      anticipatePin: 1,
      start: 'top top',
      end: () => `+=${(scrollContainer.scrollWidth - window.innerWidth) * 1.25}`,
      scrub: 1.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const amount = -(scrollContainer.scrollWidth - window.innerWidth);
        gsap.set(scrollContainer, { x: self.progress * amount });
      }
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      pin.kill();
    };
  }, []);

  return (
    <div className="w-full relative z-10 flex flex-col bg-[#121315]">
      {/* Sleek Kinetic Marquee Section */}
      <SubpageKineticMarquee />

      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center bg-[#121315] border-t border-[#FFEA0A]/15 py-12"
      >
        <div
          ref={scrollContainerRef}
          className="flex flex-row items-center gap-12 md:gap-16 px-[6vw] h-[75vh] will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Intro Panel: Removed "WORK WITH EVIDENCE" -> Replaced with clean heading */}
          <div className="w-[85vw] max-w-[500px] flex-shrink-0 flex flex-col justify-center px-4 md:px-8">
            <span className="text-[#FFEA0A] font-mono text-xs uppercase tracking-[0.3em] font-semibold">
              {"// " + (pageType === 'construction' ? 'Built Reality' : pageType === 'interior' ? 'Curated Spaces' : 'Civil Advisory')}
            </span>
            <h2 
              className="text-white font-black uppercase text-left w-full leading-none font-basement hover:text-[#FFEA0A] transition-colors duration-300 cursor-default" 
              style={{ 
                letterSpacing: '0.06em', 
                fontSize: 'clamp(2.2rem, 5.0vw, 4.5rem)',
                marginTop: '0.75rem' 
              }}
            >
              Featured Portfolio
            </h2>
            <p 
              className="text-gray-300 text-left"
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(11px, 1.2vw, 14px)',
                lineHeight: '1.8',
                letterSpacing: '0.05em',
                marginTop: '1.25rem',
                maxWidth: '30rem'
              }}
            >
              From the initial blueprint to final execution. Explore our meticulous engineering and uncompromising standards in motion.
            </p>
          </div>

          {/* Project Panels */}
          {projects.map((p) => (
            <div
              key={p.id}
              className="w-[85vw] max-w-[840px] h-[55vh] md:h-[62vh] min-h-[420px] flex-shrink-0 bg-[#1C1C1C] border border-[#FFEA0A]/20 rounded-none shadow-[0_45px_90px_-25px_rgba(0,0,0,0.50)] overflow-hidden flex flex-col md:flex-row items-stretch justify-between gap-0 cursor-pointer group work-card-inner"
              onClick={() => onSelectProject && onSelectProject(p)}
            >
              {/* Details Column */}
              <div className="p-8 md:p-12 flex flex-col justify-between items-center text-center w-full md:w-[45%] flex-shrink-0 bg-[#1C1C1C]">
                <div className="flex flex-col items-center w-full">
                  <span className="text-[#FFEA0A] font-mono text-[9px] bg-white/5 border border-[#FFEA0A]/20 px-4 py-2 flex-shrink-0 tracking-widest mb-6">
                    {p.tag}
                  </span>
                  
                  <h3 
                    className="font-bold text-lg md:text-xl uppercase tracking-wide text-white mb-2 group-hover:text-[#FFEA0A] transition-colors duration-300"
                    style={{ fontFamily: '"Basement Grotesque", "Syncopate", sans-serif', letterSpacing: '0.05em' }}
                  >
                    <span className="text-[#FFEA0A]">{p.title.split(' ')[0]}</span>{' '}
                    <span className="font-light text-white/95">{p.title.split(' ').slice(1).join(' ')}</span>
                  </h3>

                  <span className="font-mono text-[8px] tracking-[0.28em] text-[#FFEA0A]/70 uppercase mt-2">
                    {p.aspect}
                  </span>

                  <p 
                    className="text-gray-300 font-light text-xs leading-relaxed mt-4 max-w-[280px]"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    {p.desc}
                  </p>
                </div>

                <div className="w-full flex flex-col items-center gap-3 pt-6 border-t border-white/10 mt-6">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
                    <span>{p.location}</span>
                    <span>•</span>
                    <span className="text-[#FFEA0A]">{p.metric}</span>
                  </div>
                  <button className="bg-[#FFEA0A] text-[#121315] hover:bg-white uppercase tracking-[0.2em] text-[10px] font-black py-2.5 px-5 transition-all flex items-center justify-center gap-2">
                    View Project Case <span>→</span>
                  </button>
                </div>
              </div>

              {/* Photo Column */}
              <div className="w-full md:w-[55%] h-full relative overflow-hidden bg-black flex-shrink-0">
                <img 
                  src={p.image} 
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ filter: 'brightness(0.9) contrast(1.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-6 right-6 font-mono text-[10px] text-[#FFEA0A] bg-black/60 backdrop-blur-md px-3 py-1.5 border border-[#FFEA0A]/30">
                  {p.coords}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
