import { getContent, saveContent, resetContent, defaultContent } from "./contentStore.js";

const tabs = [
  { id: "hero", label: "Hero区域" },
  { id: "stats", label: "数据指标" },
  { id: "skills", label: "能力矩阵" },
  { id: "timeline", label: "经历时间线" },
  { id: "projects", label: "项目案例" },
  { id: "articles", label: "内容输出" },
  { id: "contact", label: "联系信息" }
];

let content = getContent();
let activeTab = tabs[0].id;

const dom = {
  tabs: document.getElementById("tabs"),
  panel: document.getElementById("panelContent"),
  reset: document.getElementById("resetButton"),
  exportBtn: document.getElementById("exportButton"),
  importBtn: document.getElementById("importButton")
};

function persist() {
  saveContent(content);
}

function createInput(label, value, { multiline = false, type = "text", onChange, placeholder } = {}) {
  const wrapper = document.createElement("label");
  wrapper.className = "flex flex-col gap-2 text-sm text-slate-500";
  const span = document.createElement("span");
  span.textContent = label;
  const field = multiline ? document.createElement("textarea") : document.createElement("input");
  field.value = value ?? "";
  if (!multiline) field.type = type;
  if (placeholder) field.placeholder = placeholder;
  field.className =
    "w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-white/15 dark:bg-slate-900/70 dark:text-white";
  field.addEventListener("input", (event) => onChange(event.target.value));
  wrapper.append(span, field);
  return wrapper;
}

function createGroup(title, { defaultOpen = true } = {}) {
  const section = document.createElement("section");
  section.className =
    "rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/70";
  const header = document.createElement("button");
  header.type = "button";
  header.className =
    "flex w-full items-center justify-between gap-3 text-left text-xl font-semibold text-slate-900 dark:text-white";
  const label = document.createElement("span");
  label.textContent = title;
  const indicator = document.createElement("span");
  indicator.className = "text-sm font-medium text-slate-500";
  header.append(label, indicator);
  const body = document.createElement("div");
  body.className = "mt-4 space-y-4";

  let open = defaultOpen;
  const sync = () => {
    indicator.textContent = open ? "收起" : "展开";
    body.hidden = !open;
    section.dataset.open = open ? "true" : "false";
  };
  header.addEventListener("click", () => {
    open = !open;
    sync();
  });
  sync();

  section.append(header, body);
  return { section, body, setOpen: (value) => ((open = value), sync()) };
}

function moveItem(list, from, to) {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

function createEntryActions({ index, total, onRemove, onMove }) {
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-end gap-2 pt-3";

  const createBtn = (label, handler, disabled) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.disabled = disabled;
    btn.className = [
      "inline-flex items-center rounded-full border border-slate-200/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:-translate-y-0.5 dark:border-white/20 dark:text-white",
      disabled ? "opacity-50 cursor-not-allowed" : ""
    ].join(" ");
    if (!disabled) btn.addEventListener("click", handler);
    return btn;
  };

  wrapper.append(
    createBtn("↑ 上移", () => onMove(index - 1), index === 0),
    createBtn("↓ 下移", () => onMove(index + 1), index === total - 1),
    createBtn("✕ 删除", onRemove, false)
  );

  return wrapper;
}

function renderHeroPanel() {
  const heroGroup = createGroup("主视觉");
  heroGroup.body.append(
    createInput("标题", content.hero.title, {
      onChange: (value) => {
        content.hero.title = value;
        persist();
      }
    }),
    createInput("副标题", content.hero.subtitle, {
      multiline: true,
      onChange: (value) => {
        content.hero.subtitle = value;
        persist();
      }
    }),
    createInput("封面图 URL", content.hero.cover || "", {
      onChange: (value) => {
        content.hero.cover = value;
        persist();
      }
    }),
    createInput("标签（逗号分隔）", content.hero.tags.join(", "), {
      multiline: true,
      onChange: (value) => {
        content.hero.tags = value.split(",").map((v) => v.trim()).filter(Boolean);
        persist();
      }
    })
  );

  const statusGroup = createGroup("焦点状态卡");
  statusGroup.body.append(
    createInput("标题", content.hero.status.title, {
      onChange: (value) => {
        content.hero.status.title = value;
        persist();
      }
    }),
    createInput("描述", content.hero.status.desc, {
      multiline: true,
      onChange: (value) => {
        content.hero.status.desc = value;
        persist();
      }
    }),
    createInput("地点", content.hero.status.location, {
      onChange: (value) => {
        content.hero.status.location = value;
        persist();
      }
    })
  );

  dom.panel.replaceChildren(heroGroup.section, statusGroup.section);
}

function makeRepeater(items, factory, addItem) {
  const container = document.createElement("div");
  container.className = "space-y-4";
  items.forEach((item, index) => container.appendChild(factory(item, index, items)));

  const actions = document.createElement("div");
  actions.className = "flex justify-end gap-3 pt-2";
  const addButton = document.createElement("button");
  addButton.className =
    "inline-flex items-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5";
  addButton.type = "button";
  addButton.textContent = "新增";
  addButton.addEventListener("click", addItem);
  actions.appendChild(addButton);
  container.appendChild(actions);
  return container;
}

function renderStatsPanel() {
  const group = createGroup("核心指标");
  const repeater = makeRepeater(
    content.stats,
    (stat, index, list) => {
      const item = document.createElement("article");
      item.className =
        "rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 dark:border-white/20 dark:bg-slate-900/60";
      item.append(
        createInput("标题", stat.title, {
          onChange: (value) => {
            content.stats[index].title = value;
            persist();
          }
        }),
        createInput("值", stat.value, {
          onChange: (value) => {
            content.stats[index].value = value;
            persist();
          }
        }),
        createInput("描述", stat.desc, {
          multiline: true,
          onChange: (value) => {
            content.stats[index].desc = value;
            persist();
          }
        })
      );
      item.appendChild(
        createEntryActions({
          index,
          total: list.length,
          onRemove: () => {
            content.stats.splice(index, 1);
            persist();
            renderStatsPanel();
          },
          onMove: (nextIndex) => {
            moveItem(content.stats, index, nextIndex);
            persist();
            renderStatsPanel();
          }
        })
      );
      return item;
    },
    () => {
      content.stats.push({ title: "", value: "", desc: "" });
      persist();
      renderStatsPanel();
    }
  );
  group.body.appendChild(repeater);
  dom.panel.replaceChildren(group.section);
}

function renderSkillsPanel() {
  const group = createGroup("能力矩阵");
  const repeater = makeRepeater(
    content.skills,
    (skill, index, list) => {
      const item = document.createElement("article");
      item.className =
        "rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 dark:border-white/20 dark:bg-slate-900/60";
      item.append(
        createInput("名称", skill.title, {
          onChange: (value) => {
            content.skills[index].title = value;
            persist();
          }
        }),
        createInput("描述", skill.desc, {
          multiline: true,
          onChange: (value) => {
            content.skills[index].desc = value;
            persist();
          }
        }),
        createInput("分值 (0-100)", skill.score, {
          type: "number",
          onChange: (value) => {
            content.skills[index].score = Number(value);
            persist();
          }
        }),
        createInput("亮点（逗号）", skill.highlights.join(", "), {
          multiline: true,
          onChange: (value) => {
            content.skills[index].highlights = value.split(",").map((v) => v.trim()).filter(Boolean);
            persist();
          }
        })
      );
      item.appendChild(
        createEntryActions({
          index,
          total: list.length,
          onRemove: () => {
            content.skills.splice(index, 1);
            persist();
            renderSkillsPanel();
          },
          onMove: (nextIndex) => {
            moveItem(content.skills, index, nextIndex);
            persist();
            renderSkillsPanel();
          }
        })
      );
      return item;
    },
    () => {
      content.skills.push({ title: "", desc: "", score: 50, highlights: [] });
      persist();
      renderSkillsPanel();
    }
  );
  group.body.appendChild(repeater);
  dom.panel.replaceChildren(group.section);
}

function renderTimelinePanel() {
  const group = createGroup("经历");
  const repeater = makeRepeater(
    content.timeline,
    (timeline, index, list) => {
      const item = document.createElement("article");
      item.className =
        "rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 dark:border-white/20 dark:bg-slate-900/60";
      item.append(
        createInput("时间段", timeline.period, {
          onChange: (value) => {
            content.timeline[index].period = value;
            persist();
          }
        }),
        createInput("角色", timeline.role, {
          onChange: (value) => {
            content.timeline[index].role = value;
            persist();
          }
        }),
        createInput("描述", timeline.detail, {
          multiline: true,
          onChange: (value) => {
            content.timeline[index].detail = value;
            persist();
          }
        })
      );
      item.appendChild(
        createEntryActions({
          index,
          total: list.length,
          onRemove: () => {
            content.timeline.splice(index, 1);
            persist();
            renderTimelinePanel();
          },
          onMove: (nextIndex) => {
            moveItem(content.timeline, index, nextIndex);
            persist();
            renderTimelinePanel();
          }
        })
      );
      return item;
    },
    () => {
      content.timeline.push({ period: "", role: "", detail: "" });
      persist();
      renderTimelinePanel();
    }
  );
  group.body.appendChild(repeater);
  dom.panel.replaceChildren(group.section);
}

function renderProjectsPanel() {
  const group = createGroup("项目案例");
  const repeater = makeRepeater(
    content.projects,
    (project, index, list) => {
      const item = document.createElement("article");
      item.className =
        "rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 dark:border-white/20 dark:bg-slate-900/60";
      item.append(
        createInput("名称", project.name, {
          onChange: (value) => {
            content.projects[index].name = value;
            persist();
          }
        }),
        createInput("亮点指标", project.metrics, {
          onChange: (value) => {
            content.projects[index].metrics = value;
            persist();
          }
        }),
        createInput("描述", project.desc, {
          multiline: true,
          onChange: (value) => {
            content.projects[index].desc = value;
            persist();
          }
        }),
        createInput("封面图 URL", project.cover || "", {
          onChange: (value) => {
            content.projects[index].cover = value;
            persist();
          }
        }),
        createInput("技术栈（逗号）", project.tech.join(", "), {
          onChange: (value) => {
            content.projects[index].tech = value.split(",").map((v) => v.trim()).filter(Boolean);
            persist();
          }
        }),
        createInput("链接", project.link, {
          onChange: (value) => {
            content.projects[index].link = value;
            persist();
          }
        })
      );
      item.appendChild(
        createEntryActions({
          index,
          total: list.length,
          onRemove: () => {
            content.projects.splice(index, 1);
            persist();
            renderProjectsPanel();
          },
          onMove: (nextIndex) => {
            moveItem(content.projects, index, nextIndex);
            persist();
            renderProjectsPanel();
          }
        })
      );
      return item;
    },
    () => {
      content.projects.push({ name: "", desc: "", metrics: "", tech: [], link: "", cover: "" });
      persist();
      renderProjectsPanel();
    }
  );
  group.body.appendChild(repeater);
  dom.panel.replaceChildren(group.section);
}

function renderArticlesPanel() {
  const group = createGroup("文章输出");
  const repeater = makeRepeater(
    content.articles,
    (article, index, list) => {
      const item = document.createElement("article");
      item.className =
        "rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 dark:border-white/20 dark:bg-slate-900/60";
      item.append(
        createInput("标题", article.title, {
          onChange: (value) => {
            content.articles[index].title = value;
            persist();
          }
        }),
        createInput("摘要", article.summary, {
          multiline: true,
          onChange: (value) => {
            content.articles[index].summary = value;
            persist();
          }
        }),
        createInput("链接", article.link, {
          onChange: (value) => {
            content.articles[index].link = value;
            persist();
          }
        })
      );
      item.appendChild(
        createEntryActions({
          index,
          total: list.length,
          onRemove: () => {
            content.articles.splice(index, 1);
            persist();
            renderArticlesPanel();
          },
          onMove: (nextIndex) => {
            moveItem(content.articles, index, nextIndex);
            persist();
            renderArticlesPanel();
          }
        })
      );
      return item;
    },
    () => {
      content.articles.push({ title: "", summary: "", link: "" });
      persist();
      renderArticlesPanel();
    }
  );
  group.body.appendChild(repeater);
  dom.panel.replaceChildren(group.section);
}

function renderContactPanel() {
  const group = createGroup("联系方式");
  group.body.append(
    createInput("城市", content.contact.city, {
      onChange: (value) => {
        content.contact.city = value;
        persist();
      }
    }),
    createInput("邮箱", content.contact.email, {
      type: "email",
      onChange: (value) => {
        content.contact.email = value;
        persist();
      }
    }),
    createInput("微信", content.contact.wechat, {
      onChange: (value) => {
        content.contact.wechat = value;
        persist();
      }
    }),
    createInput("预约链接", content.contact.calendly, {
      onChange: (value) => {
        content.contact.calendly = value;
        persist();
      }
    })
  );

  const socialGroup = createGroup("社交媒体");
  const socialRepeater = makeRepeater(
    content.contact.socials,
    (social, index, list) => {
      const article = document.createElement("article");
      article.className =
        "rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-4 dark:border-white/20 dark:bg-slate-900/60";
      article.append(
        createInput("平台", social.label, {
          onChange: (value) => {
            content.contact.socials[index].label = value;
            persist();
          }
        }),
        createInput("展示名称", social.handle, {
          onChange: (value) => {
            content.contact.socials[index].handle = value;
            persist();
          }
        }),
        createInput("链接", social.url, {
          onChange: (value) => {
            content.contact.socials[index].url = value;
            persist();
          }
        })
      );
      article.appendChild(
        createEntryActions({
          index,
          total: list.length,
          onRemove: () => {
            content.contact.socials.splice(index, 1);
            persist();
            renderContactPanel();
          },
          onMove: (nextIndex) => {
            moveItem(content.contact.socials, index, nextIndex);
            persist();
            renderContactPanel();
          }
        })
      );
      return article;
    },
    () => {
      content.contact.socials.push({ label: "", url: "", handle: "" });
      persist();
      renderContactPanel();
    }
  );

  socialGroup.body.appendChild(socialRepeater);

  dom.panel.replaceChildren(group.section, socialGroup.section);
}

function renderTabs() {
  dom.tabs.innerHTML = "";
  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    const isActive = tab.id === activeTab;
    button.className = [
      "rounded-full px-5 py-2 text-sm font-semibold transition",
      isActive
        ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
        : "border border-slate-200/70 bg-white/70 text-slate-600 hover:-translate-y-0.5 dark:border-white/15 dark:bg-transparent dark:text-slate-200"
    ].join(" ");
    button.textContent = tab.label;
    button.addEventListener("click", () => {
      activeTab = tab.id;
      renderTabs();
      renderPanel();
    });
    dom.tabs.appendChild(button);
  });
}

function renderPanel() {
  const map = {
    hero: renderHeroPanel,
    stats: renderStatsPanel,
    skills: renderSkillsPanel,
    timeline: renderTimelinePanel,
    projects: renderProjectsPanel,
    articles: renderArticlesPanel,
    contact: renderContactPanel
  };
  map[activeTab]();
}

dom.reset.addEventListener("click", () => {
  if (!confirm("确认恢复默认示例内容？")) return;
  resetContent();
  content = JSON.parse(JSON.stringify(defaultContent));
  persist();
  renderPanel();
});

function exportContent() {
  const data = JSON.stringify(content, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "portfolio-content.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importContentFlow() {
  const raw = window.prompt("粘贴 JSON 内容，或留空取消：", JSON.stringify(content, null, 2));
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    saveContent(parsed);
    content = getContent();
    renderPanel();
    alert("导入成功，已同步到本地存储。");
  } catch (err) {
    alert("导入失败，请确认 JSON 格式正确。");
  }
}

dom.exportBtn.addEventListener("click", exportContent);
dom.importBtn.addEventListener("click", importContentFlow);

renderTabs();
renderPanel();
