export default function LocaleLoading() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#071326] text-white"
      aria-busy="true"
      aria-label="页面加载中"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-white/5">
        <div className="h-full w-1/3 animate-[route-progress_1s_ease-in-out_infinite] bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-12 md:px-8">
        <div className="animate-pulse">
          <div className="mb-6 h-16 rounded-3xl border border-white/[0.06] bg-white/[0.025]" />
          <div className="grid gap-6 xl:grid-cols-[310px_minmax(0,1fr)]">
            <div className="h-[620px] rounded-3xl border border-white/[0.08] bg-white/[0.04]" />
            <div className="min-w-0 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="h-28 rounded-2xl border border-white/[0.08] bg-white/[0.04]"
                  />
                ))}
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                <div className="h-[420px] rounded-3xl border border-white/[0.08] bg-white/[0.04]" />
                <div className="h-[420px] rounded-3xl border border-white/[0.08] bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">正在连接页面，请稍候</span>
    </main>
  );
}
