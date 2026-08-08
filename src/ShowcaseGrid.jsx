import React, { useState } from 'react';
import { ArrowRight, Check, ExternalLink, ShieldCheck, Layers, Users, TrendingUp, BookOpen, Camera, Image } from 'lucide-react';

export default function ShowcaseGrid() {
  const [activeFilter, setActiveFilter] = useState('all');

  const products = [
    {
      id: 'hrms',
      category: 'Enterprise',
      version: 'v2.1.0',
      title: 'Human Resource Management System (HRMS)',
      subtitle: 'A clean, boxy, high-contrast workforce directory designed to streamline organizational boundaries. Features automated attendance, dynamic role configuration, document audits, and interactive permissions registries in a developer-centric environment.',
      badge: 'Enterprise',
      features: [
        'WORKFORCE REGISTRY & COMPLIANCE',
        'DYNAMIC ROLE ASSIGNMENT MATRIX',
        'AUDIT TIMELINE HISTORY LOGGING',
      ],
      image: '/images/hrms_preview.png',
      icon: Users,
    },
    {
      id: 'crm',
      category: 'Marketing',
      version: 'v1.8.5',
      title: 'Customer Relationship Management (CRM)',
      subtitle: 'Maximize sales visibility with structured lead pipeline tracking and conversion analytics. Easily monitor pipeline metrics, revenue stats, and target segments within a clean tabular layout styled for rapid inspection.',
      badge: 'Marketing',
      features: [
        'PIPELINE PIPES & STAGES TRACKING',
        'CONVERSION RATES & REVENUE ANCHORS',
        'DYNAMIC REVENUE BY ACCOUNT MATRIX',
      ],
      image: '/images/crm_preview.png',
      icon: TrendingUp,
    },
    {
      id: 'cms',
      category: 'Publisher',
      version: 'v3.0.2',
      title: 'Content Management System (CMS)',
      subtitle: 'A modular content builder featuring drag-and-drop structural blocks, real-time typography styling, custom spacing configurations, and secure SEO tagging rules designed to compile responsive layouts instantly.',
      badge: 'Publisher',
      features: [
        'MODULAR DRAG BLOCK EDITOR',
        'COMPREHENSIVE TYPOGRAPHY PRESETS',
        'INLINE METADATA & SEO EDITORS',
      ],
      image: '/images/cms_preview.png',
      icon: Layers,
    },
    {
      id: 'lms',
      category: 'Education',
      version: 'v1.5.0',
      title: 'Learning Management System (LMS)',
      subtitle: 'Empower your technical teams with certification tracks, course registries, interactive progress trackers, learning statistics, and automated skill-point aggregation within an elegant developer-certified interface.',
      badge: 'Education',
      features: [
        'DYNAMIC COURSE PROGRESS TRACKER',
        'DEVELOPER CERTIFICATION REGISTRY',
        'DETAILED LEARNING ANALYTICS',
      ],
      image: '/images/lms_preview.png',
      icon: BookOpen,
    },
    {
      id: 'playschool',
      category: 'Security',
      version: 'v1.2.2',
      title: 'PlaySchool Safety & Monitoring System',
      subtitle: 'A specialized security platform designed for nursery and play school operations. Combines active classroom cameras, real-time safety checklists, child check-in registries, and parent communications logs.',
      badge: 'Security',
      features: [
        'ACTIVE CLASSROOM CAMERA FEED GRID',
        'SECURE CHILDREN CHECK-IN AUDIT',
        'VISITOR LOGS & SAFETY METRICS',
      ],
      image: '/images/playschool_preview.png',
      icon: Camera,
    },
    {
      id: 'visualfrog',
      category: 'Utility',
      version: 'v1.0.4',
      title: 'VisualFrog Bulk Image Converter',
      subtitle: 'Upload a ZIP containing structured nested image folders, choose target formats (WEBP, PNG, JPG), and download the output with folder hierarchies completely intact.',
      badge: 'Utility',
      link: 'https://visualfrog.pisparrow.com',
      features: [
        'ZIP FOLDER HIERARCHY PRESERVATION',
        'MULTI-FORMAT BATCH ENGINE (WEBP/PNG/JPG)',
        'LIGHTNING FAST CLIENT-SIDE COMPILER',
      ],
      image: null,
      icon: Image,
    },
  ];

  const categories = ['all', 'Enterprise', 'Marketing', 'Publisher', 'Education', 'Security', 'Utility'];

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

  // Mouse 3D tilt handlers matching reference script lines 884-927
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    card.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease-out';
  };

  return (
    <section id="products" className="py-28 bg-slate-50 relative overflow-hidden">
      {/* Ambient Backdrop Highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tealbrand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tealbrand-600"></span>
              <span className="font-mono text-[10px] font-bold text-tealbrand-700 uppercase tracking-widest">
                SYSTEM REGISTRY // FLAGSHIP PLATFORMS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-slate-900 tracking-tight">
              Our Flagship <span className="font-bold text-tealbrand-600">Platforms</span>
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
              Ready-to-deploy, high-contrast visual architectures.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === cat
                    ? 'bg-tealbrand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flagship Products Layout */}
        <div className="space-y-12">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="nature-glass nature-glass-hover rounded-2xl p-6 md:p-8 border border-tealbrand-500/20 relative shadow-lg overflow-hidden group"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                {/* Technical Corner Markers */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-tealbrand-600/40"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-tealbrand-600/40"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Copy Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-tealbrand-500/10 border border-tealbrand-500/20 text-tealbrand-700 font-mono text-[9px] font-bold uppercase tracking-wider">
                        {product.badge}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[9px] font-bold uppercase tracking-wider">
                        {product.version}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-tealbrand-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      {product.subtitle}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-2">
                      {product.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2.5 text-xs font-mono text-slate-600 font-medium">
                          <Check className="w-4 h-4 text-tealbrand-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {product.link && (
                      <div className="pt-4">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-tealbrand-600 hover:bg-tealbrand-700 text-white px-5 py-2.5 rounded-md font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                        >
                          <span>Visit VisualFrog</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Preview Image / Visual Container */}
                  <div className="w-full">
                    {product.image ? (
                      <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-md group-hover:border-tealbrand-500/40 transition-colors">
                        <img
                          src={product.image}
                          alt={`${product.title} Preview`}
                          className="w-full h-auto object-cover max-h-[340px] transform group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-tealbrand-50/50 to-emerald-50/50 p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-tealbrand-500/10 border border-tealbrand-500/20 text-tealbrand-600 flex items-center justify-center mb-4 shadow-sm">
                          <Icon className="w-10 h-10" />
                        </div>
                        <h4 className="font-mono text-sm font-bold text-slate-800 uppercase tracking-widest mb-1">
                          IMAGE CONVERSION ENGINE
                        </h4>
                        <p className="font-mono text-xs text-slate-500">
                          Preserve folder hierarchies completely intact.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
