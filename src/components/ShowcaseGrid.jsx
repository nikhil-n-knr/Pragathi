import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import ProductDemoModal from './ProductDemoModal';

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseGrid() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'hrms',
      category: 'Enterprise',
      version: 'Production Ready',
      title: 'Human Resource Management System (HRMS)',
      subtitle: 'A clean, boxy, high-contrast workforce directory designed to streamline organizational boundaries. Features automated attendance, dynamic role configuration, document audits, and interactive permissions registries.',
      badge: 'Enterprise Suite',
      features: [
        'WORKFORCE REGISTRY & COMPLIANCE',
        'DYNAMIC ROLE ASSIGNMENT MATRIX',
        'AUDIT TIMELINE HISTORY LOGGING',
      ],
      image: '/images/hrms_preview.png',
    },
    {
      id: 'crm',
      category: 'Marketing',
      version: 'Production Ready',
      title: 'Customer Relationship Management (CRM)',
      subtitle: 'Maximize sales visibility with structured lead pipeline tracking and conversion analytics. Easily monitor pipeline metrics, revenue stats, and target segments within a clean tabular layout.',
      badge: 'Marketing Engine',
      features: [
        'PIPELINE PIPES & STAGES TRACKING',
        'CONVERSION RATES & REVENUE ANCHORS',
        'DYNAMIC REVENUE BY ACCOUNT MATRIX',
      ],
      image: '/images/crm_preview.png',
    },
    {
      id: 'cms',
      category: 'Publisher',
      version: 'Production Ready',
      title: 'Content Management System (CMS)',
      subtitle: 'A modular content builder featuring drag-and-drop structural blocks, real-time typography styling, custom spacing configurations, and secure SEO tagging rules.',
      badge: 'Publisher Core',
      features: [
        'MODULAR DRAG BLOCK EDITOR',
        'COMPREHENSIVE TYPOGRAPHY PRESETS',
        'INLINE METADATA & SEO EDITORS',
      ],
      image: '/images/cms_preview.png',
    },
    {
      id: 'lms',
      category: 'Education',
      version: 'Production Ready',
      title: 'Learning Management System (LMS)',
      subtitle: 'Empower your technical teams with certification tracks, course registries, interactive progress trackers, learning statistics, and automated skill-point aggregation.',
      badge: 'Education Suite',
      features: [
        'DYNAMIC COURSE PROGRESS TRACKER',
        'DEVELOPER CERTIFICATION REGISTRY',
        'DETAILED LEARNING ANALYTICS',
      ],
      image: '/images/lms_preview.png',
    },
    {
      id: 'playschool',
      category: 'Security',
      version: 'Production Ready',
      title: 'PlaySchool Safety & Monitoring System',
      subtitle: 'A specialized security platform designed for nursery and play school operations. Combines active classroom cameras, real-time safety checklists, child check-in registries, and parent communications logs.',
      badge: 'Safety Platform',
      features: [
        'ACTIVE CLASSROOM CAMERA FEED GRID',
        'SECURE CHILDREN CHECK-IN AUDIT',
        'VISITOR LOGS & SAFETY METRICS',
      ],
      image: '/images/playschool_preview.png',
    },
    {
      id: 'visualfrog',
      category: 'Utility',
      version: 'Production Ready',
      title: 'VisualFrog Bulk Image Converter',
      subtitle: 'Upload a ZIP containing structured nested image folders, choose target formats (WEBP, PNG, JPG), and download the output with folder hierarchies completely intact.',
      badge: 'Image Engine',
      link: 'https://visualfrog.pisparrow.com',
      features: [
        'ZIP FOLDER HIERARCHY PRESERVATION',
        'MULTI-FORMAT BATCH ENGINE (WEBP/PNG/JPG)',
        'LIGHTNING FAST CLIENT-SIDE COMPILER',
      ],
      image: null,
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          x: (i) => [-120, 0, 120][i % 3] || 0,
          y: (i) => [-40, 60, -40][i % 3] || 0,
          rotate: (i) => [-8, 0, 8][i % 3] || 0,
          scale: 0.9,
          autoAlpha: 0.3,
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          autoAlpha: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease-out';
  };

  return (
    <>
      <section ref={containerRef} id="products" className="py-20 md:py-28 max-w-[77.5rem] mx-auto px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 gallery-grid-pattern pointer-events-none opacity-40"></div>

        <div className="reveal-line overflow-hidden mb-2">
          <p className="text-[10px] sm:text-xs uppercase text-tealbrand-700 font-mono font-bold tracking-[0.25rem]">
            SYSTEM REGISTRY // THE PLATFORMS
          </p>
        </div>

        <div className="reveal-line overflow-hidden mt-2 mb-10 md:mb-14">
          <h2
            className="tracking-tight text-slate-900 font-medium leading-[1.05]"
            style={{ fontSize: 'clamp(1.75rem, 5.5vw, 3.5rem)' }}
          >
            Autonomous platforms built to scale with data
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div
              key={product.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setSelectedProduct(product)}
              className="fade-card group flex flex-col border border-tealbrand-500/15 hover:bg-white transition-colors duration-300 cursor-pointer rounded-2xl p-5 backdrop-blur-lg nature-glass shadow-md"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              {product.image ? (
                <div
                  className="card-img-pop rounded-xl overflow-hidden mb-5 bg-slate-100 border border-slate-200/60 shadow-sm relative group"
                  style={{
                    aspectRatio: '4 / 3',
                    backgroundImage: `url('${product.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-tealbrand-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-tealbrand-800 font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                      Tap to Preview
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="card-img-pop rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-tealbrand-50 to-emerald-50 border border-slate-200/60 flex items-center justify-center p-6 text-center"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <span className="font-mono text-xs font-bold text-tealbrand-700 uppercase tracking-widest">
                    BULK IMAGE COMPILER
                  </span>
                </div>
              )}

              <div className="card-content-pop flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-tealbrand-700 font-bold uppercase tracking-widest">
                      {product.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-mono text-[9px] font-bold uppercase tracking-wider">
                      {product.version}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-tealbrand-600 transition-colors mb-2">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {product.subtitle}
                  </p>

                  <div className="space-y-1 mb-4 pt-3 border-t border-slate-100">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 font-medium">
                        <Check className="w-3.5 h-3.5 text-tealbrand-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-tealbrand-700 uppercase tracking-wider">
                    {product.badge}
                  </span>
                  {product.link ? (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center text-xs font-mono font-bold text-tealbrand-600 hover:text-tealbrand-700"
                    >
                      <span>Visit Engine</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-xs font-mono font-bold text-tealbrand-600 group-hover:translate-x-1 transition-transform">
                      <span>Live Preview</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductDemoModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
