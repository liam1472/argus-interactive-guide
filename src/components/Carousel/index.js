import React, { useState, useRef, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function Carousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Call useBaseUrl for ALL slides to ensure consistent hook calls
  // This prevents "Rendered more hooks than during the previous render" errors
  // We MUST call useBaseUrl the same number of times every render
  const imageUrls = slides.map((slide) => {
    // Always call useBaseUrl - use the image path if it exists, otherwise empty string
    return useBaseUrl(slide.image || '');
  });
  
  const processedSlides = slides.map((slide, index) => ({
    ...slide,
    imageUrl: slide.image ? imageUrls[index] : null
  }));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % processedSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + processedSlides.length) % processedSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + processedSlides.length) % processedSlides.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % processedSlides.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [processedSlides.length]);

  const currentSlideData = processedSlides[currentSlide];

  return (
    <div className={styles.carouselContainer}>
      <div 
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main slide content */}
        <div className={styles.slideContent}>
          {currentSlideData.imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={currentSlideData.imageUrl}
                alt={currentSlideData.title || 'Slide image'}
                className={styles.slideImage}
              />
            </div>
          )}
          
          <div className={styles.textContent}>
            {currentSlideData.title && (
              <h2 className={styles.slideTitle}>{currentSlideData.title}</h2>
            )}
            {currentSlideData.content && (
              <div className={`${styles.slideText} ${currentSlideData.warning ? styles.warningHighlight : ''}`}>
                {currentSlideData.content}
              </div>
            )}
            {currentSlideData.steps && (
              <ul className={currentSlideData.noNumbers ? styles.stepsListNoNumbers : styles.stepsList}>
                {currentSlideData.steps.map((step, idx) => (
                  <li key={idx} className={styles.stepItem}>{step}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            ← Previous
          </button>
          
          <div className={styles.dots}>
            {processedSlides.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === currentSlide ? styles.activeDot : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          <button
            className={styles.navButton}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            Next →
          </button>
        </div>

        {/* Slide counter */}
        <div className={styles.counter}>
          {currentSlide + 1} / {processedSlides.length}
        </div>
      </div>
    </div>
  );
}

