'use client';

import React, { useState, useEffect } from 'react';

export default function CivilProjectIndex() {
  const [projectList, setProjectList] = useState([
    { name: 'Silicon Plots Sect A', sector: 'Industrial Zone Hub', spec: '18.2 Acres / Hydro drainage grids', year: '2026' },
    { name: 'Solitaire Plotted Ridge', sector: 'Premium Residential Plotted', spec: '12.5 Acres / Gated boundary retaining', year: '2026' },
    { name: 'Nexus Corridor Plot', sector: 'Commercial Corridor Zone', spec: '8.4 Acres / Utility-grid connections', year: '2025' }
  ]);

  useEffect(() => {
    fetch('/api/get-projects.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter projects that belong to civil
          const filtered = data.filter(p => 
            p.sector.toLowerCase().includes('plotted') || 
            p.sector.toLowerCase().includes('zone') || 
            p.sector.toLowerCase().includes('residential') || 
            p.sector.toLowerCase().includes('acres')
          );
          if (filtered.length > 0) {
            setProjectList(filtered);
          }
        }
      })
      .catch(err => console.log('Projects fetch error, using default:', err));
  }, []);

  return (
    <section
      id="project-index"
      className="bg-[#FFEA0A] text-[#121315] w-full border-b border-[#121315]/10 relative z-10 flex flex-col items-center"
      style={{
        fontFamily: '"Outfit", sans-serif',
        padding: '4rem 1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="flex flex-col items-center" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Centered Table Header Row */}
        <div
          className="cr-reveal"
          style={{
            borderBottom: '1px solid rgba(18, 19, 21, 0.15)',
            paddingBottom: '2.5rem',
            marginBottom: '3.5rem',
            width: '100%',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          <p
            className="font-mono tracking-widest uppercase mb-3"
            style={{ fontSize: '10px', color: 'rgba(18, 19, 21, 0.65)' }}
          >
            // Land holdings index
          </p>
          <h2
            className="hover:text-white transition-colors duration-300 cursor-default"
            style={{
              fontFamily: '"Basement Grotesque","Syncopate",sans-serif',
              fontSize: '2.25rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              margin: '0 auto 1.5rem auto',
              letterSpacing: '0.02em',
              textAlign: 'center'
            }}
          >
            Plot Index
          </h2>
          <span className="text-sm font-mono text-black/55">({String(projectList.length).padStart(2, '0')} logged cases)</span>
        </div>

        {/* Tabular List */}
        <div className="cr-reveal" style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Column Names (Desktop only) */}
          <div
            className="hidden md:grid md:grid-cols-4 py-4 text-[10.5px] uppercase tracking-wider text-black/45 font-mono"
            style={{ borderBottom: '1px solid rgba(18, 19, 21, 0.15)', boxSizing: 'border-box' }}
          >
            <span>Plot Location</span>
            <span>Zoning Type</span>
            <span>Specifications</span>
            <span className="text-right">Release Year</span>
          </div>

          {/* Table Data Rows with generous vertical padding */}
          <div className="divide-y divide-[#121315]/10" style={{ boxSizing: 'border-box' }}>
            {projectList.map((p, idx) => (
              <div
                key={idx}
                className="group grid grid-cols-2 md:grid-cols-4 py-6 text-base items-center transition-colors duration-300 hover:text-white"
                style={{ boxSizing: 'border-box' }}
              >
                {/* Column 1: Name */}
                <span className="font-bold text-[#121315] group-hover:text-white transition-colors">{p.name}</span>
                
                {/* Column 2: Sector */}
                <span className="text-black/60 md:block hidden group-hover:text-white transition-colors">{p.sector}</span>
                
                {/* Column 3: Spec */}
                <span className="text-black/60 md:block hidden group-hover:text-white transition-colors">{p.spec}</span>
                
                {/* Column 4: Year */}
                <span className="text-right text-black/60 flex justify-between md:justify-end items-center gap-2 group-hover:text-white transition-colors">
                  <span className="md:hidden block text-[10px] uppercase tracking-wider font-mono text-black/40">Completed:</span>
                  <span className="font-mono flex items-center gap-1.5 font-bold">
                    {p.year} <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </span>
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
