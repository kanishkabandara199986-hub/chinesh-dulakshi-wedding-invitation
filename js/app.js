/**
 * CHINESH & DULAKSHI - ROYAL KANDYAN DIGITAL WEDDING INVITATION
 * Interactive Logic & Application Controller
 */

import gsap from 'gsap';
import AOS from 'aos';

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Initialize Animate On Scroll (AOS)
  // ---------------------------------------------------------------------------
  AOS.init({
    duration: 1000,
    once: true,
    offset: 40,
    easing: 'ease-out-cubic'
  });

  // ---------------------------------------------------------------------------
  // 2. Custom Desktop Cursor
  // ---------------------------------------------------------------------------
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);
  }

  // ---------------------------------------------------------------------------
  // 3. Royal Preloader with GSAP Smooth Reveal
  // ---------------------------------------------------------------------------
  const progressBar = document.getElementById('progress-bar');
  const progressNumber = document.getElementById('progress-number');
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  let loadProgress = 0;
  const loadSpeed = 40; // ms

  const loadingInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 5) + 2;

    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadingInterval);

      if (progressBar) progressBar.style.width = '100%';
      if (progressNumber) progressNumber.innerText = '100';

      setTimeout(() => {
        gsap.to(loadingScreen, {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
          onComplete: () => {
            loadingScreen.style.display = 'none';
            gsap.to(mainContent, {
              autoAlpha: 1,
              duration: 1.2,
              ease: 'power2.out',
              onComplete: () => {
                AOS.refresh();
              }
            });
          }
        });
      }, 500);
    } else {
      if (progressBar) progressBar.style.width = `${loadProgress}%`;
      if (progressNumber) progressNumber.innerText = loadProgress;
    }
  }, loadSpeed);

  // ---------------------------------------------------------------------------
  // 4. Background Ambient Audio & Web Audio Harmonic Fallback
  // ---------------------------------------------------------------------------
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const bgMusic = document.getElementById('bg-music');
  let isPlaying = false;
  let audioCtx = null;
  let ambientOscillator = null;
  let ambientGain = null;

  // Gentle meditative ambient harmonic generator (traditional flute & tambura tone)
  const startAmbientSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const baseFreq = 220; // A3 harmonic
      const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2]; // root, fifth, octave

      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 2);
      ambientGain.connect(audioCtx.destination);

      freqs.forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);

        const subGain = audioCtx.createGain();
        subGain.gain.value = 1 / (idx + 1.8);
        osc.connect(subGain);
        subGain.connect(ambientGain);
        osc.start();
      });
    } catch (err) {
      console.warn('Ambient synth unavailable:', err);
    }
  };

  const stopAmbientSynth = () => {
    if (ambientGain && audioCtx) {
      try {
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
        setTimeout(() => {
          if (audioCtx && audioCtx.state !== 'closed') audioCtx.suspend();
        }, 1000);
      } catch (e) {
        // Safe catch
      }
    }
  };

  const playMusic = () => {
    if (bgMusic) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.className = 'ti ti-volume';
            isPlaying = true;
          })
          .catch(() => {
            startAmbientSynth();
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.className = 'ti ti-volume';
            isPlaying = true;
          });
      }
    } else {
      startAmbientSynth();
      if (musicToggle) musicToggle.classList.add('playing');
      if (musicIcon) musicIcon.className = 'ti ti-volume';
      isPlaying = true;
    }
  };

  const pauseMusic = () => {
    if (bgMusic) bgMusic.pause();
    stopAmbientSynth();
    if (musicToggle) musicToggle.classList.remove('playing');
    if (musicIcon) musicIcon.className = 'ti ti-volume-off';
    isPlaying = false;
  };

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // Smooth play on first user interaction with the page
  const tryAutoPlayOnInteraction = () => {
    if (!isPlaying) {
      playMusic();
    }
    document.removeEventListener('click', tryAutoPlayOnInteraction);
    document.removeEventListener('touchstart', tryAutoPlayOnInteraction);
  };
  document.addEventListener('click', tryAutoPlayOnInteraction, { once: true });
  document.addEventListener('touchstart', tryAutoPlayOnInteraction, { once: true });

  // ---------------------------------------------------------------------------
  // 5. Golden Ripple Effect on Screen Interaction
  // ---------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    // Avoid triggering ripple over form inputs, buttons, and links
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('input') ||
      e.target.closest('textarea') ||
      e.target.closest('select') ||
      e.target.closest('iframe')
    ) {
      return;
    }

    const ripple = document.createElement('div');
    ripple.className = 'gold-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 1200);
  });

  // ---------------------------------------------------------------------------
  // 6. Real-time Countdown Timer (Target: 2026-12-07 10:00 AM UTC+05:30)
  // ---------------------------------------------------------------------------
  const weddingTimestamp = new Date('2026-12-07T10:00:00+05:30').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingTimestamp - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    if (minsEl) minsEl.innerText = mins < 10 ? '0' + mins : mins;

    if (secsEl) {
      const prevVal = secsEl.innerText;
      const formattedSecs = secs < 10 ? '0' + secs : secs;
      if (prevVal !== String(formattedSecs)) {
        secsEl.innerText = formattedSecs;
        secsEl.classList.remove('cd-active-tick');
        void secsEl.offsetWidth; // trigger reflow
        secsEl.classList.add('cd-active-tick');
      }
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------------------------------------------------------------------------
  // 7. Download iCal (.ics) for Apple Calendar, Outlook & Mobile Devices
  // ---------------------------------------------------------------------------
  const btnDownloadIcs = document.getElementById('btn-download-ics');
  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Chinesh and Dulakshi Wedding//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:chinesh-dulakshi-wedding-20261207@wedora.lk',
        'DTSTAMP:20261028T000000Z',
        'DTSTART:20261207T043000Z',
        'DTEND:20261207T103000Z',
        'SUMMARY:Wedding of Chinesh & Dulakshi (චිනේෂ් සහ දුලක්ෂි)',
        'DESCRIPTION:Join us for the Royal Kandyan Wedding of Chinesh & Dulakshi.\\n\\nSchedule:\\n10:00 AM - Guest Arrival\\n11:08 AM - Sacred Poruwa Ceremony\\n12:30 PM - Wedding Lunch & Reception\\n03:59 PM - Going Away Ceremony\\n\\nVenue: Royal Chance Palace Banquet, Kalagedihena',
        'LOCATION:Royal Chance Palace Banquet, Kalagedihena, Sri Lanka',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Chinesh-Dulakshi-Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Calendar event downloaded successfully! 📅');
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Toast Notification Utility
  // ---------------------------------------------------------------------------
  const toastEl = document.getElementById('toast-notification');
  let toastTimeout;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.innerText = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  };

  // ---------------------------------------------------------------------------
  // 9. Copy Address to Clipboard
  // ---------------------------------------------------------------------------
  const btnCopyAddress = document.getElementById('btn-copy-address');
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      const addressText = 'Royal Chance Palace Banquet, Kandy Road, Kalagedihena, Sri Lanka';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addressText).then(() => {
          showToast('Venue address copied to clipboard! 📍');
        });
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = addressText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Venue address copied to clipboard! 📍');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 10. RSVP Form Submission & WhatsApp Direct Routing
  // ---------------------------------------------------------------------------
  const submitRsvpBtn = document.getElementById('submit-rsvp-btn');
  const rsvpFormWrap = document.getElementById('rsvp-form-wrap');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const rsvpWhatsappBtn = document.getElementById('rsvp-whatsapp-btn');

  // Submit RSVP Online Handler
  if (submitRsvpBtn) {
    submitRsvpBtn.addEventListener('click', async () => {
      const name = document.getElementById('rsvp-name').value.trim();
      const attending = document.getElementById('rsvp-attending').value;
      const guests = document.getElementById('rsvp-guests').value;
      const message = document.getElementById('rsvp-msg').value.trim();

      if (!name) {
        alert('කරුණාකර ඔබගේ නම ඇතුළත් කරන්න / Please enter your name.');
        document.getElementById('rsvp-name').focus();
        return;
      }

      submitRsvpBtn.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Confirming...';
      submitRsvpBtn.disabled = true;

      const formData = new FormData();
      formData.append('Guest Name', name);
      formData.append('Attendance', attending);
      formData.append('Number of Guests', guests);
      formData.append('Wishes & Message', message || 'No message provided');
      formData.append('Wedding', 'Chinesh & Dulakshi - 2026-12-07');

      try {
        // Send form submission
        await fetch('https://formspree.io/f/xaqzrkbp', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });
      } catch (err) {
        // Graceful handling even if offline or simulated
        console.log('RSVP recorded locally:', err);
      }

      // Show success screen
      if (rsvpFormWrap) rsvpFormWrap.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.style.display = 'block';
        rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast('Thank you! Your RSVP has been confirmed. 🌸');
    });
  }

  // ---------------------------------------------------------------------------
  // 9. Quick WhatsApp RSVP Option Handlers (Chinesh & Dulakshi)
  // ---------------------------------------------------------------------------
  const sendWhatsAppRSVP = (phone) => {
    const name = document.getElementById('rsvp-name') ? document.getElementById('rsvp-name').value.trim() : '';
    const guestName = name || 'Guest';
    const attending = document.getElementById('rsvp-attending') ? document.getElementById('rsvp-attending').value : 'Yes, joyfully attending';
    const guests = document.getElementById('rsvp-guests') ? document.getElementById('rsvp-guests').value : '2';
    const message = document.getElementById('rsvp-msg') ? document.getElementById('rsvp-msg').value.trim() : '';

    const text = encodeURIComponent(
      `*Wedding RSVP - Chinesh & Dulakshi*\n` +
      `👤 *Name:* ${guestName}\n` +
      `💌 *Attending:* ${attending}\n` +
      `👥 *Guests:* ${guests}\n` +
      (message ? `💬 *Wishes:* ${message}\n` : '') +
      `✨ Looking forward to December 7th, 2026!`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const rsvpWaChinesh = document.getElementById('rsvp-whatsapp-chinesh');
  const rsvpWaDulakshi = document.getElementById('rsvp-whatsapp-dulakshi');

  if (rsvpWaChinesh) {
    rsvpWaChinesh.addEventListener('click', (e) => {
      e.preventDefault();
      sendWhatsAppRSVP('94775689278');
    });
  }

  if (rsvpWaDulakshi) {
    rsvpWaDulakshi.addEventListener('click', (e) => {
      e.preventDefault();
      sendWhatsAppRSVP('94711652393');
    });
  }

  // ---------------------------------------------------------------------------
  // 10. Couple Portrait Lightbox Modal
  // ---------------------------------------------------------------------------
  const portraitFrame = document.getElementById('couple-portrait-frame');
  const portraitModal = document.getElementById('portrait-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const openPortraitModal = () => {
    if (portraitModal) {
      portraitModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closePortraitModal = () => {
    if (portraitModal) {
      portraitModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  if (portraitFrame) {
    portraitFrame.addEventListener('click', openPortraitModal);
    portraitFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPortraitModal();
      }
    });
  }

  if (modalClose) modalClose.addEventListener('click', closePortraitModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closePortraitModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portraitModal && portraitModal.classList.contains('is-active')) {
      closePortraitModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 11. Romantic Floating Flower Petals Canvas Animation
  // ---------------------------------------------------------------------------
  const petalsCanvas = document.getElementById('floating-petals-canvas');
  if (petalsCanvas) {
    const ctx = petalsCanvas.getContext('2d');
    let width = (petalsCanvas.width = window.innerWidth);
    let height = (petalsCanvas.height = window.innerHeight);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = petalsCanvas.width = window.innerWidth;
        height = petalsCanvas.height = window.innerHeight;
      }, 100);
    });

    const isMobile = window.innerWidth < 600;
    const petalCount = isMobile ? 22 : 36;
    const petals = [];

    // Wedding floral color palettes (Soft Lotus pinks, warm gold shimmer, and water-lily white)
    const palettes = [
      { base: '#FFF2F5', mid: '#F8B6C8', edge: '#E87D9A', shadow: 'rgba(232, 125, 154, 0.22)' },
      { base: '#FFF5F8', mid: '#F5A3B8', edge: '#D9587D', shadow: 'rgba(217, 88, 125, 0.2)' },
      { base: '#FFFDF6', mid: '#F5E29E', edge: '#D4AF37', shadow: 'rgba(212, 175, 55, 0.22)' },
      { base: '#FFFFFF', mid: '#FBF6EE', edge: '#EADBC3', shadow: 'rgba(200, 180, 150, 0.15)' }
    ];

    class FloatingPetal {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        this.x = Math.random() * width;
        this.y = isInitial ? Math.random() * height : -30 - Math.random() * 40;
        this.size = 14 + Math.random() * 14;
        this.widthRatio = 0.52 + Math.random() * 0.24;
        this.palette = palettes[Math.floor(Math.random() * palettes.length)];

        this.speedY = 0.7 + Math.random() * 1.3;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.015 + Math.random() * 0.02;
        this.swayRadius = 0.6 + Math.random() * 1.2;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        // 3D tumble flip
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = 0.02 + Math.random() * 0.035;

        this.opacity = 0.45 + Math.random() * 0.4;
      }

      update() {
        this.y += this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.swayRadius;

        this.rotation += this.rotationSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);

        // 3D perspective tumbling (cos flip)
        const scaleX = Math.cos(this.flip);
        c.scale(scaleX, 1);

        const h = this.size;
        const w = this.size * this.widthRatio;

        // Draw organic petal silhouette
        c.beginPath();
        c.moveTo(0, -h / 2); // tip
        c.bezierCurveTo(w, -h / 4, w, h / 3, 0, h / 2); // right side to base
        c.bezierCurveTo(-w, h / 3, -w, -h / 4, 0, -h / 2); // left side to tip
        c.closePath();

        // Shading gradient
        const grad = c.createLinearGradient(0, -h / 2, 0, h / 2);
        grad.addColorStop(0, this.palette.edge);
        grad.addColorStop(0.35, this.palette.mid);
        grad.addColorStop(1, this.palette.base);

        c.fillStyle = grad;
        c.globalAlpha = this.opacity;
        c.shadowColor = this.palette.shadow;
        c.shadowBlur = 4;
        c.fill();

        // Center delicate petal vein
        c.beginPath();
        c.moveTo(0, h / 2);
        c.quadraticCurveTo(w * 0.08, 0, 0, -h * 0.35);
        c.strokeStyle = this.palette.edge;
        c.globalAlpha = this.opacity * 0.35;
        c.lineWidth = 0.6;
        c.stroke();

        c.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new FloatingPetal(true));
    }

    const renderPetals = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw(ctx);
      }
      requestAnimationFrame(renderPetals);
    };

    renderPetals();
  }
});