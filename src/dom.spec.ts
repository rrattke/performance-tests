import { describe, it } from 'vitest'
import puppeteer from 'puppeteer-core'
import { getEdgePath } from 'edge-paths'
import type { Bench } from 'tinybench'
import { resolve } from 'import-meta-resolve'
import { fileURLToPath } from 'url'

type BenchType = typeof Bench
describe('DOM Manipulation Performance', () => {
  it('should measure performance of DOM manipulation', async () => {
    const browser = await puppeteer.launch({
      executablePath: getEdgePath(),
      headless: false,
      devtools: true,
      slowMo: 50,
    })

    // Inject Tinybench as an inline script before any other scripts run
    // await browser.evaluateOnNewDocument(async (tinybenchPath) => {
    //   const script = document.createElement('script')
    //   script.type = 'module'
    //   script.textContent = `
    //         import { Bench } from '${tinybenchPath}';
    //         window.Bench = Bench;
    //       `
    //   document.head.appendChild(script)
    // }, tinybenchPath)
    const page = await browser.newPage()
    // Inject Tinybench as a script tag

    const tinybenchPath = resolve('tinybench', import.meta.url)
    // await page.goto('about:blank')
    // await page.addScriptTag({ path: fileURLToPath(tinybenchPath), type: 'module' })

    // Define the benchmark suite
    await page.addScriptTag({
      type: 'module',
      content: `
        import { Bench } from '${tinybenchPath}';
        globalThis.Bench = Bench;
        globalThis.TEST = 'TEST';
        debugger;
      `,
    })

    // Add a test case to the suite
    await page.evaluate(async () => {
      const Bench: BenchType = globalThis.Bench
      debugger
      // const bench = new Bench()
      // bench.add('Create and append elements', async () => {
      //   const container = document.createElement('div')
      //   document.body.appendChild(container)
      //   for (let i = 0; i < 1000; i++) {
      //     const element = document.createElement('div')
      //     element.textContent = `Element ${i}`
      //     container.appendChild(element)
      //   }
      //   await bench.run()
      // })
      // Run the benchmark suite and capture the results
      // return bench
    })

    // const results = bench.tasks.map((task) => ({
    //   name: task.name,
    //   result: task.result,
    // }))

    // console.log(bench.name)
    // console.table(bench.table())

    // Verify the DOM manipulation
    const elementCount = await page.evaluate(() => {
      return document.body.querySelectorAll('div > div').length
    })

    // expect(elementCount).toBe(1000)

    await browser.close()
  }, { timeout: 0 }) // Disable timeout for this test case
})
