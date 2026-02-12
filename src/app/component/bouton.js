import React from 'react';

const Bouton = ({ 
  title, 
  onClick, 
  icon: Icon,      // Prop pour passer une icône (ex: Lucide)
  svgCustom,       // Prop pour passer un SVG brut (comme ton Discord)
  bold = false,    // Optionnel : gras ou non
  className = "",
  href = "#"        // Optionnel : pour transformer en lien 
}) => {
  
  // Style exact de ton exemple
  const baseStyles = `
    flex items-center justify-center 
    bg-white dark:bg-neutral-800 
    border border-gray-300 dark:border-neutral-700 
    rounded-lg shadow-md 
    px-6 py-2 
    text-sm text-gray-800 dark:text-gray-200 
    hover:bg-gray-100 dark:hover:bg-neutral-700 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 
    transition-all duration-200 active:scale-95
  `;

  const fontWeight = bold ? "font-bold" : "font-medium";

  return (
    <button onClick={onClick} className={`${baseStyles} ${fontWeight} ${className}`}>
      
      {/* Rendu du SVG custom (comme le logo Discord) */}
      {svgCustom && (
        <div className="h-6 w-6 mr-2 flex items-center justify-center">
          {svgCustom}
        </div>
      )}

      {/* Rendu d'une icône de librairie (si passée) */}
      {Icon && !svgCustom && <Icon className="h-5 w-5 mr-2" />}

      <span>{title}</span>
    </button>
  );
};

export default Bouton;