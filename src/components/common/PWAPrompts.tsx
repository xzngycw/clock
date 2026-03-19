import { Download, RefreshCw, WifiOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks';

export function PWAPrompts() {
  const {
    canInstall,
    isInstalling,
    needRefresh,
    offlineReady,
    install,
    refreshApp,
    dismissOfflineReady,
    dismissNeedRefresh,
  } = usePWA();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-3 px-3 sm:bottom-6">
      <AnimatePresence>
        {canInstall && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="pointer-events-auto w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/95 p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-600">
                <Download className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display text-lg text-base-content">安装到桌面</p>
                <p className="mt-1 text-sm text-base-content/65">安装后可像原生应用一样快速打开，也支持离线使用。</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={install}
                    disabled={isInstalling}
                    className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {isInstalling ? '安装中...' : '立即安装'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="pointer-events-auto w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/95 p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-amber-50 p-2 text-amber-600">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg text-base-content">发现新版本</p>
                    <p className="mt-1 text-sm text-base-content/65">刷新后即可使用最新内容。</p>
                  </div>
                  <button type="button" onClick={dismissNeedRefresh} className="rounded-full p-1 text-base-content/45">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={refreshApp}
                    className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-medium text-white"
                  >
                    立即刷新
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {offlineReady && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="pointer-events-auto w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/95 p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
                <WifiOff className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg text-base-content">离线模式已准备好</p>
                    <p className="mt-1 text-sm text-base-content/65">即使暂时断网，也可以继续打开主要页面。</p>
                  </div>
                  <button type="button" onClick={dismissOfflineReady} className="rounded-full p-1 text-base-content/45">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
