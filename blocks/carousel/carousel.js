/**
 * Carousel Block logic for NICO Life.
 * Features: Fade transition, autoplay, dots navigation.
 */

function updateActiveSlide(block, slideIndex) {
    const slides = block.querySelectorAll('.carousel-slide');
    const dots = block.querySelectorAll('.carousel-dot');

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === slideIndex);
        slide.setAttribute('aria-hidden', i !== slideIndex);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
        dot.setAttribute('aria-selected', i === slideIndex);
    });
}

function showNextSlide(block) {
    const slides = block.querySelectorAll('.carousel-slide');
    const activeSlide = block.querySelector('.carousel-slide.active');
    let nextIndex = [...slides].indexOf(activeSlide) + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    updateActiveSlide(block, nextIndex);
}

export default function decorate(block) {
    const slides = [...block.children];
    block.textContent = '';

    const slidesContainer = document.createElement('div');
    slidesContainer.classList.add('carousel-slides-container');

    const dotsContainer = document.createElement('div');
    dotsContainer.classList.add('carousel-dots-container');

    slides.forEach((row, i) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        if (i === 0) slide.classList.add('active');
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-hidden', i !== 0);

        // Col 1: Background Image
        const imgCol = row.children[0];
        if (imgCol) {
            const img = imgCol.querySelector('img');
            if (img) {
                slide.style.backgroundImage = `url(${img.src})`;
            }
        }

        // Col 2: Content
        const contentCol = row.children[1];
        if (contentCol) {
            const content = document.createElement('div');
            content.classList.add('carousel-slide-content');
            content.innerHTML = contentCol.innerHTML;

            // Wrap content to align left center
            const inner = document.createElement('div');
            inner.classList.add('carousel-slide-inner');
            inner.append(content);
            slide.append(inner);

            // Style buttons
            content.querySelectorAll('a').forEach((link) => {
                link.classList.add('button');
                if (link.textContent.toLowerCase().includes('more')) {
                    link.classList.add('secondary');
                }
            });
        }

        slidesContainer.append(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0);
        dot.addEventListener('click', () => updateActiveSlide(block, i));
        dotsContainer.append(dot);
    });

    block.append(slidesContainer);
    block.append(dotsContainer);

    // Autoplay
    let intervalId;
    const startAutoplay = () => {
        intervalId = setInterval(() => showNextSlide(block), 6000);
    };
    const stopAutoplay = () => clearInterval(intervalId);

    // Pause on hover
    block.addEventListener('mouseenter', stopAutoplay);
    block.addEventListener('mouseleave', startAutoplay);

    // Intersection Observer to pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) startAutoplay();
            else stopAutoplay();
        });
    }, { threshold: 0.5 });
    observer.observe(block);
}
