"use client";

function moveGallery(direction: -1 | 1) {
  const gallery = document.getElementById("workplace-gallery");
  const firstSlide = gallery?.querySelector<HTMLElement>("[data-gallery-slide]");
  if (!gallery || !firstSlide) return;

  const styles = window.getComputedStyle(gallery);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
  const distance = firstSlide.getBoundingClientRect().width + gap;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gallery.scrollLeft += direction * distance;
    return;
  }

  gallery.scrollBy({ left: direction * distance, behavior: "smooth" });
}

export default function GalleryControls() {
  return (
    <div className="gallery-controls" role="group" aria-label="Photo gallery controls">
      <span>Scroll to browse</span>
      <button
        type="button"
        aria-label="Previous photo"
        aria-controls="workplace-gallery"
        onClick={() => moveGallery(-1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        type="button"
        aria-label="Next photo"
        aria-controls="workplace-gallery"
        onClick={() => moveGallery(1)}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
