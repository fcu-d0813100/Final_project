import { Carousel } from 'react-bootstrap';
import { useState } from 'react';
import Link from 'next/link';
import styles from './index.module.scss';


function CustomCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const images = [
        { src: '/discount/nars-1920.svg', alt: 'First slide', link: '/discount/nars' },
        { src: '/discount/nars2-1920.svg', alt: 'Second slide', link: '/discount/nars2' },
        { src: '/discount/ysl-1920.svg', alt: 'Third slide', link: '/discount/ysl' },
        { src: '/discount/bb-1920.svg', alt: 'Third slide', link: '/discount/bb' },
    ];

    return (
        <Carousel className={styles.carousel} activeIndex={index} onSelect={handleSelect}>
            {images.map((image, idx) => (
                <Carousel.Item key={idx}>
                    <Link href={image.link} passHref>
                        <img
                            className="d-block w-100"
                            src={image.src}
                            alt={image.alt}
                        />
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CustomCarousel;
