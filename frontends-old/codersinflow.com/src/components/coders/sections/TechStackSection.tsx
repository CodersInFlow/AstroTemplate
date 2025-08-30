import React, { useRef } from 'react';
import TechSection from '../TechSection';

const TechStackSection: React.FC = () => {
  const techSectionRef = useRef<HTMLDivElement>(null);
  
  return <TechSection techSectionRef={techSectionRef} />;
};

export default TechStackSection;