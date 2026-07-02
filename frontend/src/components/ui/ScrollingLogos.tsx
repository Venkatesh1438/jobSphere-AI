import React from 'react'
import googleLogo from '../../assets/company-logos/Google.png'
import microsoftLogo from '../../assets/company-logos/microsoft_PNG6.png'
import appleLogo from '../../assets/company-logos/apple.png'
import accentureLogo from '../../assets/company-logos/accenture.png'
import cognizantLogo from '../../assets/company-logos/Cognizant.png'
import uberLogo from '../../assets/company-logos/uber.png'
import ibmLogo from '../../assets/company-logos/ibm.png'
import netflixLogo from '../../assets/company-logos/netflix.png'
import spotifyLogo from '../../assets/company-logos/Spotify.png'
import samsungLogo from '../../assets/company-logos/samsung.png'
import nvidiaLogo from '../../assets/company-logos/nvidia.png'

const partners = [
  { name: 'Google', logo: googleLogo },
  { name: 'Microsoft', logo: microsoftLogo },
  { name: 'Apple', logo: appleLogo },
  { name: 'Netflix', logo: netflixLogo },
  { name: 'IBM', logo: ibmLogo },
  { name: 'NVIDIA', logo: nvidiaLogo },
  { name: 'Spotify', logo: spotifyLogo },
  { name: 'Uber', logo: uberLogo },
  { name: 'Accenture', logo: accentureLogo },
  { name: 'Cognizant', logo: cognizantLogo },
  { name: 'Samsung', logo: samsungLogo },
]

export const ScrollingLogos: React.FC = () => {
  // Duplicate list to ensure a seamless infinite scroll loop
  const doublePartners = [...partners, ...partners]

  const marqueeStyle = `
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee-scroll {
      display: flex;
      width: max-content;
      animation: marqueeScroll 30s linear infinite;
    }
    .animate-marquee-scroll:hover {
      animation-play-state: paused;
    }
  `

  return (
    <div className="w-full overflow-hidden py-6 bg-slate-50/50 border-y border-slate-100 relative">
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />
      
      {/* Soft gradient edge overlays for Vercel-like fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee-scroll flex items-center gap-16 px-4">
        {doublePartners.map((partner, index) => (
          <div 
            key={`${partner.name}-${index}`} 
            className="flex items-center justify-center h-10 w-28 transition-all duration-305"
          >
            <img
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
export default ScrollingLogos
