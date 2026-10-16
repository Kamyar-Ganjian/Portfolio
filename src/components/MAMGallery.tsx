import Image from "next/image";
import { galleryImages } from "@/data/portfolio";
import GalleryControls from "@/components/GalleryControls";

export default function MAMGallery() {
  return (
    <section
      className="personal-gallery"
      id="more-than-the-workplace"
      aria-labelledby="gallery-title"
    >
      <div className="gallery-heading">
        <div>
          <p className="eyebrow">A personal note</p>
          <h2 id="gallery-title">
            More than
            <br />
            <em>the workplace.</em>
          </h2>
        </div>
        <p>
          A few memories from the places I worked, the problems we solved, and
          the people I shared the journey with. The friendships made along the
          way matter just as much as the work.
        </p>
      </div>

      <div className="gallery-slider-toolbar">
        <GalleryControls />
      </div>

      <div
        className="gallery-slider"
        id="workplace-gallery"
        role="region"
        aria-label="Photo gallery: memories from working at MAM"
        tabIndex={0}
      >
        <div className="gallery-track">
          {galleryImages.map((image, index) => (
            <figure
              className="gallery-item"
              key={image.src}
              data-gallery-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${galleryImages.length}: ${image.caption}`}
            >
              <div className="gallery-photo">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 760px) 78vw, 620px"
                />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
