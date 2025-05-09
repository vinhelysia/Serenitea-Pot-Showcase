// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Modified Image modal functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentGalleryItem = null;
let currentImageIndex = 0;

function showModalImage(item, index) {
    const images = item.querySelectorAll('.slide, img');
    currentImageIndex = index;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

function nextModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide, img');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

function prevModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide, img');
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

galleryItems.forEach(item => {
    const images = item.querySelectorAll('.slide, img');
    images.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            currentGalleryItem = item;
            showModalImage(item, index);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
});

// Add keyboard event listener
window.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft' || e.key === '<') {
            prevModalImage();
        } else if (e.key === 'ArrowRight' || e.key === '>') {
            nextModalImage();
        } else if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Prevent double-tap zoom on navigation elements
    document.querySelectorAll('.nav-btn, .dot').forEach(el => {
        el.addEventListener('touchend', e => e.preventDefault());
    });
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const slides = item.querySelectorAll('.slide');
        const slideshowContainer = item.querySelector('.slideshow-container');
        const prevBtn = item.querySelector('.prev-btn');
        const nextBtn = item.querySelector('.next-btn');
        let currentSlide = 0;
        let slideshowInterval;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isSwiping = false;
        
        // Create dots navigation
        const dotsNav = document.createElement('div');
        dotsNav.className = 'dots-nav';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(index);
            });
            dotsNav.appendChild(dot);
        });
        slideshowContainer.appendChild(dotsNav);
        
        // Function to show a specific slide
        function showSlide(index) {
            requestAnimationFrame(() => {
                slides.forEach(slide => slide.classList.remove('active'));
                slides[index].classList.add('active');
                
                // Update dots
                dotsNav.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                currentSlide = index;
            });
        }
        
        // Enhanced touch handling
        slideshowContainer.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });
        
        slideshowContainer.addEventListener('touchmove', e => {
            if (isSwiping) return;
            
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
            
            // Calculate distance and angle
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
            
            // If horizontal swipe (angle < 45 degrees), prevent vertical scroll
            if (angle < 45) {
                e.preventDefault();
                isSwiping = true;
            }
        }, { passive: false });
        
        slideshowContainer.addEventListener('touchend', e => {
            if (!isSwiping) return;
            
            const deltaX = touchEndX - touchStartX;
            const swipeThreshold = window.innerWidth * 0.15; // 15% of screen width
            
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        });
        
        // Function to go to next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Function to go to previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
          // Navigation button click handlers
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            clearInterval(slideshowInterval);
        }, true);
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            clearInterval(slideshowInterval);
        }, true);

        // Add touch event listeners specifically for buttons
        prevBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            clearInterval(slideshowInterval);
        }, true);
        
        nextBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            clearInterval(slideshowInterval);
        }, true);
        
        // Initialize first slide
        showSlide(currentSlide);
        
        // Start slideshow on hover
        item.addEventListener('mouseenter', () => {
            slideshowInterval = setInterval(nextSlide, 3000);
        });
        
        // Stop slideshow when mouse leaves
        item.addEventListener('mouseleave', () => {
            clearInterval(slideshowInterval);
        });
    });
});

// Modal enhancements
const modalContent = document.querySelector('.modal-content');

// Add navigation buttons to modal
const modalPrevBtn = document.createElement('button');
modalPrevBtn.className = 'nav-btn prev-btn';
modalPrevBtn.innerHTML = '&lt;';
modalContent.appendChild(modalPrevBtn);

const modalNextBtn = document.createElement('button');
modalNextBtn.className = 'nav-btn next-btn';
modalNextBtn.innerHTML = '&gt;';
modalContent.appendChild(modalNextBtn);

// Add dots navigation to modal
const modalDotsNav = document.createElement('div');
modalDotsNav.className = 'dots-nav';
modalContent.appendChild(modalDotsNav);

function updateModalDots(currentIndex, totalSlides) {
    modalDotsNav.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => showModalImage(currentGalleryItem, i));
        modalDotsNav.appendChild(dot);
    }
}

// Add modal swipe support
let modalTouchStartX = 0;
let modalTouchStartY = 0;
let isModalSwiping = false;

modalContent.addEventListener('touchstart', e => {
    modalTouchStartX = e.touches[0].clientX;
    modalTouchStartY = e.touches[0].clientY;
    isModalSwiping = false;
}, { passive: true });

modalContent.addEventListener('touchmove', e => {
    if (isModalSwiping) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - modalTouchStartX;
    const deltaY = touchY - modalTouchStartY;
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
    
    if (angle < 45) {
        e.preventDefault();
        isModalSwiping = true;
    }
}, { passive: false });

modalContent.addEventListener('touchend', e => {
    if (!isModalSwiping) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - modalTouchStartX;
    const swipeThreshold = window.innerWidth * 0.15;
    
    if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
            prevModalImage();
        } else {
            nextModalImage();
        }
    }
});

// Update modal navigation button handlers
modalPrevBtn.addEventListener('click', prevModalImage);
modalNextBtn.addEventListener('click', nextModalImage);

document.querySelectorAll('.replica-id').forEach(span => {
    span.addEventListener('click', function(e) {
        const id = this.dataset.id;
        navigator.clipboard.writeText(id).then(() => {
            // Optional: show feedback
            this.textContent = "Copied!";
            setTimeout(() => {
                this.textContent = id;
            }, 1000);
        });
        e.stopPropagation(); // Prevent modal from opening if inside image
    });
});
