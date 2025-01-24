// backend/services/codenames.js
const codenames = [
    'Nightingale',
    'Kraken',
    'Phoenix',
    'Valkyrie',
    'Shadowstrike',
    'Thunderbolt',
    'Ironclad',
    'Ghostwalker',
    'Voidreaver',
    'Starfall',
    'Frostbite',
    'Solarflare',
    'Moonshadow',
    'Stormbringer',
    'Earthshaker',
  ];
  
 const generateCodename = () => {
    const randomIndex = Math.floor(Math.random() * codenames.length);
    return codenames[randomIndex];
  };

export default generateCodename;