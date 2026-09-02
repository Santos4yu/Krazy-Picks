import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Ferrofluid from './Ferrofluid';
import ShinyText from './ShinyText';
import './landing.css';

const ferrofluidRoot = document.getElementById('ferrofluid-root');
if (ferrofluidRoot) createRoot(ferrofluidRoot).render(<Ferrofluid colors={['#ffffff','#ffffff','#ffffff']} speed={0.5} scale={1.6} turbulence={1} fluidity={0.1} rimWidth={0.2} sharpness={2.5} shimmer={1.5} glow={2} flowDirection="down" opacity={1} mouseInteraction mouseStrength={1} mouseRadius={0.35} />);
const shinyTitleRoot = document.getElementById('shiny-title-root');
if (shinyTitleRoot) createRoot(shinyTitleRoot).render(<ShinyText text="Krazy Picks" speed={2.8} delay={0} color="#b5b5b5" shineColor="#ffffff" spread={40} direction="left" yoyo pauseOnHover={false} className="landing-shiny-title" />);

const Icon = ({ children }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{children}</svg>;
const icons = {
  research: <Icon><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></Icon>,
  slate: <Icon><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Icon>,
  v2: <Icon><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></Icon>,
  builder: <Icon><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z" strokeLinejoin="round"/></Icon>,
  saved: <Icon><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/></Icon>,
};

function VortexDock() {
  const [tab, setTab] = useState('research');
  const [saved, setSaved] = useState(0);
  useEffect(() => {
    const sync = (event) => { setTab(event.detail?.tab || 'research'); setSaved(event.detail?.saved ?? 0); };
    window.addEventListener('vortex:dock-sync', sync);
    return () => window.removeEventListener('vortex:dock-sync', sync);
  }, []);
  useEffect(() => { window.dispatchEvent(new Event('vortex:dock-ready')); }, []);
  return <nav className="simple-mobile-nav" aria-label="Primary navigation">
    {['research', 'v2', 'builder', 'saved'].map((key) => (
      <button key={key} type="button" className={tab === key ? 'active' : ''}
        onClick={() => window.dispatchEvent(new CustomEvent(key === 'saved' ? 'vortex:toggle-bet-slip' : 'vortex:switch-tab', { detail: { tab: key } }))}>
        {icons[key]}
        <span>{key === 'v2' ? 'Props' : key === 'builder' ? 'Parlay' : key === 'saved' ? 'Builder' : 'Research'}</span>
        {key === 'saved' && saved > 0 && <b>{saved}</b>}
      </button>
    ))}
  </nav>;
}

createRoot(document.getElementById('dock-root')).render(<VortexDock />);
