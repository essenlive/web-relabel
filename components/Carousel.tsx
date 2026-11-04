'use client';
import SmartImage from '@components/SmartImage';
import { Carousel as Slider} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface CarouselProps {
    images: string[];
}

export default function Carousel({ images }: CarouselProps) {
    return(
    <>
    <Slider
        className="size-full object-cover [&_div]:size-full [&_ul]:size-full [&_li]:size-full [&_img]:size-full [&_img]:object-cover"
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
    {!images.length && (<div className="flex size-full items-center justify-center bg-[linear-gradient(45deg,hsl(271.9,15%,42%)_0%,hsl(17,87.6%,77.8%)_100%)] text-xl text-white opacity-50">Pas d'illustration</div>)}
    </>
    );
}