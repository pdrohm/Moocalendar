import React, { useState } from 'react';

interface IconSelectorProps {
  currentIcon: string;
  onIconSelect: (icon: string) => void;
  onClose: () => void;
}

const ICON_CATEGORIES = {
  trabalho: ['💼', '📝', '📊', '📈', '💻', '📞', '✅', '🎯', '💡', '🔍'],
  casa: ['🏠', '🛒', '🍽️', '🧹', '🛏️', '🚿', '🔧', '🔑', '📦', '🏡'],
  saude: ['💪', '🏃', '🧘', '💊', '🏥', '🦷', '👁️', '🩺', '❤️', '🧠'],
  lazer: ['🎵', '🎨', '🎬', '📚', '🎮', '🎪', '🎭', '🎲', '🎸', '📷'],
  viagem: ['✈️', '🚗', '🚢', '🚂', '🏖️', '🗺️', '🧳', '📍', '🏕️', '🎒'],
  natureza: ['🌸', '🌺', '🌻', '🌿', '🍀', '🌳', '🌊', '🏔️', '☀️', '🌙'],
  comida: ['🍎', '🥗', '🍕', '☕', '🍰', '🥑', '🍓', '🥪', '🍜', '🧊'],
  premios: ['🏆', '🎖️', '🥇', '⭐', '🌟', '🎁', '🎉', '💎', '👑', '🏅']
};



export const IconSelector: React.FC<IconSelectorProps> = ({
  currentIcon,
  onIconSelect,
  onClose,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [activeCategory, setActiveCategory] = useState<keyof typeof ICON_CATEGORIES>('trabalho');

  const handleIconClick = (icon: string) => {
    setSelectedIcon(icon);
    onIconSelect(icon);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Escolher ícone</h4>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200 pb-3">
            {Object.keys(ICON_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as keyof typeof ICON_CATEGORIES)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors capitalize ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Icons Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2">
              {ICON_CATEGORIES[activeCategory].map((icon) => (
                <button
                  key={icon}
                  onClick={() => handleIconClick(icon)}
                  className={`p-3 rounded-lg hover:bg-gray-100 transition-colors text-xl ${
                    selectedIcon === icon ? 'bg-blue-100 ring-2 ring-blue-400' : ''
                  }`}
                  title={`Usar ícone ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 text-center">
            Escolha uma categoria e clique em um ícone
          </div>
        </div>
      </div>
    </>
  );
};
