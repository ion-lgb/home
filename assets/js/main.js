import { getContent } from "./contentStore.js";
import { initParticles } from "./particles.js";
import { attachReveal } from "./reveal.js";

const THEME_KEY = "portfolio.theme";

const dom = {
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  heroTags: document.getElementById("heroTags"),
  statGrid: document.getElementById("statGrid"),
  skillGrid: document.getElementById("skillGrid"),
  timelineList: document.getElementById("timelineList"),
  projectGrid: document.getElementById("projectGrid"),
  articleList: document.getElementById("articleList"),
  contactInfo: document.getElementById("contactInfo"),
  statusCard: document.getElementById("statusCard"),
  contactForm: document.getElementById("contactForm"),
  themeToggle: document.getElementById("themeToggle")
};

const content = getContent();
const safe = (value) => (Array.isArray(value) ? value : []);

const cardShell =
  "glass-panel rounded-3xl border border-white/60 dark:border-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl";
const pillClass =
  "inline-flex items-center rounded-full border border-white/40 bg-white/80 px-4 py-1 text-sm font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100";

function createStatCard(stat) {
  const card = document.createElement("article");
  card.className = `${cardShell} flex flex-col gap-2`;
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">${stat.title}</p>
    <p class="text-4xl font-semibold text-slate-900 dark:text-white">${stat.value}</p>
    <p class="text-base text-slate-500 dark:text-slate-300">${stat.desc}</p>
  `;
  return card;
}

function createSkillCard(skill) {
  const highlights = safe(skill.highlights)
    .map((tag) => `<span class="${pillClass} bg-slate-100/60 dark:bg-slate-800">${tag}</span>`)
    .join("\n");
  const card = document.createElement("article");
  card.className = `${cardShell} flex flex-col gap-4`;
  card.dataset.reveal = "false";
  card.innerHTML = `
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">能力指数</p>
      <h3 class="text-xl font-semibold">${skill.title}</h3>
      <p class="text-slate-500 dark:text-slate-300">${skill.desc}</p>
    </div>
    <div class="h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/70">
      <span class="block h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-400 to-accent-500" style="width:${skill.score}%"></span>
    </div>
    <div class="flex flex-wrap gap-2 text-sm">${highlights}</div>
  `;
  return card;
}

function createTimelineItem(item) {
  const container = document.createElement("article");
  container.className = `${cardShell} grid gap-4 md:grid-cols-[140px,1fr]`;
  container.dataset.reveal = "false";
  container.innerHTML = `
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">${item.period}</p>
    </div>
    <div>
      <h3 class="text-xl font-semibold">${item.role}</h3>
      <p class="text-slate-500 dark:text-slate-300">${item.detail}</p>
    </div>
  `;
  return container;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = `${cardShell} cursor-pointer`;
  card.dataset.reveal = "false";
  card.innerHTML = `
    <div class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">${project.metrics}</div>
    <h3 class="mt-2 text-2xl font-semibold">${project.name}</h3>
    <p class="mt-2 text-slate-500 dark:text-slate-300">${project.desc}</p>
    <div class="mt-4 flex flex-wrap gap-2 text-sm">
      ${project.tech
        .map(
          (t) =>
            `<span class="rounded-full bg-slate-100/70 px-3 py-1 text-slate-600 dark:bg-slate-800/80 dark:text-slate-200">${t}</span>`
        )
        .join("\n")}
    </div>
  `;
  card.addEventListener("click", () => {
    if (project.link) window.open(project.link, "_blank");
  });
  return card;
}

function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = `${cardShell} space-y-3`;
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">INSIGHT</p>
    <h3 class="text-xl font-semibold">${article.title}</h3>
    <p class="text-slate-500 dark:text-slate-300">${article.summary}</p>
    <a class="inline-flex items-center text-brand-600 hover:text-brand-500" href="${article.link}" target="_blank" rel="noopener">阅读全文 →</a>
  `;
  return card;
}

function renderContact(contactRaw) {
  const contact = contactRaw || { city: "", email: "", wechat: "", calendly: "", socials: [] };
  dom.contactInfo.dataset.reveal = "false";
  const socials = safe(contact.socials);
  dom.contactInfo.innerHTML = `
    <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Base</p>
    <h3 class="text-2xl font-semibold">${contact.city || ""}</h3>
    <div class="space-y-3 text-sm">
      <div class="flex items-center justify-between gap-4">
        <span class="text-slate-500">Mail</span><a class="font-semibold text-brand-600" href="mailto:${contact.email || ""}">${contact.email || ""}</a>
      </div>
      <div class="flex items-center justify-between gap-4">
        <span class="text-slate-500">WeChat</span><span class="font-semibold">${contact.wechat || ""}</span>
      </div>
      <div class="flex items-center justify-between gap-4">
        <span class="text-slate-500">预约沟通</span><a class="font-semibold text-brand-600" target="_blank" href="${contact.calendly || "#"}">${contact.calendly || ""}</a>
      </div>
      ${socials
        .map(
          (item) => `
            <div class="flex items-center justify-between gap-4">
              <span class="text-slate-500">${item.label}</span>
              <a class="font-semibold text-brand-600" target="_blank" href="${item.url}">${item.handle}</a>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function initHero(hero) {
  const heroTitle = hero.title || "你好，我是Guobin";
  const tags = safe(hero.tags);
  const status = hero.status || { title: "Focus", desc: "", location: "" };
  dom.heroTitle.innerHTML = heroTitle.replace("Hi", '<span class="text-accent-500">Hi</span>');
  dom.heroSubtitle.textContent = hero.subtitle || "";
  dom.heroTags.innerHTML = tags
    .map((tag) => `<span class="${pillClass}">${tag}</span>`)
    .join("\n");
  dom.statusCard.innerHTML = `
    <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">${status.title}</p>
    <p class="mt-2 text-base font-semibold text-slate-900 dark:text-white">${status.desc}</p>
    <p class="text-sm text-slate-500 dark:text-slate-300">${status.location}</p>
  `;

  const phrases = tags.length ? [...tags] : ["Exploring new forms"];
  let idx = 0;
  const statusText = dom.statusCard.querySelector("p:nth-child(2)");
  if (!statusText) return;

  setInterval(() => {
    idx = (idx + 1) % phrases.length;
    dom.statusCard.classList.add("shimmer");
    statusText.textContent = phrases[idx];
    setTimeout(() => dom.statusCard.classList.remove("shimmer"), 600);
  }, 3200);
}

function render() {
  initHero(content.hero);
  dom.statGrid.replaceChildren(...safe(content.stats).map(createStatCard));
  dom.skillGrid.replaceChildren(...safe(content.skills).map(createSkillCard));
  dom.timelineList.replaceChildren(...safe(content.timeline).map(createTimelineItem));
  dom.projectGrid.replaceChildren(...safe(content.projects).map(createProjectCard));
  dom.articleList.replaceChildren(...safe(content.articles).map(createArticleCard));
  renderContact(content.contact);
  document.getElementById("year").textContent = new Date().getFullYear();
  attachReveal();
}

function setupForm() {
  const targetEmail = content.contact?.email || "hello@example.com";
  dom.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(dom.contactForm);
    const subject = encodeURIComponent(`来自 ${data.get("name")} 的合作意向`);
    const body = encodeURIComponent(`${data.get("message")}\n— ${data.get("email")}`);
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    dom.contactForm.reset();
  });
}

function setupTheme() {
  const saved = window.localStorage.getItem(THEME_KEY);
  const initial = saved || "light";
  const root = document.documentElement;
  root.classList.toggle("dark", initial === "dark");
  dom.themeToggle.querySelector(".icon").textContent = initial === "light" ? "☀" : "☾";

  dom.themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");
    const next = root.classList.contains("dark") ? "dark" : "light";
    window.localStorage.setItem(THEME_KEY, next);
    dom.themeToggle.querySelector(".icon").textContent = next === "light" ? "☀" : "☾";
  });
}

function init() {
  render();
  setupForm();
  setupTheme();
  initParticles();
}

init();
