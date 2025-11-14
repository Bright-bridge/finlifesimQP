import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function ParticleBackground() {
  const init = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={init}
      className="fixed inset-0 -z-10"
      options={{
        background: { color: 'transparent' },
        fpsLimit: 60,
        particles: {
          color: { value: '#559E0B' },
          links: { enable: true, color: '#6D28D9', distance: 120, opacity: 0.3 },
          move: { enable: true, speed: 0.6 },
          number: { value: 40, density: { enable: true, area: 800 } },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 2 } }
        },
        detectRetina: true
      }}
    />
  );
}

