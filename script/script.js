const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentGalleryItem = null;
let currentImageIndex = 0;

function showModalImage(item, index) {
    const images = item.querySelectorAll('.slide img');
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
    const images = currentGalleryItem.querySelectorAll('.slide img');
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
    const images = currentGalleryItem.querySelectorAll('.slide img');
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
    const images = item.querySelectorAll('.slide img');
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
            navLinks.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const slides = item.querySelectorAll('.slide');
        const slideshowContainer = item.querySelector('.slideshow-container');
        const prevBtn = item.querySelector('.prev-btn');
        const nextBtn = item.querySelector('.next-btn');
        let currentSlide = 0;
        let slideshowInterval;
        
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
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            dotsNav.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slideshowContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshowContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
            clearInterval(slideshowInterval);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
            clearInterval(slideshowInterval);
        });
        
        showSlide(currentSlide);
        
        item.addEventListener('mouseenter', () => {
            slideshowInterval = setInterval(nextSlide, 3000);
        });
        
        item.addEventListener('mouseleave', () => {
            clearInterval(slideshowInterval);
        });
    });
    
    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('load', () => {
            img.parentElement.classList.remove('loading');
        });
        img.addEventListener('error', () => {
            img.parentElement.classList.remove('loading');
            img.parentElement.classList.add('error');
        });
        if (img.complete) {
            if (img.naturalWidth > 0) {
                img.parentElement.classList.remove('loading');
            } else {
                img.parentElement.classList.add('error');
            }
        }
    });

    // Replica ID copy functionality
    document.querySelectorAll('.replica-id').forEach(span => {
        span.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const id = span.dataset.id;
            // Fallback for older browsers
            const copyText = (text) => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        return Promise.resolve();
                    } catch (err) {
                        return Promise.reject(err);
                    } finally {
                        document.body.removeChild(textarea);
                    }
                }
            };

            copyText(id).then(() => {
                // Show toast notification
                const toast = document.createElement('div');
                toast.className = 'toast-notification';
                toast.textContent = 'Copied Replica ID!';
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.remove();
                }, 2000);

                // Update span text for additional feedback
                span.textContent = 'Copied!';
                setTimeout(() => {
                    span.textContent = id;
                }, 1000);
            }).catch(() => {
                // Show error toast
                const toast = document.createElement('div');
                toast.className = 'toast-notification error';
                toast.textContent = 'Failed to copy Replica ID';
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.remove();
                }, 2000);
            });
        });
    });
});

const modalContent = document.querySelector('.modal-content');
const modalPrevBtn = document.createElement('button');
modalPrevBtn.className = 'nav-btn prev-btn';
modalPrevBtn.innerHTML = '<';
modalContent.appendChild(modalPrevBtn);

const modalNextBtn = document.createElement('button');
modalNextBtn.className = 'nav-btn next-btn';
modalNextBtn.innerHTML = '>';
modalContent.appendChild(modalNextBtn);

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

let modalTouchStartX = 0;
let modalTouchEndX = 0;

modalContent.addEventListener('touchstart', e => {
    modalTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modalContent.addEventListener('touchend', e => {
    modalTouchEndX = e.changedTouches[0].screenX;
    handleModalSwipe();
}, { passive: true });

function handleModalSwipe() {
    const swipeThreshold = 50;
    const diff = modalTouchEndX - modalTouchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            prevModalImage();
        } else {
            nextModalImage();
        }
    }
}

modalPrevBtn.addEventListener('click', prevModalImage);
modalNextBtn.addEventListener('click', nextModalImage);

document.addEventListener('DOMContentLoaded', () => {
    const navBtn = document.querySelector('.mobile-menu-btn');
    navBtn?.addEventListener('click', () => {
        const expanded = navBtn.getAttribute('aria-expanded') === 'true';
        navBtn.setAttribute('aria-expanded', String(!expanded));
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.querySelector('.loading-spinner');
    loadingSpinner.style.display = 'none';
});