/**
 * 포미서비스 - AI SNS 마케팅 랜딩 페이지
 * Vanilla JavaScript (ES6+)
 * - 인터섹션 옵저버 스크롤 애니메이션
 * - 폼 유효성 검사
 * - 부드러운 스크롤
 * - 모달 및 모바일 메뉴
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
  initMobileMenu();
});

/**
 * Intersection Observer를 활용한 스크롤 애니메이션
 * Fade-in, Slide-up 효과
 */
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.scroll-animate');

  if (!animateElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animateElements.forEach((el) => observer.observe(el));
}

/**
 * 앵커 링크 부드러운 스크롤
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#terms' || href === '#privacy' || href === '#faq') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // 모바일 메뉴 닫기
        document.querySelector('.nav-menu')?.classList.remove('active');
      }
    });
  });
}

/**
 * 상담 신청 모달 열기
 */
function showContactPopup(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // 첫 입력 필드에 포커스
    setTimeout(() => {
      document.getElementById('name')?.focus();
    }, 100);
  }
}

/**
 * 상담 신청 모달 닫기
 */
function closeContactPopup(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/**
 * 모달 오버레이 클릭 시 닫기
 */
document.addEventListener('click', (e) => {
  const modal = document.getElementById('contactModal');
  if (e.target === modal) {
    closeContactPopup(e);
  }
});

/**
 * ESC 키로 모달 닫기
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('contactModal');
    if (modal?.classList.contains('active')) {
      closeContactPopup(e);
    }
  }
});

/**
 * 폼 유효성 검사 및 제출 처리
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const validationRules = {
    name: (value) => value.trim().length >= 2 || '이름을 2글자 이상 입력해주세요',
    phone: (value) => {
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      const normalized = value.replace(/-/g, '');
      return phoneRegex.test(normalized) || /^[0-9]{10,11}$/.test(normalized) || '올바른 연락처 형식을 입력해주세요 (예: 010-0000-0000)';
    },
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || '올바른 이메일 형식을 입력해주세요';
    },
  };

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}Error`);

    if (input && errorEl) {
      input.classList.add('error');
      errorEl.textContent = message;
    }
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}Error`);

    if (input && errorEl) {
      input.classList.remove('error');
      errorEl.textContent = '';
    }
  }

  function validateForm() {
    let isValid = true;

    Object.keys(validationRules).forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      if (!input) return;

      const value = input.value.trim();
      const validator = validationRules[fieldId];

      if (input.required && !value) {
        showError(fieldId, '필수 입력 항목입니다');
        isValid = false;
      } else if (value && validator) {
        const result = validator(value);
        if (result !== true) {
          showError(fieldId, result);
          isValid = false;
        } else {
          clearError(fieldId);
        }
      } else {
        clearError(fieldId);
      }
    });

    return isValid;
  }

  // 실시간 유효성 검사 (blur)
  Object.keys(validationRules).forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (!value && !input.required) {
          clearError(fieldId);
          return;
        }
        const validator = validationRules[fieldId];
        const result = validator(value);
        if (result !== true) {
          showError(fieldId, result);
        } else {
          clearError(fieldId);
        }
      });

      input.addEventListener('input', () => {
        if (document.getElementById(`${inputId}Error`).textContent) {
          const validator = validationRules[fieldId];
          const result = validator(input.value.trim());
          if (result === true) clearError(fieldId);
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // 실제 환경에서는 서버로 전송
    alert('상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    form.reset();
    Object.keys(validationRules).forEach((id) => clearError(id));
    closeContactPopup();
  });
}

/**
 * 모바일 메뉴 토글
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.setAttribute(
      'aria-label',
      menu.classList.contains('active') ? '메뉴 닫기' : '메뉴 열기'
    );
    toggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
  });
}
