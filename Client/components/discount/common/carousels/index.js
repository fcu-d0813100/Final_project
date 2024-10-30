import { Carousel } from 'react-bootstrap';
import { useState } from 'react';
import styles from './index.module.scss';

function CustomCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const images = [
        { src: '/discount/nars-1920.svg', alt: 'First slide'},
        { src: '/discount/nars-1920.svg', alt: 'Second slide'},
        { src: '/discount/nars-1920.svg', alt: 'Third slide'},
    ];

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            {images.map((image, idx) => (
                <Carousel.Item key={idx}>
                    <img
                        className="d-block w-100"
                        src={image.src}
                        alt={image.alt}
                    />
                    <Carousel.Caption>
                        <h3>{image.label}</h3>
                        <p>{image.caption}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CustomCarousel;
