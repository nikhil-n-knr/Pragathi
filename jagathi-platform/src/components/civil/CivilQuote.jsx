'use client';

import React, { useState, useEffect } from 'react';

export default function CivilQuote() {
  const [feedback, setFeedback] = useState({
    quote: 'Jagathi delivered more than raw plots. They gave our fund a secured, pre-cleared, utility-connected spatial yield.',
    author: 'Portfolio Partner',
    role: 'Urban Land Investments Council'
  });

  useEffect(() => {
    fetch('/api/get-feedback.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Use the newest feedback entry
          const item = data[0];
          setFeedback({
            quote: item.quote,
            author: item.author,
            role: item.role
          });
        }
      })
      .catch(err => console.log('Feedback fetch error, using default:', err));
  }, []);

  return (
    <section
      className="bg-[#1b1c1e] text-white w-full relative z-10 flex flex-col items-center"
      style={{
        padding: '4rem 1.5rem',
        boxSizing: 'border-box',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="flex flex-col items-center text-center cr-reveal" style={{ boxSizing: 'border-box', width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Quote mark centered */}
        <div
          style={{
            fontFamily: 'serif',
            fontSize: '5rem',
            lineHeight: '1',
            color: '#FFEA0A',
            opacity: 0.8,
            marginBottom: '2rem'
          }}
        >
          “
        </div>

        <blockquote className="flex flex-col items-center" style={{ margin: 0, padding: 0 }}>
          <p
            className="hover:text-[#FFEA0A] transition-colors duration-300 cursor-default"
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 'clamp(1.75rem, 3.8vw, 3.8rem)',
              fontWeight: '400',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: '0 auto',
              maxWidth: '950px',
              textAlign: 'center',
              color: '#ffffff'
            }}
          >
            {feedback.quote}
          </p>
          
          {/* Centered Footer */}
          <footer
            style={{
              marginTop: '4rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '2rem',
              width: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <p
              style={{
                fontFamily: '"Basement Grotesque", "Syncopate", sans-serif',
                fontSize: '1rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 4px 0',
                color: '#FFEA0A'
              }}
            >
              {feedback.author}
            </p>
            <p
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.55)',
                margin: 0
              }}
            >
              {feedback.role}
            </p>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
