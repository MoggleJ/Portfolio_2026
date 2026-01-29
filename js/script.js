
class PortfolioDataLoader {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLang') || 'en';
        this.data = {
            projects: null,
            skills: null,
            experience: null
        };
    }

    async init() {
        try {
            // Load all data files
            await Promise.all([
                this.loadProjects(),
                this.loadSkills(),
                this.loadExperience()
            ]);
            
            // Render all sections
            this.renderProjects();
            this.renderSkills();
            this.renderExperience();
            
            console.log('✅ Portfolio data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading portfolio data:', error);
        }
    }

    async loadProjects() {
        const response = await fetch('./data/projects.json');
        const data = await response.json();
        this.data.projects = data.projects;
    }

    async loadSkills() {
        const response = await fetch('./data/skills.json');
        const data = await response.json();
        this.data.skills = data.skillCategories;
    }

    async loadExperience() {
        const response = await fetch('./data/experience.json');
        const data = await response.json();
        this.data.experience = data.experiences;
    }

    getText(textObj) {
        if (typeof textObj === 'string') return textObj;
        return textObj[this.currentLang] || textObj.en;
    }

    // ========================================
    // Render Projects
    // ========================================
    renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container || !this.data.projects) return;

        container.innerHTML = this.data.projects.map((project, index) => `
            <article class="project-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="project-image">
                    <div class="placeholder-project gradient-${project.gradient}">
                        <span>${project.icon}</span>
                    </div>
                    <div class="project-overlay">
                        <a href="${project.link}" class="project-link-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="project-info">
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <h3 data-en="${this.escapeHtml(project.title.en)}" 
                        data-fr="${this.escapeHtml(project.title.fr)}">
                        ${this.getText(project.title)}
                    </h3>
                    <p data-en="${this.escapeHtml(project.description.en)}" 
                       data-fr="${this.escapeHtml(project.description.fr)}">
                        ${this.getText(project.description)}
                    </p>
                    <a href="${project.link}" class="project-link">
                        <span data-en="Learn more" data-fr="En savoir plus">Learn more</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </article>
        `).join('');
    }

    // ========================================
    // Render Skills
    // ========================================
    renderSkills() {
        const container = document.getElementById('skills-container');
        if (!container || !this.data.skills) return;

        container.innerHTML = this.data.skills.map((category, index) => `
            <div class="skill-category" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="category-icon">${category.icon}</div>
                <h3 data-en="${this.escapeHtml(category.title.en)}" 
                    data-fr="${this.escapeHtml(category.title.fr)}">
                    ${this.getText(category.title)}
                </h3>
                <div class="skill-items">
                    ${category.skills.map(skill => {
                        const skillName = this.getText(skill.name);
                        const dataAttrs = typeof skill.name === 'object' ? 
                            `data-en="${this.escapeHtml(skill.name.en)}" data-fr="${this.escapeHtml(skill.name.fr)}"` : 
                            '';
                        return `<span class="skill-badge level-${skill.level}" ${dataAttrs}>${skillName}</span>`;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // Render Experience
    // ========================================
    renderExperience() {
        const container = document.getElementById('experience-container');
        if (!container || !this.data.experience) return;

        container.innerHTML = this.data.experience.map((exp, index) => `
            <div class="experience-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="experience-header">
                    ${exp.logo ? `
                        <div class="company-logo">
                            <img src="https://mogglej.github.io/Portfolio_2026/images/${exp.logo}" alt="${exp.company}">
                        </div>
                    ` : `
                        <div class="company-logo">
                            <span>${exp.type === 'work' ? '💼' : '🎓'}</span>
                        </div>
                    `}
                    <div class="experience-meta">
                        <h3 data-en="${this.escapeHtml(exp.title.en)}" 
                            data-fr="${this.escapeHtml(exp.title.fr)}">
                            ${this.getText(exp.title)}
                        </h3>
                        <p class="company-name">${this.getText(exp.company)}</p>
                        <div class="experience-details">
                            <span class="location">${exp.location}</span>
                            <span class="dates">${this.formatDate(exp.startDate)} - ${exp.current ? (this.currentLang === 'en' ? 'Present' : 'Présent') : this.formatDate(exp.endDate)}</span>
                        </div>
                    </div>
                </div>
                <div class="experience-body">
                    <ul>
                        ${this.getText(exp.description).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    ${exp.tags.length > 0 ? `
                        <div class="keywords">
                            ${exp.tags.map(tag => `<span class="keyword">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // Helper Functions
    // ========================================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateStr) {
        if (dateStr.length === 4) return dateStr; // Just year
        const date = new Date(dateStr);
        const options = { month: 'short', year: 'numeric' };
        return date.toLocaleDateString(this.currentLang === 'fr' ? 'fr-FR' : 'en-US', options);
    }

    // Update language and re-render
    updateLanguage(lang) {
        this.currentLang = lang;
        this.renderProjects();
        this.renderSkills();
        this.renderExperience();
    }
}


// ========================================
// Initialize AOS (Animate On Scroll)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
});

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when scrolling down
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Mobile Menu Toggle
// ========================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate menu toggle icon
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ========================================
// Parallax Effect for Hero Background
// ========================================
const heroBackground = document.querySelector('.hero-background');

if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ========================================
// Typing Effect for Hero Subtitle (Optional)
// ========================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect
// const heroSubtitle = document.querySelector('.hero-subtitle');
// if (heroSubtitle) {
//     const originalText = heroSubtitle.textContent;
//     setTimeout(() => {
//         typeWriter(heroSubtitle, originalText, 30);
//     }, 1000);
// }

// ========================================
// Intersection Observer for Fade-In Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to elements without AOS
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// ========================================
// Form Submission Handler
// ========================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Show loading state
        submitBtn.querySelector('span').textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        try {
            // If using Formspree, the form will handle submission automatically
            // This is just for visual feedback
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success feedback
            submitBtn.querySelector('span').textContent = '✓ Message envoyé !';
            submitBtn.style.background = 'linear-gradient(135deg, #2D7D6D 0%, #7DD3C0 100%)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            // Error feedback
            submitBtn.querySelector('span').textContent = '✗ Erreur, réessayez';
            submitBtn.style.background = 'linear-gradient(135deg, #8B2850 0%, #B8336A 100%)';
            
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// ========================================
// Cursor Trail Effect (Optional - Advanced)
// ========================================
class CursorTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 15;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => this.addParticle(e.clientX, e.clientY));
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 2,
            opacity: 1,
            color: `rgba(125, 211, 192, ${Math.random() * 0.5 + 0.3})`
        });
        
        if (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.opacity -= 0.02;
            particle.size *= 0.95;
            
            if (particle.opacity <= 0) {
                this.particles.splice(index, 1);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color.replace(/[\d.]+\)/, `${particle.opacity})`);
                this.ctx.fill();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Uncomment to enable cursor trail (only on desktop)
// if (window.innerWidth > 768) {
//     new CursorTrail();
// }

// ========================================
// Scroll Progress Indicator
// ========================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #7DD3C0 0%, #B8336A 100%)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '10000';
    progressBar.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / scrollHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Uncomment to enable scroll progress bar
// createScrollProgress();

// ========================================
// Dynamic Year in Footer
// ========================================
const footerYear = document.querySelector('.footer-center p');
if (footerYear && footerYear.textContent.includes('2025')) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2025', currentYear);
}

// ========================================
// Lazy Loading Images
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Detect if user prefers reduced motion
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', 'none');
    document.documentElement.style.setProperty('--transition-base', 'none');
    document.documentElement.style.setProperty('--transition-slow', 'none');
    
    // Disable AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            disable: true
        });
    }
}

// ========================================
// Console Easter Egg
// ========================================
console.log('%c Welcome to my portfolio!', 'font-size: 24px; font-weight: bold; color: #4DBAA6;');
console.log('%c Finding anything interesting? Don\'t hesitate to reach out!', 'font-size: 14px; color: #B8336A;');

// ========================================
// Performance Optimization
// ========================================
// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll handlers
const debouncedUpdateActiveLink = debounce(updateActiveLink, 50);
window.addEventListener('scroll', debouncedUpdateActiveLink);

// ========================================
// Keyboard Navigation Enhancement
// ========================================
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});


// ========================================
// Initialize everything when DOM is ready
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Portfolio loaded successfully!');
    
    const dataLoader = new PortfolioDataLoader();
    await dataLoader.init();
    // Add any additional initialization here
    updateActiveLink();
});

// ========================================
// Service Worker Registration (Optional - for PWA)
// ========================================
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => console.log('SW registered:', registration))
//             .catch(error => console.log('SW registration failed:', error));
//     });
// }
