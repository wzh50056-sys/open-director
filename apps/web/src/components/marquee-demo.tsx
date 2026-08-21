import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    name: "林设计",
    username: "@视觉创作者",
    body: "AI 做图很快，画面质感和细节都很出色。",
    img: "https://avatar.vercel.sh/lin",
  },
  {
    name: "陈导演",
    username: "@短片导演",
    body: "从创意到成图非常顺畅，节省了大量制作时间。",
    img: "https://avatar.vercel.sh/chen",
  },
  {
    name: "周老师",
    username: "@内容创作",
    body: "提示词理解准确，想要的风格基本一次就能生成。",
    img: "https://avatar.vercel.sh/zhou",
  },
  {
    name: "小安",
    username: "@品牌运营",
    body: "AI 客服响应及时，复杂问题也能清楚解答。",
    img: "https://avatar.vercel.sh/an",
  },
  {
    name: "王制片",
    username: "@视频制作",
    body: "做图功能好用，智能客服也很专业，体验很好。",
    img: "https://avatar.vercel.sh/wang",
  },
  {
    name: "苏同学",
    username: "@独立创作者",
    body: "生成速度快、效果稳定，新手也能轻松完成创作。",
    img: "https://avatar.vercel.sh/su",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

function ReviewCard({
  img,
  name,
  username,
  body,
}: (typeof reviews)[number]) {
  return (
    <figure
      className={cn(
        "relative h-[86px] w-52 cursor-pointer overflow-hidden rounded-xl border p-3",
        "border-white/10 bg-white/[0.06] text-slate-200 shadow-lg backdrop-blur-sm",
        "transition-colors hover:border-sky-300/25 hover:bg-white/[0.1]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rounded-full" width="28" height="28" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-xs font-medium text-white">
            {name}
          </figcaption>
          <p className="text-[10px] font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-1.5 line-clamp-2 text-xs leading-4">{body}</blockquote>
    </figure>
  );
}

export function MarqueeDemo() {
  return (
    <div className="relative flex h-52 w-full min-w-0 max-w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-sky-400/15 bg-[#07111f]/75 py-2">
      <Marquee className="w-full min-w-0 [--duration:12s] [--gap:0.75rem]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse className="w-full min-w-0 [--duration:12s] [--gap:0.75rem]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#07111f]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#07111f]" />
    </div>
  );
}
