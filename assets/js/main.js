import { getContent } from "./contentStore.js";
import { initParticles } from "./particles.js";
import { attachReveal } from "./reveal.js";

const THEME_KEY = "portfolio.theme";

const dom = {
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  heroMarquee: document.getElementById("heroMarquee"),
  heroShots: document.getElementById("heroShots"),
  metricGrid: document.getElementById("metricGrid"),
  capabilityGrid: document.getElementById("capabilityGrid"),
  storyRail: document.getElementById("storyRail"),
  projectGallery: document.getElementById("projectGallery"),
  articleGrid: document.getElementById("articleGrid"),
  contactInfo: document.getElementById("contactInfo"),
  contactForm: document.getElementById("contactForm"),
  themeToggle: document.getElementById("themeToggle")
};

const content = getContent();
const safe = (value) => (Array.isArray(value) ? value : []);

const gradients = [
  "linear-gradient(135deg, #020617, #312e81)",
  "linear-gradient(135deg, #0f172a, #9333ea)",
  "linear-gradient(135deg, #111827, #2563eb)",
  "linear-gradient(135deg, #1f2937, #0ea5e9)",
  "linear-gradient(135deg, #0f172a, #22d3ee)"
];

const projectGradients = [
  "linear-gradient(140deg, #111827, #312e81)",
  "linear-gradient(140deg, #0f172a, #14b8a6)",
  "linear-gradient(140deg, #1c1917, #f97316)",
  "linear-gradient(140deg, #0f172a, #6366f1)"
];

function createHeroShot(entry, index) {
  const card = document.createElement("article");
  card.className = "hero-shot";
  card.style.setProperty("--shadow", "0 25px 70px rgba(15,15,15,0.3)");
  card.style.background = gradients[index % gradients.length];
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">${entry.label}</p>
    <p class="hero-shot__title">${entry.title}</p>
    <p class="hero-shot__meta">${entry.desc}</p>
    <p class="mt-4 text-sm text-white/80">${entry.meta || ""}</p>
  `;
  return card;
}

function createMetricPill(stat) {
  const pill = document.createElement("div");
  pill.className = "metric-pill flex-1 min-w-[240px]";
  pill.dataset.reveal = "false";
  pill.innerHTML = `
    <span class="text-xs uppercase tracking-[0.4em] text-slate-500">${stat.title}</span>
    <span class="text-3xl font-semibold">${stat.value}</span>
    <span class="text-sm text-slate-500">${stat.desc}</span>
  `;
  return pill;
}

function createCapabilityCard(skill) {
  const card = document.createElement("article");
  card.className = "rounded-[28px] border border-black/5 bg-white/70 p-6 shadow-panel dark:border-white/10 dark:bg-black/40";
  card.dataset.reveal = "false";
  const highlights = safe(skill.highlights)
    .map((tag) => `<span class="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-500 dark:border-white/20 dark:text-white/70">${tag}</span>`)
    .join("\n");
  card.innerHTML = `
    <div class="flex items-baseline justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-slate-500">Capability</p>
        <h3 class="text-2xl font-semibold">${skill.title}</h3>
      </div>
      <span class="text-4xl font-semibold text-slate-900 dark:text-white">${skill.score}</span>
    </div>
    <p class="mt-3 text-slate-500 dark:text-slate-300">${skill.desc}</p>
    <div class="mt-4 flex flex-wrap gap-2">${highlights}</div>
  `;
  return card;
}

function createStoryEntry(item) {
  const entry = document.createElement("article");
  entry.className = "flex flex-col gap-1 border-b border-black/5 pb-5 last:border-b-0 last:pb-0 dark:border-white/10";
  entry.dataset.reveal = "false";
  entry.innerHTML = `
    <p class="text-xs uppercase tracking-[0.3em] text-slate-500">${item.period}</p>
    <h3 class="text-2xl font-semibold">${item.role}</h3>
    <p class="text-slate-500 dark:text-slate-300">${item.detail}</p>
  `;
  return entry;
}

function createProjectPanel(project, index) {
  const card = document.createElement("article");
  card.className = "project-panel";
  card.style.background = projectGradients[index % projectGradients.length];
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="text-xs uppercase tracking-[0.4em] text-white/60">${project.metrics}</p>
    <h3 class="mt-3 text-3xl font-semibold">${project.name}</h3>
    <p class="mt-3 text-white/80">${project.desc}</p>
    <div class="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
      ${safe(project.tech)
        .map((t) => `<span class="rounded-full border border-white/30 px-3 py-1">${t}</span>`)
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
  card.className = "article-card";
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="text-xs uppercase tracking-[0.4em] text-slate-500">Insight</p>
    <h3 class="text-xl font-semibold">${article.title}</h3>
    <p class="text-slate-500 dark:text-slate-300">${article.summary}</p>
    <a class="inline-flex items-center gap-1 text-slate-900 underline-offset-4 hover:underline dark:text-white" href="${article.link}" target="_blank" rel="noopener">阅读全文</a>
  `;
  return card;
}

function renderContact(contactRaw) {
  const contact = contactRaw || { city: "", email: "", wechat: "", calendly: "", socials: [] };
  dom.contactInfo.dataset.reveal = "false";
  const socials = safe(contact.socials)
    .map(
      (item) =>
        `<li class="flex items-center justify-between border-b border-black/5 py-2 text-sm dark:border-white/10"><span class="text-slate-500">${item.label}</span><a class="font-semibold text-slate-900 dark:text-white" target="_blank" href="${item.url}">${item.handle}</a></li>`
    )
    .join("");
  dom.contactInfo.innerHTML = `
    <div class="rounded-[28px] border border-black/5 bg-white/80 p-6 shadow-panel dark:border-white/10 dark:bg-black/40">
      <p class="text-xs uppercase tracking-[0.4em] text-slate-500">Base</p>
      <h3 class="text-2xl font-semibold">${contact.city || ""}</h3>
      <ul class="mt-4 space-y-2 text-sm">
        <li class="flex items-center justify-between"><span class="text-slate-500">Mail</span><a class="font-semibold text-slate-900 dark:text-white" href="mailto:${contact.email || ""}">${contact.email || ""}</a></li>
        <li class="flex items-center justify-between"><span class="text-slate-500">WeChat</span><span class="font-semibold">${contact.wechat || ""}</span></li>
        <li class="flex items-center justify-between"><span class="text-slate-500">预约</span><a class="font-semibold text-slate-900 dark:text-white" target="_blank" href="${contact.calendly || "#"}">${contact.calendly || ""}</a></li>
      </ul>
      <ul class="mt-4 space-y-1">${socials}</ul>
    </div>
  `;
}

function renderHero(hero) {
  const title = hero.title || "你好，我是Guobin";
  dom.heroTitle.innerHTML = title.replace("Hi", '<span class="text-slate-400">Hi</span>');
  dom.heroSubtitle.textContent = hero.subtitle || "";

  const tags = safe(hero.tags);
  const marqueeItems = [...tags, ...tags].map((tag) => `<span class="marquee-pill">${tag}</span>`).join("\n");
  dom.heroMarquee.innerHTML = marqueeItems;

  const projects = safe(content.projects);
  const heroShotsData = [
    {
      label: hero.status?.title || "Focus",
      title: hero.status?.desc || hero.title || "Creating beautiful systems",
      desc: hero.status?.location || hero.subtitle || "",
      meta: "Current"
    },
    ...projects.slice(0, 2).map((project) => ({
      label: project.metrics,
      title: project.name,
      desc: project.desc,
      meta: safe(project.tech).join(" · ")
    }))
  ];
  const heroCards = heroShotsData.map(createHeroShot);
  dom.heroShots?.replaceChildren(...heroCards);
}

function render() {
  renderHero(content.hero);
  dom.metricGrid.replaceChildren(...safe(content.stats).map(createMetricPill));
  dom.capabilityGrid.replaceChildren(...safe(content.skills).map(createCapabilityCard));
  dom.storyRail.replaceChildren(...safe(content.timeline).map(createStoryEntry));
  dom.projectGallery.replaceChildren(...safe(content.projects).map(createProjectPanel));
  dom.articleGrid.replaceChildren(...safe(content.articles).map(createArticleCard));
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
    const body = encodeURIComponent(`${data.get("message")}` + `\n— ${data.get("email")}`);
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    dom.contactForm.reset();
  });
}

function setupTheme() {
  const saved = window.localStorage.getItem(THEME_KEY);
  const initial = saved || "light";
  document.documentElement.classList.toggle("dark", initial === "dark");
  dom.themeToggle.querySelector(".icon").textContent = initial === "light" ? "☀" : "☾";

  dom.themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const next = document.documentElement.classList.contains("dark") ? "dark" : "light";
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
