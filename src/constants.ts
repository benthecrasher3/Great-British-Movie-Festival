import { Movie, FestivalEvent, FoodItem } from './types';

export const MOVIES: Movie[] = [
  {
    id: '1',
    title: "The King's Speech",
    director: 'Tom Hooper',
    year: 2010,
    genre: ['Biography', 'Drama', 'History'],
    rating: 8.0,
    description: 'The story of King George VI, his unexpected ascension to the throne of the British Empire in 1936, and the speech therapist who helped the unsure monarch overcome his stammer.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR2kp5ZvDM9eNwcfcxvabZdSmXa8JKXZcj5zAkUdZpR552XDyaaPvj2goNr3x57jic2Civ&s=10',
    trailerUrl: 'https://www.youtube.com/embed/t2PG9DnQVv0',
    color: '#003061', // British Council Blue
    starring: ['Colin Firth', 'Geoffrey Rush', 'Helena Bonham Carter'],
    awards: ['Best Picture (Academy Award)', 'Best Actor (Colin Firth)', 'Best Director'],
    quotes: [{ text: "I have a voice!", actor: "King George VI" }],
    locations: ['BFI Southbank', 'Odeon Luxe Leicester Square', 'Curzon Mayfair'],
    watchUrl: 'https://www.netflix.com',
    watchLocationName: 'Netflix'
  },
  {
    id: '2',
    title: 'Skyfall',
    director: 'Sam Mendes',
    year: 2012,
    genre: ['Action', 'Adventure', 'Thriller'],
    rating: 7.8,
    description: "James Bond's loyalty to M is tested when her past comes back to haunt her. When MI6 comes under attack, 007 must track down and destroy the threat, no matter how personal the cost.",
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3QjxC_sCvc7IixN0MjBoiflaEXbQMhtiS3_B55DFFX28_qvwAfNn9fkcsaUshdibolXaZpA&s=10',
    trailerUrl: 'https://www.youtube.com/embed/6kw1UVovByw',
    color: '#003061', // British Council Blue
    starring: ['Daniel Craig', 'Judi Dench', 'Javier Bardem'],
    awards: ['Best Original Song (Skyfall)', 'Best Sound Editing'],
    quotes: [{ text: "Sometimes the old ways are the best.", actor: "James Bond" }],
    locations: ['Savoy Cinema', 'Electric Cinema', 'Vue West End'],
    watchUrl: 'https://www.amazon.com/Skyfall-Daniel-Craig/dp/B00B2ZZHIO',
    watchLocationName: 'Amazon Prime'
  },
  {
    id: '3',
    title: 'Paddington 2',
    director: 'Paul King',
    year: 2017,
    genre: ['Adventure', 'Comedy', 'Family'],
    rating: 7.8,
    description: "Paddington, now happily settled with the Brown family and a popular member of the local community, picks up a series of odd jobs to buy the perfect present for his Aunt Lucy's 100th birthday, only for the gift to be stolen.",
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPnAQSVP5wMbfAUoZ28ziXe4-VAldjZgwp0YDGv1NnKCm9mX2ddq5V9wjr3QeUzKs7UjoXxQ&s=10',
    trailerUrl: 'https://www.youtube.com/embed/52x5HJ9H8DM',
    color: '#003061', // British Council Blue
    starring: ['Ben Whishaw', 'Hugh Grant', 'Sally Hawkins'],
    awards: ['BAFTA Nominated: Best British Film', 'Best Supporting Actor'],
    quotes: [{ text: "If we're kind and polite, the world will be right.", actor: "Paddington" }],
    locations: ['Cine Lumiere', 'Everyman Screen on the Green', 'Prince Charles Cinema'],
    watchUrl: 'https://player.bfi.org.uk',
    watchLocationName: 'BFI Player'
  },
  {
    id: '4',
    title: 'Trainspotting',
    director: 'Danny Boyle',
    year: 1996,
    genre: ['Drama'],
    rating: 8.1,
    description: 'Renton, deeply immersed in the Edinburgh drug scene, tries to clean up and get out, despite the allure of the drugs and influence of friends.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73ZKqvzqGpwEm93UDMIxVFfHFqIx8EBb0hYvdiS6oIWWtIAG1jtbAFYQ8QYFTd7-ejxwp&s=10',
    trailerUrl: 'https://www.youtube.com/embed/8LuxOYIpu-I',
    color: '#003061', // British Council Blue
    starring: ['Ewan McGregor', 'Ewen Bremner', 'Jonny Lee Miller'],
    awards: ['BAFTA Winner: Best Adapted Screenplay'],
    quotes: [{ text: "Choose life.", actor: "Mark Renton" }],
    locations: ['Cameo Cinema', 'Dominion Cinema Edinburgh', 'Filmhouse Edinburgh']
  },
  {
    id: '5',
    title: 'A Clockwork Orange',
    director: 'Stanley Kubrick',
    year: 1971,
    genre: ['Crime', 'Sci-Fi'],
    rating: 8.3,
    description: "In the future, a sadistic gang leader is imprisoned and volunteers for a conduct-aversion experiment, but it doesn't go as planned.",
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2VqM6HlFlNZQA9dP_tSgHBYIefZ6Ttbhk4eJHpfHBAWj1ScaRit6yWHCsEAuN15g-I6RU&s=10',
    trailerUrl: 'https://www.youtube.com/embed/T54uZPI4Z8A',
    color: '#003061', // British Council Blue
    starring: ['Malcolm McDowell', 'Patrick Magee', 'Adrienne Corri'],
    awards: ['NYFCC: Best Film', 'Best Director'],
    quotes: [{ text: "It's funny how the colors of the real world only seem really real when you viddy them on the screen.", actor: "Alex" }],
    locations: ['The Ritzy', 'Rio Cinema', 'Genesis Cinema']
  },
  {
    id: '6',
    title: 'Slumdog Millionaire',
    director: 'Danny Boyle',
    year: 2008,
    genre: ['Drama', 'Romance'],
    rating: 8.0,
    description: 'A Mumbai teenager reflects on his life after being accused of cheating on the Indian version of "Who Wants to be a Millionaire?".',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI2mjeefLUb0iJtbDvSg6XM_0OG9smKknJCDi9k2goX-d5YIwAvrI8IJjXtDTlB3TBaowK&s=10',
    trailerUrl: 'https://www.youtube.com/embed/AIzbwV7on6Q',
    color: '#003061', // British Council Blue
    starring: ['Dev Patel', 'Frieda Pinto', 'Anil Kapoor'],
    awards: ['8 Academy Awards including Best Picture', 'Best Director'],
    quotes: [{ text: "It is written.", actor: "Jamal Malik" }],
    locations: ['Showcase Cinema', 'Tyneside Cinema', 'Showroom Cinema']
  },
  {
    id: '7',
    title: 'Lawrence of Arabia',
    director: 'David Lean',
    year: 1962,
    genre: ['Adventure', 'Biography', 'Drama'],
    rating: 8.3,
    description: 'The story of T.E. Lawrence, the English officer who successfully united and led the diverse, often warring, Arab tribes during World War I in order to fight the Turks.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjy1wGMakBFeojw_VBTiEG4Q4i6s8S8r_S-1Ip0Ys36oY-EnQsXnnPmqeoCQlwLajEOpS4&s=10',
    trailerUrl: 'https://www.youtube.com/embed/_AznzZAlwVA',
    color: '#003061', // British Council Blue
    starring: ['Peter O\'Toole', 'Alec Guinness', 'Anthony Quinn'],
    awards: ['7 Academy Awards including Best Picture', 'Best Director'],
    quotes: [{ text: "The trick, William Potter, is not minding that it hurts.", actor: "T.E. Lawrence" }],
    locations: ['BFI IMAX', 'Science Museum Cinema', 'Barbican Centre']
  },
  {
    id: '8',
    title: 'Goldfinger',
    director: 'Guy Hamilton',
    year: 1964,
    genre: ['Action', 'Adventure', 'Thriller'],
    rating: 7.7,
    description: "While investigating a gold magnate's smuggling, James Bond uncovers a plot to contaminate the Fort Knox gold reserve.",
    imageUrl: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3374_p_v8_as.jpg',
    trailerUrl: 'https://www.youtube.com/embed/MA65V-oLKa8',
    color: '#003061', // British Council Blue
    starring: ['Sean Connery', 'Gert Fröbe', 'Honor Blackman'],
    awards: ['Academy Award: Best Sound Effects'],
    quotes: [{ text: "A martini. Shaken, not stirred.", actor: "James Bond" }, { text: "No, Mr. Bond, I expect you to die!", actor: "Auric Goldfinger" }],
    locations: ['Chichester Cinema', 'Duke of York’s Picturehouse', 'Regent Street Cinema']
  },
  {
    id: '9',
    title: 'Monty Python and the Holy Grail',
    director: 'Terry Gilliam, Terry Jones',
    year: 1975,
    genre: ['Adventure', 'Comedy', 'Fantasy'],
    rating: 8.2,
    description: 'King Arthur and his Knights of the Round Table embark on a surreal search for the Holy Grail, encountering many silly obstacles.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNsBuU4tpA_ap_kNzP0k_N_e3AiaF3CNYc9X3kdDHPzthAd42HqeXMKeBdKAxJK4kWHq7aOQ&s=10',
    trailerUrl: 'https://www.youtube.com/embed/urRkGvhXc8w',
    color: '#003061', // British Council Blue
    starring: ['Graham Chapman', 'John Cleese', 'Terry Gilliam'],
    awards: ['Empire Award: Best British Comedy'],
    quotes: [{ text: "It's just a flesh wound.", actor: "The Black Knight" }],
    locations: ['Lighthouse Poole', 'Chapter Arts Centre', 'Glasgow Film Theatre']
  },
  {
    id: '10',
    title: 'Brief Encounter',
    director: 'David Lean',
    year: 1945,
    genre: ['Drama', 'Romance'],
    rating: 8.0,
    description: 'Meeting a stranger in a railway station, a woman is tempted to cheat on her husband.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4XU9X1rTJV745dk_hEQ1ar_iF3s_3pAWxFMFVVITUD-dY6wU0-TKeaHHeMLTCYQsFlAsQNQ&s=10',
    trailerUrl: 'https://www.youtube.com/embed/PPZyNzSrm2Y',
    color: '#003061', // British Council Blue
    starring: ['Celia Johnson', 'Trevor Howard', 'Stanley Holloway'],
    awards: ['Cannes Film Festival: Grand Prix'],
    quotes: [{ text: "I've fallen in love. I'm an ordinary woman. I didn't think such violent things could happen to ordinary people.", actor: "Laura Jesson" }],
    locations: ['National Science and Media Museum', 'Derby QUAD', 'Watershed Bristol']
  },
  {
    id: '11',
    title: 'The Bridge on the River Kwai',
    director: 'David Lean',
    year: 1957,
    genre: ['Adventure', 'Drama', 'War'],
    rating: 8.1,
    description: 'British POWs are forced to build a railway bridge across the river Kwai for their Japanese captors, not knowing that the allied forces are planning to destroy it.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1PjKyaxnZMq8kY6dtuunXefsWpUUv-NA0vdcOJOfHjSIP_xjYaQPI03jTn0GDSj79sDAV&s=10',
    trailerUrl: 'https://www.youtube.com/embed/RlC7XBayj0s',
    color: '#003061', // British Council Blue
    starring: ['William Holden', 'Alec Guinness', 'Jack Hawkins'],
    awards: ['7 Academy Awards including Best Picture'],
    quotes: [{ text: "Madness! Madness!", actor: "Major Clipton" }],
    locations: ['The Phoenix Leicester', 'Belmont Filmhouse', 'Dundee Contemporary Arts']
  },
  {
    id: '12',
    title: 'The Third Man',
    director: 'Carol Reed',
    year: 1949,
    genre: ['Film-Noir', 'Mystery', 'Thriller'],
    rating: 8.1,
    description: 'Pulp novelist Holly Martins travels to shadowy, postwar Vienna, only to find himself investigating the mysterious death of an old friend, Harry Lime.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8wKu_vu1fcGu1K-uEK99MJggp8a_aZ003dnJZh5N5LXgrBv3tpZPwahrcDyh31ykLTY4_&s=10',
    trailerUrl: 'https://www.youtube.com/embed/r9yyDEDGlr0',
    color: '#003061', // British Council Blue
    starring: ['Orson Welles', 'Joseph Cotten', 'Alida Valli'],
    awards: ['BAFTA Winner: Best British Film', 'Cannes: Grand Prix'],
    quotes: [{ text: "In Italy, for thirty years under the Borgias, they had warfare, terror, murder and bloodshed, but they produced Michelangelo, Leonardo da Vinci and the Renaissance.", actor: "Harry Lime" }],
    locations: ['Warwick Arts Centre', 'Eden Court', 'Macrobert Arts Centre']
  },
  {
    id: '13',
    title: 'Withnail and I',
    director: 'Bruce Robinson',
    year: 1987,
    genre: ['Comedy', 'Drama'],
    rating: 7.6,
    description: 'In 1969, two unemployed actors, Withnail and Marwood, decide to leave their squalid London flat for a holiday in the country, which proves to be anything but relaxing.',
    imageUrl: 'https://m.media-amazon.com/images/I/61w8YcBqKiL._AC_UF894,1000_QL80_.jpg',
    trailerUrl: 'https://www.youtube.com/embed/PCJ2gzSeTdE',
    color: '#003061', // British Council Blue
    starring: ['Richard E. Grant', 'Paul McGann', 'Richard Griffiths'],
    awards: ['Empire Award: Best British Actor'],
    quotes: [{ text: "We want the finest wines available to humanity. And we want them here, and we want them now!", actor: "Withnail" }],
    locations: ['Penrith Alhambra', 'Keswick Alhambra', 'Zeffirellis']
  },
  {
    id: '14',
    title: 'Sense and Sensibility',
    director: 'Ang Lee',
    year: 1995,
    genre: ['Drama', 'Romance'],
    rating: 7.7,
    description: 'Rich Mr. Dashwood dies, leaving his second wife and her three daughters poor by the rules of inheritance. The story follows the sisters as they seek love and financial security.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/91/S%26S_DVD_Cover_2008.jpg/250px-S%26S_DVD_Cover_2008.jpg',
    trailerUrl: 'https://www.youtube.com/embed/2WGq2Rbs1Qg',
    color: '#003061', // British Council Blue
    starring: ['Emma Thompson', 'Kate Winslet', 'Alan Rickman'],
    awards: ['Academy Award: Best Adapted Screenplay', 'BAFTA: Best Film'],
    quotes: [{ text: "My heart is, and always will be, yours.", actor: "Edward Ferrars" }],
    locations: ['Picturehouse Central', 'Hackney Picturehouse', 'Crouch End Picturehouse']
  }
];

export const EVENTS: FestivalEvent[] = [
  {
    id: 'e1',
    title: 'Opening Night Gala',
    date: 'June 15, 2026',
    time: '19:00 — 23:30',
    location: 'CGV Grand Indonesia, Jakarta',
    category: 'Gala Screenings',
    description: 'A celebration of modern British cinema featuring red carpet arrivals and a preview screening, sharing the British way of life with Indonesia.'
  },
  {
    id: 'e2',
    title: 'Boyle Retrospective',
    date: 'June 18, 2026',
    time: '14:00 — 21:00',
    location: 'Tunjungan Plaza, Surabaya',
    category: 'Director Spotlight',
    description: 'A deep dive into the works of legendary British director Danny Boyle, including Q&A sessions for the Indonesian film community.'
  },
  {
    id: 'e3',
    title: 'Outdoor Cinema: British Classics',
    date: 'June 22, 2026',
    time: '20:30 — 00:00',
    location: 'The Parkfront, Bandung',
    category: 'Public Outreach',
    description: 'Enjoy iconic British films under the stars in a beautiful historic setting, exploring British culture through film.'
  }
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Artisan Salted Popcorn',
    price: 45000,
    description: 'Freshly popped in coconut oil with hand-harvested sea salt.',
    imageUrl: 'https://www.recipetineats.com/tachyon/2020/11/Slightly-sweet-and-salty-popcorn_square.jpg',
    category: 'Snacks'
  },
  {
    id: 'f2',
    name: 'Truffle & Parmesan Fries',
    price: 65000,
    description: 'Crispy skin-on fries tossed in truffle oil and aged parmesan.',
    imageUrl: 'https://lindseyeatsla.com/wp-content/uploads/2025/04/parmesan-truffle-fries-1.jpg',
    category: 'Snacks'
  },
  {
    id: 'f3',
    name: 'English Garden G&T',
    price: 125000,
    description: 'Premium craft gin with elderflower tonic, cucumber, and fresh mint.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVb7g940ww51quAngEEfqlpP5P_wmowIcnlg&s',
    category: 'Drinks'
  },
  {
    id: 'f4',
    name: 'Director’s Cut Combo',
    price: 180000,
    description: 'Large popcorn, any beverage, and a selection of gourmet chocolates.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAVtqEq8eKYs-SUDcRu_cAP8sfZjBmAiGZ4g&s',
    category: 'Combos'
  }
];
