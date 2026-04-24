
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    // loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active',
      renderBullet: function (index, className) {
        return `<span class="${className}"></span>`;
      },
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 1
      },
      1024: {
        slidesPerView: 2
      },
      1280: {
        slidesPerView: 2
      }
    },
    on: {
      init: function() {
        // Инициализация прогресс-бара для первого слайда
        // const activeSlide = this.slides[this.activeIndex];
        // const progressBar = activeSlide.querySelector('.progress-bar');
        // if (progressBar) progressBar.style.width = '100%';
      },
      slideChange: function() {
        // Сброс всех прогресс-баров
        // document.querySelectorAll('.progress-bar').forEach(bar => {
        //   bar.style.width = '0';
        // });
        
        // // Активация прогресс-бара для текущего слайда
        // const activeSlide = this.slides[this.activeIndex];
        // const progressBar = activeSlide.querySelector('.progress-bar');
        // if (progressBar) progressBar.style.width = '100%';
      }
    }
  });
});





// Конфигурация анимации
const ANIMATION_CONFIG = {
  // Порядок и время активации иконок (в процентах от общей анимации линии)
  icons: [
    { id: 'icon-finance', delay: 0.10 },
    { id: 'icon-realty', delay: 0.20 },
    { id: 'icon-marketing', delay: 0.4 },
    { id: 'icon-logistics', delay: 0.55 },
    { id: 'icon-production', delay: 0.7 },
    { id: 'icon-oil', delay: 0.85 },
    { id: 'icon-horeca', delay: 0.95 }
  ],
  
  // Настройки Intersection Observer
  observer: {
    threshold: 0.3, // Срабатывает когда 30% блока видно
    rootMargin: '0px 0px -50px 0px' // Срабатывает немного раньше
  },
  
  // Настройки анимации линии
  lineAnimation: {
    duration: 2500, // 2.5 секунды
    easing: 'cubic-bezier(0.65, 0, 0.35, 1)' // Плавное ускорение/замедление
  }
};

class AutomationAnimation {
  constructor() {
    this.section = document.getElementById('automation-section');
    this.line = document.getElementById('orange-line');
    this.iconGroups = document.querySelectorAll('.icon-group');
    this.isAnimating = false;
    this.hasAnimated = false;
    
    this.init();
  }
  
  init() {
    if (!this.section || !this.line) return;
    
    // Создаем Intersection Observer
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      ANIMATION_CONFIG.observer
    );
    
    this.observer.observe(this.section);
    
    // Обработка ресайза окна
    window.addEventListener('resize', this.resetAnimation.bind(this));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.hasAnimated) {
        this.startAnimation();
      } else if (!entry.isIntersecting && this.hasAnimated) {
        this.resetAnimation();
      }
    });
  }
  
  startAnimation() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.hasAnimated = true;
    
    // Анимация линии
    this.line.style.strokeDashoffset = '0';
    
    // Последовательная анимация иконок
    ANIMATION_CONFIG.icons.forEach((iconConfig, index) => {
      const delay = iconConfig.delay * ANIMATION_CONFIG.lineAnimation.duration;
      
      setTimeout(() => {
        this.activateIcon(iconConfig.id);
      }, delay);
    });
    
    // Завершаем анимацию
    setTimeout(() => {
      this.isAnimating = false;
    }, ANIMATION_CONFIG.lineAnimation.duration);
  }
  
  activateIcon(iconId) {
    const iconGroup = document.querySelector(`[data-icon-id="${iconId}"]`);
    if (!iconGroup) return;
    
    // Находим фон иконки
    const bg = iconGroup.querySelector('.icon-bg');
    if (bg) {
      bg.style.fill = '#ffb251';
      bg.style.transition = 'fill 0.3s ease-out';
    }
    
    // Находим все пути иконки
    const paths = iconGroup.querySelectorAll('.icon-path');
    paths.forEach(path => {
      path.style.stroke = '#1a1a1a';
      path.style.transition = 'stroke 0.3s ease-out';
    });
    
    // Добавляем класс для CSS анимации
    iconGroup.classList.add('icon-active');
  }
  
  resetAnimation() {
    this.isAnimating = false;
    
    // Сбрасываем линию
    this.line.style.strokeDashoffset = '1130';
    this.line.style.transition = 'none';
    
    // Сбрасываем все иконки
    this.iconGroups.forEach(group => {
      const bg = group.querySelector('.icon-bg');
      if (bg) {
        const originalFill = bg.getAttribute('data-original-fill') || '#232323';
        bg.style.fill = originalFill;
        bg.style.transition = 'none';
      }
      
      const paths = group.querySelectorAll('.icon-path');
      paths.forEach(path => {
        const originalStroke = path.getAttribute('data-original-stroke') || '#fff';
        path.style.stroke = originalStroke;
        path.style.transition = 'none';
      });
      
      group.classList.remove('icon-active');
    });
    
    // Сбрасываем флаг
    this.hasAnimated = false;
    
    // Восстанавливаем transition после сброса
    setTimeout(() => {
      this.line.style.transition = `stroke-dashoffset ${ANIMATION_CONFIG.lineAnimation.duration}ms ${ANIMATION_CONFIG.lineAnimation.easing}`;
      
      this.iconGroups.forEach(group => {
        const bg = group.querySelector('.icon-bg');
        if (bg) {
          bg.style.transition = 'fill 0.3s ease-out';
        }
        
        const paths = group.querySelectorAll('.icon-path');
        paths.forEach(path => {
          path.style.transition = 'stroke 0.3s ease-out';
        });
      });
    }, 50);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Небольшая задержка для гарантии загрузки DOM
  setTimeout(() => {
    new AutomationAnimation();
  }, 100);
});

// Фолбэк для старых браузеров
if (!('IntersectionObserver' in window)) {
  console.warn('IntersectionObserver not supported, using fallback');
  
  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('automation-section');
    const line = document.getElementById('orange-line');
    
    if (section && line) {
      // Простая анимация при загрузке
      setTimeout(() => {
        line.style.strokeDashoffset = '0';
        
        // Активируем все иконки через 1.5 секунды
        setTimeout(() => {
          document.querySelectorAll('.icon-group').forEach(group => {
            const bg = group.querySelector('.icon-bg');
            if (bg) bg.style.fill = '#ffb251';
            
            const paths = group.querySelectorAll('.icon-path');
            paths.forEach(path => {
              path.style.stroke = '#1a1a1a';
            });
          });
        }, 1500);
      }, 1000);
    }
  });
}



// Универсальные функции для работы с модальными окнами
function initModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // Закрытие по крестику
  const closeBtn = modal.querySelector('[data-modal-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modalId));
  }
  
  // Закрытие по клику вне окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal(modalId);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Фокусировка на модальном окне для доступности
    modal.setAttribute('aria-hidden', 'false');
    document.body.setAttribute('aria-hidden', 'true');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Возвращаем доступность
    modal.setAttribute('aria-hidden', 'true');
    document.body.setAttribute('aria-hidden', 'false');
  }
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Инициализируем все модальные окна на странице
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    initModal(modal.id);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(event) {
    // Проверяем, содержит ли кликнутый элемент класс open-form
    // или является его дочерним элементом
    if (event.target.closest('.open-form')) {
      openModal('formModal');
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
   
    
    const section = document.getElementById('stages-section');
    const timelineProgress = document.getElementById('timeline-progress');
    const circles = document.querySelectorAll('[data-circle]');
    const circlesMobile = document.querySelectorAll('[data-circle-mobile]');
    const contents = document.querySelectorAll('[data-content]');
    const mobileLines = document.querySelectorAll('[data-line-index]');
    
    if (!section || !timelineProgress || circles.length === 0) return;
    
    let circlePositions = [];
    let sectionHeight = 0;
    let isActive = false;
    let isComplete = false;
    let rafId = null;
    
    // Вычисляем позиции кругов
    const calculatePositions = () => {
      const sectionRect = section.getBoundingClientRect();
      sectionHeight = sectionRect.height;
      circlePositions = [];
      
      circles.forEach((circle) => {
        const rect = circle.getBoundingClientRect();
        const relativeTop = rect.top - sectionRect.top + rect.height / 2;
        circlePositions.push(relativeTop);
      });
    };
    
    // Основная функция обновления анимации
    const updateAnimation = () => {
      if (isComplete) return;
      
      const sectionRect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // НОВАЯ ЛОГИКА: Анимируем от момента, когда верх секции появляется внизу экрана
      // до момента, когда низ секции появляется вверху экрана
      // Но с коэффициентом замедления, чтобы линия доходила до конца только при полной видимости
      
      // Старт: когда верх секции входит в нижнюю треть экрана
      const startTrigger = windowHeight * 0.7;
      // Конец: когда низ секции выходит из верхней трети экрана
      const endTrigger = windowHeight * 0.4;
      
      // Текущая позиция верха секции
      const sectionTop = sectionRect.top;
      
      // Прогресс от 0 до 1
      let progress = (startTrigger - sectionTop) / (sectionHeight + startTrigger - endTrigger);
      progress = Math.max(0, Math.min(1, progress));
      
      // Высота линии от первого до последнего круга
      const firstCircle = circlePositions[0];
      const lastCircle = circlePositions[circlePositions.length - 1];
      const totalLineLength = lastCircle - firstCircle;
      
      // Текущая позиция линии с учетом прогресса
      const currentLinePos = progress * totalLineLength;
      const linePercent = Math.max(0, Math.min(100, (currentLinePos / totalLineLength) * 100));
      
      // Применяем высоту линии
      timelineProgress.style.height = `${linePercent}%`;
      
      // Проверяем завершение (100% с небольшим допуском)
      if (linePercent >= 99.5) {
        isComplete = true;
        timelineProgress.classList.add('is-complete');
        timelineProgress.style.height = '100%';
        
        // Активируем последний круг и останавливаемся
        const lastIndex = circles.length - 1;
        circles[lastIndex].classList.add('is-active');
        circlesMobile[lastIndex]?.classList.add('is-active');
        contents[lastIndex]?.classList.add('is-visible');
        
        // Отключаем обработчик скролла
        window.removeEventListener('scroll', onScroll);
        return;
      }
      
      // Обновляем мобильные линии
      mobileLines.forEach((line, index) => {
        if (index >= mobileLines.length - 1) return;
        
        const itemStart = circlePositions[index] - firstCircle;
        const itemEnd = circlePositions[index + 1] - firstCircle;
        const itemLength = itemEnd - itemStart;
        
        const itemProgress = (currentLinePos - itemStart) / itemLength;
        const clampedItemProgress = Math.max(0, Math.min(1, itemProgress));
        
        line.style.height = `${clampedItemProgress * 100}%`;
      });
      
      // Активируем круги
      circles.forEach((circle, index) => {
        const circlePos = circlePositions[index] - firstCircle;
        const activationPoint = (circlePos / totalLineLength) * 100;
        
        // Круг активен когда линия прошла 70% пути к нему
        const isCircleActive = linePercent >= activationPoint - 15;
        const isCirclePast = linePercent >= activationPoint + 25;
        
        // Сбрасываем классы
        circle.classList.remove('is-active', 'is-past');
        circlesMobile[index]?.classList.remove('is-active', 'is-past');
        
        if (isCircleActive) {
          circle.classList.add('is-active');
          circlesMobile[index]?.classList.add('is-active');
          
          // Показываем контент
          if (contents[index]) {
            contents[index].classList.add('is-visible');
          }
          
          // Если прошли дальше, меняем на "past" (кроме последнего)
          if (isCirclePast && index < circles.length - 1) {
            circle.classList.remove('is-active');
            circle.classList.add('is-past');
            circlesMobile[index]?.classList.remove('is-active');
            circlesMobile[index]?.classList.add('is-past');
          }
        }
      });
    };
    
    // Обработчик скролла с requestAnimationFrame
    const onScroll = () => {
      if (!isActive || isComplete) return;
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        updateAnimation();
        rafId = null;
      });
    };
    
    // Intersection Observer для включения/выключения
    const observerOptions = {
      root: null,
      rootMargin: '20% 0px 20% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isComplete) {
          if (!isActive) {
            isActive = true;
            calculatePositions();
            updateAnimation();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', calculatePositions, { passive: true });
          }
        } else if (!entry.isIntersecting && !isComplete) {
          // Не отключаем полностью, только если ушли далеко
          const rect = section.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            isActive = false;
            window.removeEventListener('scroll', onScroll);
          }
        }
      });
    }, observerOptions);
    
    // Инициализация
    calculatePositions();
    observer.observe(section);
    
    // Первоначальная проверка видимости
    const initialRect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (initialRect.top < windowHeight && initialRect.bottom > 0 && !isComplete) {
      isActive = true;
      updateAnimation();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', calculatePositions, { passive: true });
    }
    
    // Очистка при удалении элемента
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', calculatePositions);
      if (rafId) cancelAnimationFrame(rafId);
    });
  })