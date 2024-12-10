import { describe, it } from 'vitest'
import { Bench } from 'tinybench'

describe('DOM Manipulation Performance', () => {
  it('should measure performance of DOM manipulation', async () => {
    const bench = new Bench({
      name: 'async vs sync operations',
      time: 1000,
    })
    bench
      .add('sync DOM operation', () => {
        const div = document.createElement('div')
        div.textContent = 'test'
        document.body.appendChild(div)
        document.body.removeChild(div)
      })
      .add('async DOM operation', async () => {
        const div = document.createElement('div')
        div.textContent = 'test'
        document.body.appendChild(div)
        await animationFrame()
        document.body.removeChild(div)
      })
      .add('async with timeout', async () => {
        const div = document.createElement('div')
        await delay(10)
        document.body.appendChild(div)
        document.body.removeChild(div)
      })

    await bench.run()
    console.log(bench.name)
    console.log(tableToString(bench.table()))
  })
})

function animationFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

function tableToString(rows: any[]): string {
  if (!Array.isArray(rows) || rows.length === 0) {
    return ''
  }

  const columnNames = Object.keys(rows[0])
  const columnWidths = rows.reduce((columnWidths, row) => {
    columnNames.forEach((column, index) => {
      const cell = String(row[column])
      if (cell.length > columnWidths[index]) {
        columnWidths[index] = cell.length
      }
    })
    return columnWidths
  }, columnNames.map((header) => header.length))

  const separator = columnWidths.map((width) => '-'.repeat(width)).join(' | ')
  const headerRow = columnNames
    .map((header, index) => header.padEnd(columnWidths[index]))
    .join(' | ')

  const lines = rows.map((row) =>
    columnNames
      .map((header, index) => String(row[header]).padEnd(columnWidths[index]))
      .join(' | '),
  )

  return [headerRow, separator, ...lines].join('\n')
}
