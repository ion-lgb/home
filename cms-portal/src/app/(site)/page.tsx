import { getSiteContent } from "@/lib/contentService";
import Image from "next/image";

export default async function HomePage() {
  const content = await getSiteContent();
  const hero = content.hero;
  const projects = content.projects;
  return (
    <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-20">
      <section className="grid gap-10 rounded-[40px] border border-black/5 bg-white/80 p-10 shadow-2xl backdrop-blur">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">Portfolio OS / 2024</p>
          <h1 className="text-4xl font-semibold leading-snug md:text-5xl" dangerouslySetInnerHTML={{ __html: hero.title.replace("Hi", '<span class="text-slate-400">Hi</span>') }} />
          <p className="text-lg text-slate-600">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-slate-500">
            {hero.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-6">
          {[hero, ...projects.slice(0, 2)].map((item, idx) => (
            <article key={`${item.name ?? "hero"}-${idx}`} className="hero-shot rounded-3xl border border-black/5">
              <div className="relative h-56 overflow-hidden rounded-[28px]">
                <Image src={item.cover || hero.cover || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80"} alt={item.name ?? item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">{idx === 0 ? hero.status.title : item.metrics}</p>
                  <h3 className="text-2xl font-semibold">{idx === 0 ? hero.status.desc : item.name}</h3>
                  <p className="text-sm text-white/80">{idx === 0 ? hero.status.location : item.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-xl" id="metrics">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Numbers</p>
          <h2 className="text-3xl font-semibold">数据背后的故事</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {content.stats.map((stat) => (
            <div key={stat.title} className="rounded-3xl border border-black/5 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{stat.title}</p>
              <p className="text-4xl font-semibold">{stat.value}</p>
              <p className="text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-xl" id="skills">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Capabilities</p>
          <h2 className="text-3xl font-semibold">多栈能力矩阵</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {content.skills.map((skill) => (
            <div key={skill.title} className="rounded-[28px] border border-black/5 bg-white/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Capability</p>
                  <h3 className="text-2xl font-semibold">{skill.title}</h3>
                </div>
                <span className="text-4xl font-semibold">{skill.score}</span>
              </div>
              <p className="mt-3 text-slate-500">{skill.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                {skill.highlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-xl" id="timeline">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Journey</p>
          <h2 className="text-3xl font-semibold">以产品节奏叙事</h2>
        </div>
        <div className="space-y-4">
          {content.timeline.map((item) => (
            <article key={item.period} className="border-b border-black/5 pb-4 last:border-b-0">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{item.period}</p>
              <h3 className="text-2xl font-semibold">{item.role}</h3>
              <p className="text-slate-500">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6" id="projectGallery">
        {content.projects.map((project) => (
          <article key={project.name} className="relative overflow-hidden rounded-[32px] shadow-2xl">
            <div className="relative h-[360px]">
              <Image src={project.cover || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80"} alt={project.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{project.metrics}</p>
                <h3 className="text-3xl font-semibold">{project.name}</h3>
                <p className="text-white/80">{project.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/80">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full border border-white/30 px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-xl" id="editorial">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Editorial</p>
          <h2 className="text-3xl font-semibold">思考与输出</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {content.articles.map((article) => (
            <article key={article.title} className="rounded-2xl border border-black/5 bg-white/70 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">INSIGHT</p>
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="text-slate-500">{article.summary}</p>
              <a className="text-sm text-slate-900 underline-offset-4 hover:underline" href={article.link} target="_blank" rel="noreferrer">
                阅读全文
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-black/5 bg-white/80 p-8 shadow-xl" id="contact">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Contact</p>
          <h2 className="text-3xl font-semibold">合作 & 联系</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Base</p>
            <h3 className="text-2xl font-semibold">{content.contact.city}</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Mail</span>
                <a className="font-semibold text-slate-900" href={`mailto:${content.contact.email}`}>
                  {content.contact.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span>WeChat</span>
                <span className="font-semibold">{content.contact.wechat}</span>
              </div>
              <div className="flex justify-between">
                <span>预约</span>
                <a className="font-semibold text-slate-900" href={content.contact.calendly} target="_blank" rel="noreferrer">
                  {content.contact.calendly}
                </a>
              </div>
              {content.contact.socials.map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <a className="font-semibold text-slate-900" href={item.url} target="_blank" rel="noreferrer">
                    {item.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <form className="space-y-3">
            <input className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="你的名字" />
            <input className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="邮箱" />
            <textarea className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="想聊点什么?" rows={4} />
          </form>
        </div>
      </section>
    </main>
  );
}
