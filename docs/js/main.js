// تفعيل التمرير السلس عند النقر على الروابط
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل الروابط السلسة
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // إضافة تأثير الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // إضافة كلاس نشط للرابط الحالي
    window.addEventListener('scroll', function() {
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('header nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    console.log('✅ Mix Platform جاهزة للاستخدام!');
});

// وظيفة للتحقق من توفر الخادم
async function checkServerStatus() {
    try {
        const response = await fetch('/api/status', { 
            method: 'GET',
            mode: 'cors'
        }).catch(() => ({ status: 503 }));
        
        if (response.status === 200) {
            console.log('🟢 الخادم متصل');
        } else {
            console.log('🔴 الخادم غير متوفر حالياً');
        }
    } catch (error) {
        console.log('⚠️ لا يمكن الوصول إلى الخادم:', error.message);
    }
}

// تشغيل التحقق عند تحميل الصفحة
checkServerStatus();
