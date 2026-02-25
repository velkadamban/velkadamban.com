// Theme Toggling Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or use default dark
const savedTheme = localStorage.getItem('velkadamban-theme');
if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
}

themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('velkadamban-theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('velkadamban-theme', 'dark');
    }
});

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-wrapper');
const mobileIcon = mobileToggle.querySelector('i');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle Icon between bars and X
    if (navLinks.classList.contains('active')) {
        mobileIcon.classList.remove('fa-bars');
        mobileIcon.classList.add('fa-xmark');
    } else {
        mobileIcon.classList.remove('fa-xmark');
        mobileIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
const navItems = document.querySelectorAll('.nav-link');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            mobileIcon.classList.remove('fa-xmark');
            mobileIcon.classList.add('fa-bars');
        }
    });
});

// Custom Cursor Follow Logic (Only run if device has a mouse)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot exactly follows cursor
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });

    // Cursor hover effects on links/buttons
    const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .role-card, .profile-container');

    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
            cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.8)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        elem.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'rgba(150, 150, 150, 0.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Magnetic Buttons
const magneticButtons = document.querySelectorAll('.magnetic');

if (window.matchMedia("(pointer: fine)").matches) {
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;

            // Handle child elements if needed
            const text = btn.querySelector('span') || btn;
            if (text !== btn) text.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'translate(0px, 0px)';
            const text = btn.querySelector('span') || btn;
            if (text !== btn) text.style.transform = 'translate(0px, 0px)';
        });

        // Ensure buttons stay clickable despite transform
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translate(0px, 0px) scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Portfolio Tabbing Logic
// Portfolio Tabbing Logic (Nested Support with Slide Indicator)
const tabBtns = document.querySelectorAll('.tab-btn');

const initTabSliders = () => {
    const tabGroups = document.querySelectorAll('.portfolio-tabs, .sub-tabs-container, .sub-sub-tabs-container');

    // Ensure containers are relative and create slider DOM elements
    tabGroups.forEach(group => {
        group.style.position = 'relative';
        group.style.zIndex = '1';

        let slider = group.querySelector('.tab-slider');
        if (!slider) {
            slider = document.createElement('div');
            slider.className = 'tab-slider';
            group.appendChild(slider);
        }
    });

    // Update slider position for all currently active tabs
    const activeTabs = document.querySelectorAll('.tab-btn.active');
    activeTabs.forEach(activeTab => {
        // Check if visible (offset parent is not null) before updating
        if (activeTab.offsetParent !== null) {
            updateSlider(activeTab);
        }
    });
};

// Function to move slider behind the clicked button
const updateSlider = (btn) => {
    requestAnimationFrame(() => {
        const group = btn.closest('.portfolio-tabs, .sub-tabs-container, .sub-sub-tabs-container');
        if (!group) return;

        const slider = group.querySelector('.tab-slider');
        if (!slider) return;

        // Skip calculations if the container is hidden (display:none)
        if (group.offsetParent === null) return;

        const btnRect = btn.getBoundingClientRect();
        const groupRect = group.getBoundingClientRect();

        // Calculate relative position factoring in borders and scroll
        const left = btnRect.left - groupRect.left + group.scrollLeft;
        const top = btnRect.top - groupRect.top;
        const width = btnRect.width;
        const height = btnRect.height;

        slider.style.width = `${width}px`;
        slider.style.height = `${height}px`;
        slider.style.top = `${top}px`;
        slider.style.transform = `translateX(${left}px)`;

        // Dynamic slider styling based on the button group
        const dataGroup = btn.getAttribute('data-group');
        slider.className = 'tab-slider'; // Reset
        if (dataGroup === 'main') {
            slider.classList.add('slider-main');
        } else if (dataGroup === 'history-subs') {
            slider.classList.add('slider-gold');
        } else {
            slider.classList.add('slider-teal'); // For tech-subs, soft-subs, hard-subs
        }
    });
};

// Initialize sliders after page loads its layout
window.addEventListener('load', initTabSliders);
window.addEventListener('resize', initTabSliders);

// Toggling mechanism
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.getAttribute('data-group');
        const targetId = btn.getAttribute('data-target');

        // Select all buttons and contents within the same group
        const groupBtns = document.querySelectorAll(`.tab-btn[data-group="${group}"]`);
        const groupContents = document.querySelectorAll(`.tab-content[data-group="${group}"]`);

        // Deactivate all in group
        groupBtns.forEach(b => b.classList.remove('active'));
        groupContents.forEach(c => c.classList.remove('active'));

        // Activate clicked button
        btn.classList.add('active');
        updateSlider(btn); // Move slider immediately

        // Activate target content
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.add('active');

            // Nested Tabs Fix: Now that content is display:block, we must correctly position the sliders inside it!
            const innerActiveTabs = targetContent.querySelectorAll('.tab-btn.active');
            innerActiveTabs.forEach(innerTab => {
                // Micro-timeout allows browser to render display:block before calculating rects
                setTimeout(() => {
                    updateSlider(innerTab);
                }, 10);
            });

            // Trigger reveal animation if exists inside
            const innerReveals = targetContent.querySelectorAll('.reveal');
            innerReveals.forEach(el => el.classList.add('active'));
        }
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Parallax effect on Abstract Background Shapes
const shapes = document.querySelectorAll('.bg-shape');

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.pageX) * speed / 1000;
            const yOffset = (window.innerHeight / 2 - e.pageY) * speed / 1000;

            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}
