(function() {
    "use strict";

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {

        // Cache DOM elements
        const header = document.getElementById('header');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const progressBar = document.getElementById('progressBar');
        const yearSpan = document.getElementById('year');
        const form = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');
        const reveals = document.querySelectorAll('.reveal');
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Helper functions
        const debounce = (fn, delay) => {
            let timer;
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        };

        // 1. Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
                this.setAttribute('aria-expanded', expanded);
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
                // Prevent body scroll when menu open
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking a link (for smooth navigation)
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }

        // 2. Sticky header on scroll
        if (header) {
            window.addEventListener('scroll', debounce(function() {
                header.classList.toggle('scrolled', window.scrollY > 50);
            }, 10));
        }

        // 3. Scroll reveal (with Intersection Observer for performance)
        if ('IntersectionObserver' in window && reveals.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // Optional: unobserve after reveal to save resources
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            reveals.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            const checkReveal = () => {
                reveals.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight - 100) {
                        el.classList.add('active');
                    }
                });
            };
            window.addEventListener('scroll', debounce(checkReveal, 100));
            checkReveal(); // initial check
        }

        // 4. Scroll progress bar
        if (progressBar) {
            const updateProgress = () => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = (scrollTop / scrollHeight) * 100;
                progressBar.style.width = progress + '%';
                progressBar.setAttribute('aria-valuenow', Math.round(progress));
            };
            window.addEventListener('scroll', debounce(updateProgress, 10));
            updateProgress(); // initial
        }

        // 5. Active navigation highlight
        const setActiveNav = () => {
            let current = '';
            const scrollPos = window.scrollY + 100; // offset for header

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1); // remove '#'
                if (href === current) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        window.addEventListener('scroll', debounce(setActiveNav, 100));
        setActiveNav(); // initial

        // 6. Footer year
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // 7. Contact form validation and submission
        if (form && formStatus && submitBtn) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get values
                const name = document.getElementById('name')?.value.trim() || '';
                const email = document.getElementById('email')?.value.trim() || '';
                const message = document.getElementById('message')?.value.trim() || '';

                // Reset status
                formStatus.textContent = '';
                formStatus.className = 'form-status';

                // Validation
                if (name.length < 3) {
                    formStatus.textContent = 'Please enter a valid name.';
                    formStatus.classList.add('error');
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    formStatus.textContent = 'Please enter a valid email address.';
                    formStatus.classList.add('error');
                    return;
                }

                if (message.length < 10) {
                    formStatus.textContent = 'Please provide more details about your request (min. 10 characters).';
                    formStatus.classList.add('error');
                    return;
                }

                // Disable button to prevent double submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';

                // Simulate successful submission (replace with actual AJAX call)
                setTimeout(() => {
                    formStatus.textContent = 'Your request has been successfully submitted.';
                    formStatus.classList.add('success');
                    form.reset();

                    // Re-enable button after a short delay
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Request';

                    // Clear status after 5 seconds
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 5000);
                }, 1000); // Simulate network delay
            });
        }

        // 8. Smooth scrolling for anchor links (optional enhancement)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });

    }); // DOMContentLoaded end
})();