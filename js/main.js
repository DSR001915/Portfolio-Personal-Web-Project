// Portfolio interactions — no dependencies.

// Optional EmailJS setup. Leave these empty and the contact form opens the
// visitor's mail app with the message pre-filled instead.
const EMAILJS = {
  publicKey: "",
  serviceId: "",
  templateId: "",
};
const CONTACT_EMAIL = "dsraghuvanshi2002@gmail.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Mobile nav ----------
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav__toggle");
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav__links a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  })
);

// ---------- Active nav link while scrolling ----------
const navLinks = [...document.querySelectorAll(".nav__links a")];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
// Never leave content hidden when printing.
window.addEventListener("beforeprint", () =>
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"))
);

// ---------- Typed role line ----------
const typedEl = document.querySelector("[data-typed]");
if (typedEl) {
  const words = JSON.parse(typedEl.dataset.typed);
  const textEl = typedEl.querySelector(".typed-text");
  if (reduceMotion) {
    textEl.textContent = words[0];
  } else {
    let word = 0;
    let char = 0;
    let deleting = false;
    const tick = () => {
      const current = words[word];
      char += deleting ? -1 : 1;
      textEl.textContent = current.slice(0, char);
      let delay = deleting ? 40 : 80;
      if (!deleting && char === current.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && char === 0) {
        deleting = false;
        word = (word + 1) % words.length;
        delay = 300;
      }
      setTimeout(tick, delay);
    };
    tick();
  }
}

// ---------- Contact form ----------
const form = document.querySelector("#contact-form");
const statusEl = document.querySelector(".form__status");

function setStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.classList.toggle("is-ok", kind === "ok");
  statusEl.classList.toggle("is-err", kind === "err");
}

function loadEmailJs() {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js";
    s.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS.publicKey });
      resolve(window.emailjs);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const useEmailJs = EMAILJS.publicKey && EMAILJS.serviceId && EMAILJS.templateId;

  if (!useEmailJs) {
    const body = `${data.message}\n\n— ${data.name} (${data.email})`;
    const subject = data.subject || `Portfolio enquiry from ${data.name}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Opening your email app with the message ready to send…", "ok");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus("Sending…");
  try {
    const emailjs = await loadEmailJs();
    await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, data);
    setStatus("Thanks! Your message has been sent.", "ok");
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus(`Couldn't send right now. Please email ${CONTACT_EMAIL} directly.`, "err");
  } finally {
    button.disabled = false;
  }
});

// ---------- Subtle parallax on floating shapes ----------
if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const shapes = document.querySelectorAll(".shape");
  let frame = null;
  window.addEventListener("pointermove", (e) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      shapes.forEach((shape, i) => {
        const depth = ((i % 4) + 1) * 6;
        shape.style.translate = `${-x * depth}px ${-y * depth}px`;
      });
      frame = null;
    });
  });
}

// ---------- Footer year ----------
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================================================
// Motion & interaction layer
// =========================================================

const finePointer = window.matchMedia("(pointer: fine)").matches;

// ---------- Staggered children ----------
const staggerGroups = document.querySelectorAll(
  ".tiles, .services, .repos, .bubbles, .process, .hex-row, .timeline, .stats"
);
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const group = entry.target;
      group.classList.add("is-visible");
      staggerObserver.unobserve(group);
      // Drop the stagger delays once in, so hover transitions stay snappy.
      setTimeout(() => group.classList.add("stagger-done"), group.children.length * 70 + 800);
    });
  },
  { threshold: 0.15 }
);
staggerGroups.forEach((group) => {
  group.classList.add("stagger");
  [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  staggerObserver.observe(group);
});

// ---------- Section title underlines ----------
document.querySelectorAll(".section-title").forEach((el) => revealObserver.observe(el));

// ---------- Count-up stats ----------
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countObserver.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (reduceMotion) return;
      const start = performance.now();
      const duration = 1400;
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ---------- Scroll progress, nav shadow, back-to-top ----------
const progressEl = document.querySelector(".scroll-progress");
const toTop = document.querySelector(".to-top");
let scrollTicking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY;
  progressEl?.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
  nav?.classList.toggle("is-scrolled", y > 40);
  toTop?.classList.toggle("is-visible", y > 700);
  scrollTicking = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);
onScroll();

// ---------- 3D tilt + spotlight cards ----------
if (finePointer && !reduceMotion) {
  const tiltCards = document.querySelectorAll(
    ".hero__intro, .mini, .project, .tile, .service, .repo, .bubble__card"
  );
  tiltCards.forEach((card) => {
    card.classList.add("tilt");
    const max = card.classList.contains("tile") ? 14 : 6;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-3px)`;
      card.classList.add("is-tilting");
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });

  // ---------- Magnetic buttons ----------
  document.querySelectorAll(".btn, .icon-btn, .to-top").forEach((btn) => {
    btn.classList.add("is-magnetic");
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });

  // ---------- Cursor glow ----------
  const glow = document.querySelector(".cursor-glow");
  if (glow) {
    window.addEventListener("pointermove", (e) => {
      glow.style.setProperty("--cx", `${e.clientX}px`);
      glow.style.setProperty("--cy", `${e.clientY}px`);
      glow.classList.add("is-on");
    });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-on"));
  }
}

// ---------- Particle network background ----------
const canvas = document.querySelector(".bg-net");
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const pointer = { x: -9999, y: -9999 };
  let particles = [];
  let width = 0;
  let height = 0;
  let running = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, (width * height) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const LINK = 130;
  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      // gentle push away from the pointer
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 140 * 140 && d2 > 0) {
        const f = (1 - Math.sqrt(d2) / 140) * 0.6;
        p.x += (dx / Math.sqrt(d2)) * f;
        p.y += (dy / Math.sqrt(d2)) * f;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK) {
          ctx.strokeStyle = `rgba(62, 232, 246, ${(1 - dist / LINK) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(160, 245, 255, 0.8)";
      ctx.shadowColor = "#3ee8f6";
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) draw();
  });
}
