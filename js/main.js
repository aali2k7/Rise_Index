/**
 * RISE Coaching Institute - Premium JavaScript
 * Smooth scrolling, scroll spy, animations, counters, modal
 */

// ===== GLOBAL VARIABLES =====
let isScrolling = false;

// ===== SMOOTH SCROLL NAVIGATION =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const sectionPosition = section.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// ===== NAVBAR LINK CLICK HANDLERS =====
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ===== SCROLL SPY - ACTIVE NAVBAR LINK UPDATES =====
function updateActiveNavLink() {
    if (isScrolling) return;
    
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.pageYOffset || window.scrollY;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 150;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href').substring(1);
        
        if (currentSection === linkHref) {
            link.classList.add('active');
        }
    });
    
    // Special handling for top of page
    if (scrollPosition < 100) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
        });
    }
}

// Throttled scroll handler
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(function() {
        updateActiveNavLink();
    });
}, { passive: true });

// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== ANIMATED COUNTERS =====
function animateCounter(element, target, duration = 2000) {
    const isPercentage = target.toString().includes('%');
    const isPlus = target.toString().includes('+');
    const numericTarget = parseInt(target.toString().replace(/[^0-9]/g, ''));
    
    let start = 0;
    const increment = numericTarget / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= numericTarget) {
            element.textContent = numericTarget + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
            clearInterval(timer);
        } else {
            const value = Math.floor(start);
            element.textContent = value + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
        }
    }, 16);
}

// Observe result cards for counter animation
const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counterElement = entry.target.querySelector('.result-number');
            if (counterElement && counterElement.dataset.target) {
                const target = counterElement.dataset.target;
                animateCounter(counterElement, target);
                counterObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        counterObserver.observe(card);
    });
});

// ===== CONTACT FORM HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const submitButton = contactForm.querySelector('.submit-button');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                course: document.getElementById('course').value,
                message: document.getElementById('message').value
            };
            
            // Show loading state
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            }
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                console.log('Form submitted with data:', formData);
                
                // Reset loading state
                if (submitButton) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                }
                
                // Show success modal
                showModal();
                
                // Reset form
                contactForm.reset();
                
                // Reset floating labels
                const labels = contactForm.querySelectorAll('label');
                labels.forEach(label => {
                    const input = label.previousElementSibling || label.nextElementSibling;
                    if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT')) {
                        if (input.value === '' || (input.tagName === 'SELECT' && input.value === '')) {
                            label.style.top = '';
                            label.style.fontSize = '';
                            label.style.color = '';
                        }
                    }
                });
            }, 1500);
        });
    }
});

// ===== MODAL FUNCTIONS =====
function showModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Make closeModal available globally
window.closeModal = closeModal;

// ===== ENHANCED SMOOTH SCROLLING =====
function smoothScrollTo(target) {
    isScrolling = true;
    const targetElement = typeof target === 'string' ? document.getElementById(target) : target;
    
    if (targetElement) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// ===== FLOATING LABELS ENHANCEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    const floatingInputs = document.querySelectorAll('.floating-label input, .floating-label textarea, .floating-label select');
    
    floatingInputs.forEach(input => {
        // For select, label comes after
        // For input/textarea, label comes after
        const label = input.nextElementSibling;
        
        if (!label || label.tagName !== 'LABEL') return;
        
        // Check if input has value on load
        if (input.value && input.value !== '' && input.value !== ' ') {
            label.style.top = '-0.5rem';
            label.style.left = '1rem';
            label.style.fontSize = '0.85rem';
            label.style.color = '#1a365d';
            label.style.backgroundColor = 'white';
            label.style.padding = '0 0.5rem';
            label.style.fontWeight = '600';
        }
        
        // Handle focus
        input.addEventListener('focus', function() {
            label.style.top = '-0.5rem';
            label.style.left = '1rem';
            label.style.fontSize = '0.85rem';
            label.style.color = '#1a365d';
            label.style.backgroundColor = 'white';
            label.style.padding = '0 0.5rem';
            label.style.fontWeight = '600';
        });
        
        // Handle blur
        input.addEventListener('blur', function() {
            if (!this.value || this.value === '' || this.value === ' ') {
                label.style.top = '';
                label.style.left = '';
                label.style.fontSize = '';
                label.style.color = '';
                label.style.backgroundColor = '';
                label.style.padding = '';
                label.style.fontWeight = '';
            }
        });
        
        // Handle change for select
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                if (this.value && this.value !== '' && this.value !== ' ') {
                    label.style.top = '-0.5rem';
                    label.style.left = '1rem';
                    label.style.fontSize = '0.85rem';
                    label.style.color = '#1a365d';
                    label.style.backgroundColor = 'white';
                    label.style.padding = '0 0.5rem';
                    label.style.fontWeight = '600';
                } else {
                    label.style.top = '';
                    label.style.left = '';
                    label.style.fontSize = '';
                    label.style.color = '';
                    label.style.backgroundColor = '';
                    label.style.padding = '';
                    label.style.fontWeight = '';
                }
            });
        }
    });
});

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', function() {
    // Set initial active nav link
    updateActiveNavLink();
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease';
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(updateActiveNavLink, 10);
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
