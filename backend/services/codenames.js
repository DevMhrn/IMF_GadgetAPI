// backend/services/codenames.js
const codenames = [
    'Darkmatter', 'Blackout', 'Overkill', 'Warpdrive', 'Nightshade',
    'Venomstrike', 'Hellfire', 'Skybreaker', 'Obsidian', 'Wraith',
    'Spectre', 'Bloodmoon', 'Ragnarok', 'Netherblade', 'Doomhammer',
    'Vipersting', 'Cyberblade', 'Hailstorm', 'Deathclaw', 'Zero Hour',
    'Ironfang', 'Frostburn', 'Thunderclap', 'Silentstorm', 'Nightowl',
    'Rustfire', 'Shadowblade', 'Banshee', 'Widowmaker', 'Bulletstorm',
    'Dreadnought', 'Shatterpoint', 'Razorwind', 'Voidstalker', 'Rampage',
    'Havoc', 'Grimreaper', 'Phantomstrike', 'Scorpion', 'Nightcrawler',
    'Bloodhound', 'Blackhole', 'Terminus', 'Inferno', 'Deadlock',
    'Flashpoint', 'Oblivion', 'Catalyst', 'Quicksilver', 'Revenant',
    'Nightingale','Kraken','Phoenix','Valkyrie','Shadowstrike',
    'Thunderbolt','Ironclad','Ghostwalker','Voidreaver','Starfall','Frostbite',
    'Solarflare','Moonshadow','Stormbringer','Earthshaker','Lightningstrike',
    'Firestorm', 'Aurora','Serenity','Nebula','Aether','Cosmos'
  ];
  
 const generateCodename = () => {
    const randomIndex = Math.floor(Math.random() * codenames.length);
    return codenames[randomIndex];
  };

export default generateCodename;