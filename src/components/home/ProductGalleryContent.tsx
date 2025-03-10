import { useState, useEffect, useRef, useCallback } from 'react';
import Airtable from 'airtable';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BottomSheetExpandedCard from './BottomSheetExpandedCard';
import { ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  room: string;
  style: string;
  imageUrl: string;
  styleName?: string;
  additionalImages?: string[];
}

interface ProductGalleryContentProps {
  loadMoreCount?: number;
}

const ITEMS_PER_PAGE = 4; // Reduced for mobile optimization
const ITEMS_PER_ROW = 1; // Single column on mobile

const styleNames = [
  'Eclipse', 'Nova', 'Zenith', 'Vertex', 'Prism', 'Quantum', 'Nebula',
  'Aurora', 'Apex', 'Horizon', 'Celestial', 'Cosmos', 'Stellar', 'Galaxy'
];

const ProductGalleryContent: React.FC<ProductGalleryContentProps> = ({ loadMoreCount = 1 }) => {
  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for UI components
  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const styleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading
  const { ref: lazyLoadRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Define rooms and styles
  const rooms = [
    'Kitchen',
    'Living',
    'Dining',
    'Bedroom',
    'Lighting',
    'Bath',
    'Outdoor',
  ];
  const kitchenStyles = ['Modern', 'Traditional', 'Art Deco'];

  // Check for mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Basic GSAP for categories
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Simplified animation for mobile devices
    const animationDuration = isMobile ? 0.4 : 0.6;
    const animationStagger = isMobile ? 0.05 : 0.1;

    gsap.fromTo(
      categoryRefs.current,
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: animationDuration,
        stagger: animationStagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: categoryRefs.current[0],
          start: 'top 90%',
        },
      }
    );

    if (selectedRoom === 'Kitchen') {
      gsap.fromTo(
        styleRefs.current,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: animationDuration,
          stagger: animationStagger,
          ease: 'power2.out',
        }
      );
    }
  }, [selectedRoom, isMobile]);

  // Load more content when loadMoreCount changes or when inView triggers
  useEffect(() => {
    if (projects.length > 0) {
      let filtered = [...projects];
      
      if (selectedRoom !== 'all') {
        filtere