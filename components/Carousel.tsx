'use client';
import { Carousel as Slider} from "react-responsive-carousel";
import styles from "@styles/components/Carousel.module.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface CarouselProps {
    images: string[];
}

export default function Carousel({ images }: CarouselProps) {
    return(
    <>
    <Slider
        className={styles.slider}
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        >
        {images && images.map((item: string, i: number) => (
                <img
                key={i}
                src={item}
                alt={`illustration ${i}`}
                />
                ))}
    </Slider>
    {!images.length && (<div className={styles.empty}>Pas d'illustration
    </div>)}
    </>
    );
}