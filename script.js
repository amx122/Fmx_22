document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const bar = document.querySelector('.bar-fill');
    const percent = document.getElementById('percent');
    
    if (preloader) {
        let load = 0;
        const interval = setInterval(() => {
            load += Math.floor(Math.random() * 10) + 5; 
            if (load > 100) load = 100;
            
            if (bar) bar.style.width = `${load}%`;
            if (percent) percent.innerText = `${load}%`;
            
            if (load === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('loaded'); 
                }, 600); 
            }
        }, 50); 
    }
    const canvas = document.getElementById('neural-canvas'); 
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        const chars = "01FMX22KYIVCODE"; 
        const charArray = chars.split("");
        
        let fontSize = 14;
        let columns;
        let drops = [];

        function initMatrix() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = width / fontSize;
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100; 
            }
        }

        function animateMatrix() {
            ctx.fillStyle = "rgba(2, 2, 5, 0.05)";
            ctx.fillRect(0, 0, width, height);
            ctx.font = fontSize + "px 'JetBrains Mono'";

            for (let i = 0; i < drops.length; i++) {
                const color = Math.random() > 0.5 ? "#00f3ff" : "#bc13fe";
                ctx.fillStyle = color;
                
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(animateMatrix);
        }
        
        window.addEventListener('resize', initMatrix);
        initMatrix(); 
        animateMatrix();
    }
    const cards = document.querySelectorAll('.stat-card, .holo-card, .tech-box, .study-card, .case-card');
    
    cards.forEach(card => {
        card.classList.add('spotlight-card');

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            if (window.innerWidth > 768) {
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const dx = (y - cy) / 25; 
                const dy = (cx - x) / 25;
                card.style.transform = `perspective(1000px) rotateX(${dx}deg) rotateY(${dy}deg) scale(1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tech-box, .study-card, .case-card, .process-step').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") window.closeLightbox();
    });
    const faqPanels = document.querySelectorAll('.faq-panel');
    faqPanels.forEach(panel => {
        panel.addEventListener('click', () => {
            faqPanels.forEach(p => {
                if (p !== panel) p.classList.remove('active');
            });
            panel.classList.toggle('active');
        });
    });
});
window.toggleMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
};
const TG_USER = "Fmx_22";

window.sendOrder = function(type) {
    let btn = event.target.closest('button'); 
    let parent = btn.parentElement; 
    let input = parent.querySelector('input');
    
    let contact = "Не вказано";
    if (input && input.value.trim() !== "") {
        contact = input.value.trim();
    } else if (input) {
        input.style.borderBottom = "1px solid #ff0055";
        input.placeholder = "Введіть контакт!";
        setTimeout(() => {
            input.style.borderBottom = "1px solid #333";
            input.placeholder = "@Telegram";
        }, 2000);
        return;
    }
    
    let msg = `🔥 Замовлення: ${type}. Контакт: ${contact}`;
    window.open(`https://t.me/${TG_USER}?text=${encodeURIComponent(msg)}`, '_blank');
    if(input) input.value = '';
};

window.quickOrder = function(type) {
    let msg = `🎓 Цікавить послуга: ${type}`;
    window.open(`https://t.me/${TG_USER}?text=${encodeURIComponent(msg)}`, '_blank');
};
let currentSlide = 0;

window.moveSlide = function(direction) {
    const track = document.getElementById('track');
    const cards = document.querySelectorAll('.case-card');
    
    if (!track || cards.length === 0) return;
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight) + 25; 
    
    const wrapperWidth = document.querySelector('.carousel-viewport').offsetWidth;
    const visibleCards = Math.floor(wrapperWidth / cardWidth) || 1;
    const maxSlide = Math.max(0, cards.length - visibleCards); 

    currentSlide += direction;

    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide) currentSlide = maxSlide;

    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
};
window.openLightbox = function(card) {
    console.log("Opening Lightbox..."); 

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const captionText = document.getElementById('lightbox-caption');
    
    if (!lightbox || !lightboxImg) return;
    
    const img = card.querySelector('img');
    const title = card.querySelector('h4');
    
    if (img) lightboxImg.src = img.src;
    if (title && captionText) captionText.innerHTML = title.innerText;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
};