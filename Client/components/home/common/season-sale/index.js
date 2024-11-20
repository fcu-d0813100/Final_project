import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.scss';

const BestSeller = () => {
  // State to track window width
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial window width
    handleResize();

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if window width is less than 1000px
  const isMobile = windowWidth < 1000;

  return (
    <Link href='/product/product-list'>
      <div className={` ${styles.bestSeller} ${isMobile ? styles.greenBag : ''}`}>
        <Image
          src={isMobile ? '/discount/season-sale.svg' : '/discount/season-sale1.svg'}
          alt="Discount image"
          width={1920}
          height={842}
          sizes="(max-width: 600px) 100vw, 600px"
          priority={true}
        />
      </div>
    </Link>
  );
};

export default BestSeller;
