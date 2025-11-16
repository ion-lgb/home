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

function createStatCard(stat) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="eyebrow">${stat.title}</p>
    <p class="stat-value">${stat.value}</p>
    <p class="muted">${stat.desc}</p>
  `;
  return card;
}

function createSkillCard(skill) {
  const card = document.createElement("article");
  card.className = "skill-card";
  card.dataset.reveal = "false";
  const highlights = skill.highlights.map((tag) => `<span>${tag}</span>`).join("\n");
  card.innerHTML = `
    <div>
      <p class="eyebrow">能力指数</p>
      <h3>${skill.title}</h3>
      <p class="muted">${skill.desc}</p>
    </div>
    <div class="skill-card__meter"><span style="width:${skill.score}%"></span></div>
    <div class="hero__tags">${highlights}</div>
  `;
  return card;
}

function createTimelineItem(item) {
  const container = document.createElement("article");
  container.className = "timeline__item";
  container.dataset.reveal = "false";
  container.innerHTML = `
    <div>
      <p class="eyebrow">${item.period}</p>
    </div>
    <div>
      <h3>${item.role}</h3>
      <p class="muted">${item.detail}</p>
    </div>
  `;
  return container;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.reveal = "false";
  card.innerHTML = `
    <div class="eyebrow">${project.metrics}</div>
    <h3>${project.name}</h3>
    <p class="muted">${project.desc}</p>
    <div class="project-card__tech">
      ${project.tech.map((t) => `<span>${t}</span>`).join("\n")}
    </div>
  `;
  card.addEventListener("click", () => {
    window.open(project.link, "_blank");
  });
  return card;
}

function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = "article-card";
  card.dataset.reveal = "false";
  card.innerHTML = `
    <p class="eyebrow">INSIGHT</p>
    <h3>${article.title}</h3>
    <p class="muted">${article.summary}</p>
    <a href="${article.link}" target="_blank">阅读全文 →</a>
  `;
  return card;
}

function renderContact(contactRaw) {
  const contact = contactRaw || { city: "", email: "", wechat: "", calendly: "", socials: [] };
  dom.contactInfo.dataset.reveal = "false";
  const socials = safe(contact.socials);
  dom.contactInfo.innerHTML = `
    <p class="eyebrow">Base</p>
    <h3>${contact.city || ""}</h3>
    <ul class="contact-list">
      <li><span>Mail</span><a href="mailto:${contact.email || ""}">${contact.email || ""}</a></li>
      <li><span>WeChat</span><em>${contact.wechat || ""}</em></li>
      <li><span>预约沟通</span><a target="_blank" href="${contact.calendly || "#"}">${contact.calendly || ""}</a></li>
      ${socials
        .map(
          (item) =>
            `<li><span>${item.label}</span><a target="_blank" href="${item.url}">${item.handle}</a></li>`
        )
        .join("")}
    </ul>
  `;
}

function initHero(hero) {
  const heroTitle = hero.title || "你好，我是Guobin";
  const tags = safe(hero.tags);
  const status = hero.status || { title: "Focus", desc: "", location: "" };
  dom.heroTitle.innerHTML = heroTitle.replace("Hi", '<span class="accent">Hi</span>');
  dom.heroSubtitle.textContent = hero.subtitle || "";
  dom.heroTags.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("\n");
  dom.statusCard.innerHTML = `
    <p class="eyebrow">${status.title}</p>
    <p>${status.desc}</p>
    <p class="muted">${status.location}</p>
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
  const saved = window.localStorage.getItem(THEME_KEY) || "dark";
  if (saved === "light") document.body.classList.add("light");
  dom.themeToggle.querySelector(".icon").textContent = saved === "light" ? "☀" : "☾";

  dom.themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const next = document.body.classList.contains("light") ? "light" : "dark";
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
