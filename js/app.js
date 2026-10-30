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

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        if (bgMusic) bgMusic.pause();
        stopAmbientSynth();
        musicToggle.classList.remove('playing');
        if (musicIcon) {
          musicIcon.className = 'ti ti-volume-off';
        }
        isPlaying = false;
      } else {
        if (bgMusic && bgMusic.src) {
          const playPromise = bgMusic.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                musicToggle.classList.add('playing');
                if (musicIcon) musicIcon.className = 'ti ti-volume';
                isPlaying = true;
              })
              .catch(() => {
                // If local audio file is missing or blocked, start ambient harmonic synth
                startAmbientSynth();
                musicToggle.classList.add('playing');
                if (musicIcon) musicIcon.className = 'ti ti-volume';
                isPlaying = true;
              });
          }
        } else {
          startAmbientSynth();
          musicToggle.classList.add('playing');
          if (musicIcon) musicIcon.className = 'ti ti-volume';
          isPlaying = true;
        }
      }
    });
  }

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

  // Quick WhatsApp RSVP Option Handler
  if (rsvpWhatsappBtn) {
    rsvpWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim() || 'Guest';
      const attending = document.getElementById('rsvp-attending').value;
      const guests = document.getElementById('rsvp-guests').value;
      const message = document.getElementById('rsvp-msg').value.trim();

      const text = encodeURIComponent(
        `*Wedding RSVP - Chinesh & Dulakshi*\n` +
        `👤 *Name:* ${name}\n` +
        `💌 *Attending:* ${attending}\n` +
        `👥 *Guests:* ${guests}\n` +
        (message ? `💬 *Wishes:* ${message}\n` : '') +
        `✨ Looking forward to December 7th, 2026!`
      );

      // Send to WhatsApp (+94 71 165 2393)
      window.open(`https://wa.me/94711652393?text=${text}`, '_blank');
    });
  }
});