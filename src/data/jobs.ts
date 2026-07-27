import blacksmithImg from '../assets/jobs/blacksmith.png';
import alchemistImg from '../assets/jobs/alchemist.png';
import cookImg from '../assets/jobs/cook.png';
import farmerImg from '../assets/jobs/farmer.png';
import diverImg from '../assets/jobs/diver.png';

export interface Job {
  id: string;
  name: string;
  accent: string;
  img: string;
}

export const JOBS: Job[] = [
  { id: 'blacksmith', name: '대장장이', accent: '#ff6a3d', img: blacksmithImg },
  { id: 'alchemist', name: '연금술사', accent: '#a06bff', img: alchemistImg },
  { id: 'cook', name: '요리사', accent: '#ff8a3d', img: cookImg },
  { id: 'farmer', name: '농부', accent: '#7bc24a', img: farmerImg },
  { id: 'diver', name: '다이버', accent: '#3fa9f5', img: diverImg },
];
