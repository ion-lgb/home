"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { SiteContent } from "@/types/content";
import { defaultContent } from "@/lib/defaultContent";

interface AuthState {
  status: "idle" | "loading" | "authenticated";
  error?: string;
}

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>({ status: "idle" });
  const form = useForm<SiteContent>({
    defaultValues: defaultContent
  });
  const statsArray = useFieldArray({ control: form.control, name: "stats" });
  const skillsArray = useFieldArray({ control: form.control, name: "skills" });
  const timelineArray = useFieldArray({ control: form.control, name: "timeline" });
  const projectsArray = useFieldArray({ control: form.control, name: "projects" });
  const articlesArray = useFieldArray({ control: form.control, name: "articles" });
  const socialsArray = useFieldArray({ control: form.control, name: "contact.socials" });
  const heroTags = form.watch("hero.tags");
  const projectsWatch = form.watch("projects");
  const skillsWatch = form.watch("skills");

  async function loadContent() {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as SiteContent;
    form.reset(data);
  }

  useEffect(() => {
    loadContent();
  }, []);

  async function handleLogin(formData: FormData) {
    setAuth({ status: "loading" });
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    if (!res.ok) {
      const body = await res.json();
      setAuth({ status: "idle", error: body?.message || "登录失败" });
      return;
    }
    setAuth({ status: "authenticated" });
    await loadContent();
  }

  async function onSubmit(values: SiteContent) {
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      alert("保存失败，请检查登录状态");
      return;
    }
    alert("已保存");
  }

  if (auth.status !== "authenticated") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(new FormData(e.currentTarget)); }} className="space-y-4 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold">后台登录</h1>
          <input name="email" type="email" required placeholder="邮箱" className="w-full rounded-2xl border border-black/10 px-4 py-3" />
          <input name="password" type="password" required placeholder="密码" className="w-full rounded-2xl border border-black/10 px-4 py-3" />
          {auth.error && <p className="text-sm text-red-500">{auth.error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-black py-3 text-white disabled:opacity-60" disabled={auth.status === "loading"}>
            {auth.status === "loading" ? "登录中..." : "进入后台"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="rounded-3xl border border-black/5 bg-white/90 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold">站点内容管理</h1>
        <p className="text-slate-500">修改内容后保存即可更新前台。</p>
      </header>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <h2 className="text-2xl font-semibold">主视觉</h2>
          <div className="mt-4 grid gap-4">
            <label className="space-y-2">
              <span>标题</span>
              <input className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register("hero.title")}/>
            </label>
            <label className="space-y-2">
              <span>副标题</span>
              <textarea className="w-full rounded-2xl border border-black/10 px-4 py-3" rows={3} {...form.register("hero.subtitle")}/>
            </label>
            <label className="space-y-2">
              <span>封面图 URL</span>
              <input className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register("hero.cover")}/>
            </label>
            <label className="space-y-2">
              <span>标签，逗号分隔</span>
              <textarea
                className="w-full rounded-2xl border border-black/10 px-4 py-3"
                rows={2}
                value={heroTags?.join(", ") ?? ""}
                onChange={(event) =>
                  form.setValue(
                    "hero.tags",
                    event.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">能力矩阵</h2>
            <button type="button" onClick={() => skillsArray.append({ title: "", desc: "", score: 80, highlights: [] })} className="rounded-full border border-black/10 px-4 py-2 text-sm">
              新增
            </button>
          </div>
          {skillsArray.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-2xl border border-black/10 p-4">
              <input placeholder="名称" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`skills.${index}.title` as const)} />
              <textarea placeholder="描述" className="w-full rounded-2xl border border-black/10 px-4 py-3" rows={2} {...form.register(`skills.${index}.desc` as const)} />
              <label className="block text-sm text-slate-500">
                分值 (0-100)
                <input type="number" min={0} max={100} className="mt-1 w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`skills.${index}.score` as const, { valueAsNumber: true })} />
              </label>
              <textarea
                placeholder="亮点，逗号分隔"
                className="w-full rounded-2xl border border-black/10 px-4 py-3"
                rows={2}
                value={skillsWatch?.[index]?.highlights?.join(", ") ?? ""}
                onChange={(event) =>
                  form.setValue(
                    `skills.${index}.highlights`,
                    event.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
              <div className="text-right">
                <button type="button" onClick={() => skillsArray.remove(index)} className="text-sm text-red-500">
                  删除
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">经历时间线</h2>
            <button type="button" onClick={() => timelineArray.append({ period: "", role: "", detail: "" })} className="rounded-full border border-black/10 px-4 py-2 text-sm">
              新增
            </button>
          </div>
          {timelineArray.fields.map((field, index) => (
            <div key={field.id} className="space-y-2 rounded-2xl border border-black/10 p-4">
              <input placeholder="时间范围" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`timeline.${index}.period` as const)} />
              <input placeholder="角色/职位" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`timeline.${index}.role` as const)} />
              <textarea placeholder="描述" className="w-full rounded-2xl border border-black/10 px-4 py-3" rows={2} {...form.register(`timeline.${index}.detail` as const)} />
              <div className="text-right">
                <button type="button" onClick={() => timelineArray.remove(index)} className="text-sm text-red-500">
                  删除
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">核心指标</h2>
            <button type="button" onClick={() => statsArray.append({ title: "", value: "", desc: "" })} className="rounded-full border border-black/10 px-4 py-2 text-sm">
              新增
            </button>
          </div>
          {statsArray.fields.map((field, index) => (
            <div key={field.id} className="rounded-2xl border border-black/10 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input placeholder="标题" className="rounded-2xl border border-black/10 px-4 py-3" {...form.register(`stats.${index}.title` as const)} />
                <input placeholder="数值" className="rounded-2xl border border-black/10 px-4 py-3" {...form.register(`stats.${index}.value` as const)} />
                <input placeholder="描述" className="rounded-2xl border border-black/10 px-4 py-3" {...form.register(`stats.${index}.desc` as const)} />
              </div>
              <div className="mt-2 text-right">
                <button type="button" onClick={() => statsArray.remove(index)} className="text-sm text-red-500">
                  删除
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">项目案例</h2>
            <button type="button" onClick={() => projectsArray.append({ name: "", desc: "", metrics: "", tech: [], cover: "", link: "" })} className="rounded-full border border-black/10 px-4 py-2 text-sm">
              新增
            </button>
          </div>
          {projectsArray.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-2xl border border-black/10 p-4">
              <input placeholder="名称" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`projects.${index}.name` as const)} />
              <textarea placeholder="描述" className="w-full rounded-2xl border border-black/10 px-4 py-3" rows={3} {...form.register(`projects.${index}.desc` as const)} />
              <input placeholder="亮点指标" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`projects.${index}.metrics` as const)} />
              <input placeholder="封面图 URL" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`projects.${index}.cover` as const)} />
              <input placeholder="链接" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`projects.${index}.link` as const)} />
              <textarea
                placeholder="技术栈，逗号分隔"
                className="w-full rounded-2xl border border-black/10 px-4 py-3"
                rows={2}
                value={projectsWatch?.[index]?.tech?.join(", ") ?? ""}
                onChange={(event) =>
                  form.setValue(
                    `projects.${index}.tech`,
                    event.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
              <div className="text-right">
                <button type="button" onClick={() => projectsArray.remove(index)} className="text-sm text-red-500">
                  删除
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <h2 className="text-2xl font-semibold">文章输出</h2>
          <div className="mt-4 space-y-4">
            {articlesArray.fields.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-2xl border border-black/10 p-4">
                <input placeholder="标题" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`articles.${index}.title` as const)} />
                <textarea placeholder="摘要" className="w-full rounded-2xl border border-black/10 px-4 py-3" rows={2} {...form.register(`articles.${index}.summary` as const)} />
                <input placeholder="链接" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`articles.${index}.link` as const)} />
                <div className="text-right">
                  <button type="button" onClick={() => articlesArray.remove(index)} className="text-sm text-red-500">
                    删除
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => articlesArray.append({ title: "", summary: "", link: "" })} className="rounded-full border border-black/10 px-4 py-2 text-sm">
              新增文章
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <h2 className="text-2xl font-semibold">联系信息</h2>
          <div className="mt-4 grid gap-4">
            <input placeholder="城市" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register("contact.city")} />
            <input placeholder="邮箱" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register("contact.email")} />
            <input placeholder="微信" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register("contact.wechat")} />
            <input placeholder="预约链接" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register("contact.calendly")} />
            <div className="space-y-3">
              <p className="text-sm text-slate-500">社交账号</p>
              {socialsArray.fields.map((field, index) => (
                <div key={field.id} className="space-y-2 rounded-2xl border border-black/10 p-4">
                  <input placeholder="平台" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`contact.socials.${index}.label` as const)} />
                  <input placeholder="展示名称" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`contact.socials.${index}.handle` as const)} />
                  <input placeholder="链接" className="w-full rounded-2xl border border-black/10 px-4 py-3" {...form.register(`contact.socials.${index}.url` as const)} />
                  <div className="text-right">
                    <button type="button" onClick={() => socialsArray.remove(index)} className="text-sm text-red-500">
                      删除
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => socialsArray.append({ label: "", handle: "", url: "" })} className="rounded-full border border-black/10 px-4 py-2 text-sm">
                新增社交账号
              </button>
            </div>
          </div>
        </section>

        <div className="sticky bottom-4 z-10 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl">
          <button type="submit" className="w-full rounded-2xl bg-black py-3 text-white">
            保存全部内容
          </button>
        </div>
      </form>
    </main>
  );
}
