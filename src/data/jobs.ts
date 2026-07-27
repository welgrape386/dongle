import blacksmithImg from '../assets/jobs/blacksmith.png';
import alchemistImg from '../assets/jobs/alchemist.png';
import cookImg from '../assets/jobs/cook.png';
import farmerImg from '../assets/jobs/farmer.png';
import diverImg from '../assets/jobs/diver.png';

import blacksmithRoom from '../assets/rooms/blacksmith.png';
import alchemistRoom from '../assets/rooms/alchemist.png';
import cookRoom from '../assets/rooms/chef.png';
import farmerRoom from '../assets/rooms/farmer.png';
import diverRoom from '../assets/rooms/diver.png';

export interface Job {
  id: string;
  name: string;
  accent: string;
  img: string;
  roomImg: string;
  statLabel: string; // matches the bottom UI bar convention (FARM / COOK / ALCHEMY / SMITH / DIVE)
}

export const JOBS: Job[] = [
  { id: 'blacksmith', name: '대장장이', accent: '#ff6a3d', img: blacksmithImg, roomImg: blacksmithRoom, statLabel: 'SMITH' },
  { id: 'alchemist', name: '연금술사', accent: '#a06bff', img: alchemistImg, roomImg: alchemistRoom, statLabel: 'ALCHEMY' },
  { id: 'cook', name: '요리사', accent: '#ff8a3d', img: cookImg, roomImg: cookRoom, statLabel: 'COOK' },
  { id: 'farmer', name: '농부', accent: '#7bc24a', img: farmerImg, roomImg: farmerRoom, statLabel: 'FARM' },
  { id: 'diver', name: '다이버', accent: '#3fa9f5', img: diverImg, roomImg: diverRoom, statLabel: 'DIVE' },
];
