'use client';
import SmartImage from '@components/SmartImage';
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
                <SmartImage
                key={i}
                src={item}
                alt={`Illustration ${i + 1} sur ${images.length}`}
                width={1200}
                height={800}
                sizes="(max-width: 1080px) 100vw, 1080px"
                priority={i === 0}
                />
                ))}
    </Slider>
    {!images.length && (<div className={styles.empty}>Pas d'illustration
    </div>)}
    </>
    );
}