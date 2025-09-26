const PREFIX_NAME = 'NDZY-APP'
export type ConsoleFn = (message?: any, ...optionalParams: any[]) => void
export type LogTypes = 'debug' | 'info' | 'warn' | 'error' | 'silent'
export type LogParams = {
  level?: LogTypes
  prefixName?: string
  silenceFn?: ConsoleFn
}
export class Logger {
  warn: ConsoleFn
  error: ConsoleFn
  debug: ConsoleFn
  info: ConsoleFn
  log: ConsoleFn

  private isNode: boolean = typeof window === 'undefined'
  private browserColors = {
    debug: '#3498db',
    info: '#16a085',
    warn: '#e67e22',
    error: '#e74c3c',
    silent: '#95a5a6',
  }
  private nodeColors = {
    debug: '\x1b[34m', // 蓝色
    info: '\x1b[32m', // 绿色
    warn: '\x1b[33m', // 黄色
    error: '\x1b[31m', // 红色
    silent: '\x1b[90m', // 灰色
    reset: '\x1b[0m', // 重置颜色
  }
  private levels = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5,
  }
  constructor() {
    this.warn = () => {}
    this.error = () => {}
    this.debug = () => {}
    this.info = () => {}
    this.log = () => {}
    this.setup({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'silent',
    })
  }
  private logType(type: LogTypes, prefixName: string) {
    const s = type.toLocaleUpperCase()

    if (this.isNode) {
      // Node.js 环境使用终端颜色代码
      const color = this.nodeColors[type]
      const reset = this.nodeColors.reset
      return [`${color}[${prefixName}] [${s}]${reset} `]
    } else {
      // 浏览器环境使用 CSS 样式
      const rs = [
        `%c ${prefixName} %c ${s} `,
        `background:#2c3e50;color:#fff;padding: 1px;border-radius: 2px 0 0 2px;`,
        `background:${this.browserColors[type]};color: #fff;padding: 1px; border-radius: 0 2px 2px 0;`,
      ]
      return rs
    }
  }

  setup(options?: LogParams) {
    const defaultSilenceFn = () => {}
    const {
      level = 'debug',
      prefixName = PREFIX_NAME,
      silenceFn = defaultSilenceFn,
    } = options || {}
    const lv = this.levels[level]

    this.error =
      lv <= 4
        ? console.error.bind(console, ...this.logType('error', prefixName))
        : silenceFn
    this.warn =
      lv <= 3
        ? console.warn.bind(console, ...this.logType('warn', prefixName))
        : silenceFn
    this.info =
      lv <= 2
        ? console.log.bind(console, ...this.logType('info', prefixName))
        : silenceFn
    this.log =
      lv <= 2
        ? console.log.bind(console, ...this.logType('info', prefixName))
        : silenceFn
    this.debug =
      lv <= 1
        ? console.log.bind(console, ...this.logType('debug', prefixName))
        : silenceFn
  }
}

const logger = new Logger()
export default logger
