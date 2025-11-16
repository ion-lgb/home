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
  reset: document.getElementById("resetButton")
};

function persist() {
  saveContent(content);
}

function createInput(label, value, { multiline = false, type = "text", onChange, placeholder } = {}) {
  const wrapper = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = label;
  const field = multiline ? document.createElement("textarea") : document.createElement("input");
  field.value = value ?? "";
  field.type = type;
  if (placeholder) field.placeholder = placeholder;
  field.addEventListener("input", (event) => onChange(event.target.value));
  wrapper.append(span, field);
  return wrapper;
}

function createGroup(title) {
  const group = document.createElement("section");
  group.className = "panel__group";
  const heading = document.createElement("h3");
  heading.textContent = title;
  group.appendChild(heading);
  return group;
}

function renderHeroPanel() {
  const group = createGroup("主视觉");
  group.append(
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
    createInput("标签（逗号分隔）", content.hero.tags.join(", "), {
      multiline: true,
      onChange: (value) => {
        content.hero.tags = value.split(",").map((v) => v.trim()).filter(Boolean);
        persist();
      }
    })
  );

  const statusGroup = createGroup("焦点状态卡");
  statusGroup.append(
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

  dom.panel.replaceChildren(group, statusGroup);
}

function makeRepeater(items, factory, addItem) {
  const container = document.createElement("div");
  container.className = "repeaters";
  items.forEach((item, index) => container.appendChild(factory(item, index)));

  const actions = document.createElement("div");
  actions.className = "repeater-actions";
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "新增";
  addButton.className = "primary";
  addButton.addEventListener("click", addItem);
  actions.appendChild(addButton);
  container.appendChild(actions);
  return container;
}

function renderStatsPanel() {
  const group = createGroup("核心指标");
  const repeater = makeRepeater(
    content.stats,
    (stat, index) => {
      const item = document.createElement("article");
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.className = "secondary";
      remove.addEventListener("click", () => {
        content.stats.splice(index, 1);
        persist();
        renderStatsPanel();
      });
      item.appendChild(remove);
      return item;
    },
    () => {
      content.stats.push({ title: "", value: "", desc: "" });
      persist();
      renderStatsPanel();
    }
  );
  group.appendChild(repeater);
  dom.panel.replaceChildren(group);
}

function renderSkillsPanel() {
  const group = createGroup("能力矩阵");
  const repeater = makeRepeater(
    content.skills,
    (skill, index) => {
      const item = document.createElement("article");
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.className = "secondary";
      remove.addEventListener("click", () => {
        content.skills.splice(index, 1);
        persist();
        renderSkillsPanel();
      });
      item.appendChild(remove);
      return item;
    },
    () => {
      content.skills.push({ title: "", desc: "", score: 50, highlights: [] });
      persist();
      renderSkillsPanel();
    }
  );
  group.appendChild(repeater);
  dom.panel.replaceChildren(group);
}

function renderTimelinePanel() {
  const group = createGroup("经历");
  const repeater = makeRepeater(
    content.timeline,
    (timeline, index) => {
      const item = document.createElement("article");
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.className = "secondary";
      remove.addEventListener("click", () => {
        content.timeline.splice(index, 1);
        persist();
        renderTimelinePanel();
      });
      item.appendChild(remove);
      return item;
    },
    () => {
      content.timeline.push({ period: "", role: "", detail: "" });
      persist();
      renderTimelinePanel();
    }
  );
  group.appendChild(repeater);
  dom.panel.replaceChildren(group);
}

function renderProjectsPanel() {
  const group = createGroup("项目案例");
  const repeater = makeRepeater(
    content.projects,
    (project, index) => {
      const item = document.createElement("article");
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.className = "secondary";
      remove.addEventListener("click", () => {
        content.projects.splice(index, 1);
        persist();
        renderProjectsPanel();
      });
      item.appendChild(remove);
      return item;
    },
    () => {
      content.projects.push({ name: "", desc: "", metrics: "", tech: [], link: "" });
      persist();
      renderProjectsPanel();
    }
  );
  group.appendChild(repeater);
  dom.panel.replaceChildren(group);
}

function renderArticlesPanel() {
  const group = createGroup("文章输出");
  const repeater = makeRepeater(
    content.articles,
    (article, index) => {
      const item = document.createElement("article");
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.className = "secondary";
      remove.addEventListener("click", () => {
        content.articles.splice(index, 1);
        persist();
        renderArticlesPanel();
      });
      item.appendChild(remove);
      return item;
    },
    () => {
      content.articles.push({ title: "", summary: "", link: "" });
      persist();
      renderArticlesPanel();
    }
  );
  group.appendChild(repeater);
  dom.panel.replaceChildren(group);
}

function renderContactPanel() {
  const group = createGroup("联系方式");
  group.append(
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
    (social, index) => {
      const article = document.createElement("article");
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "删除";
      remove.className = "secondary";
      remove.addEventListener("click", () => {
        content.contact.socials.splice(index, 1);
        persist();
        renderContactPanel();
      });
      article.appendChild(remove);
      return article;
    },
    () => {
      content.contact.socials.push({ label: "", url: "", handle: "" });
      persist();
      renderContactPanel();
    }
  );

  socialGroup.appendChild(socialRepeater);

  dom.panel.replaceChildren(group, socialGroup);
}

function renderTabs() {
  dom.tabs.innerHTML = "";
  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab${tab.id === activeTab ? " active" : ""}`;
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

renderTabs();
renderPanel();
