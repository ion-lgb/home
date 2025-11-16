const STORAGE_KEY = "portfolio.content.v1";

const defaultContent = {
  hero: {
    title: "Hi,我是李国斌",
    subtitle: "全链路创意开发者，探索技术与体验设计的交汇点，持续交付优雅的数字产品",
    tags: ["全栈工程师", "体验设计", "增长实验", "AIGC"],
    cover: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80",
    status: {
      title: "Current focus",
      desc: "打造多端一体的体验平台 · 主导AI协作设计系统",
      location: "Shenzhen → Remote"
    }
  },
  stats: [
    { title: "产品上线", value: "32", desc: "涵盖SaaS、IoT、AI等多形态" },
    { title: "团队协作", value: "9年", desc: "驱动跨职能团队快速试错" },
    { title: "社区分享", value: "48", desc: "演讲/文章聚焦技术与体验" },
    { title: "专利/著作", value: "6", desc: "智能交互与体验优化" }
  ],
  skills: [
    {
      title: "Modern Web",
      desc: "React / Vue / Next / Astro · SSR/SSG",
      score: 92,
      highlights: ["微前端", "设计系统", "性能治理"]
    },
    {
      title: "Product Strategy",
      desc: "数据驱动决策、增长策略、A/B实验",
      score: 88,
      highlights: ["冷启动", "闭环指标", "运营策略"]
    },
    {
      title: "Cloud & Backend",
      desc: "Node / Nest / Go / 云原生",
      score: 84,
      highlights: ["Serverless", "边缘计算", "可观测性"]
    },
    {
      title: "Visual & Motion",
      desc: "WebGL / Lottie / Motion design",
      score: 80,
      highlights: ["3D交互", "品牌叙事", "体验差异化"]
    }
  ],
  timeline: [
    {
      period: "2023 - NOW",
      role: "首席体验技术负责人 · Nth Studio",
      detail: "主导AI Studio平台建设，打造人机协同设计闭环，构建数据驱动的体验迭代体系。"
    },
    {
      period: "2020 - 2023",
      role: "全栈团队负责人 · 云聚智能",
      detail: "带领12人敏捷团队交付工业IoT平台，实现多租户架构与插件化扩展。"
    },
    {
      period: "2017 - 2020",
      role: "前端工程师 · 极客基因",
      detail: "探索不同终端的体验一致性，沉淀跨端组件库与动画规范。"
    }
  ],
  projects: [
    {
      name: "AI Studio",
      desc: "面向创意团队的AI协作平台，提供Prompt设计、模型调参与多端预览。",
      metrics: "↑34% 设计交付效率",
      tech: ["Next.js", "tRPC", "Supabase"],
      cover: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
      link: "https://example.com"
    },
    {
      name: "Nebula Dashboard",
      desc: "SaaS企业实时可观测大屏，内置可视化方案市场，支持多主题与剧本。",
      metrics: "↑240% 数据洞察速度",
      tech: ["Vue3", "ECharts", "Vite"],
      cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
      link: "https://example.com"
    },
    {
      name: "Rhythm Design System",
      desc: "覆盖Web/移动/IoT的设计系统，提供代码与视觉双栈资产管理。",
      metrics: "↓45% UI迭代成本",
      tech: ["Storybook", "Astro", "TailwindCSS"],
      cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
      link: "https://example.com"
    }
  ],
  articles: [
    {
      title: "在真实业务中落地AI设计助手",
      link: "https://example.com/blog/ai-design",
      summary: "拆解从Prompt到设计规范映射的流程与挑战。"
    },
    {
      title: "打造高可用微前端：技术与治理",
      link: "https://example.com/blog/microfrontend",
      summary: "结合多个实际案例分享架构与运维经验。"
    },
    {
      title: "体验拉通：产品与工程共创的节奏",
      link: "https://example.com/blog/product",
      summary: "从团队协作角度解析如何保持体验一致性。"
    }
  ],
  contact: {
    city: "Shenzhen · Remote Friendly",
    email: "hello@guobin.li",
    wechat: "guobin-maker",
    calendly: "https://cal.com/guobin",
    socials: [
      { label: "GitHub", url: "https://github.com/", handle: "@guobin" },
      { label: "Zhihu", url: "https://zhihu.com/", handle: "李国斌" },
      { label: "Weibo", url: "https://weibo.com/", handle: "@李国斌" }
    ]
  }
};

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function mergeContent(base, patch) {
  const result = deepClone(base);
  if (!patch || typeof patch !== "object") return result;
  const assign = (target, source) => {
    Object.entries(source).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        target[key] = value;
      } else if (value && typeof value === "object") {
        target[key] = assign(target[key] || {}, value);
      } else {
        target[key] = value;
      }
    });
    return target;
  };
  return assign(result, patch);
}

function getContent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return deepClone(defaultContent);
    return mergeContent(defaultContent, JSON.parse(raw));
  } catch (err) {
    console.warn("读取存储数据失败，已回退默认", err);
    return deepClone(defaultContent);
  }
}

function saveContent(content) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

function resetContent() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY, defaultContent, getContent, saveContent, resetContent, mergeContent };
