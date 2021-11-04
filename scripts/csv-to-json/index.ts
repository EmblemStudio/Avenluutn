import * as fs from 'fs'

// TODO function that calls writeJsonFromCsv for everything in ./csv

function writeJsonFromCsv(fileName: string) {
  const json = csvToType(loadCsv(fileName))
  console.log(json)
  fs.writeFileSync(
    `${__dirname}/json/${fileName}.json`, 
    JSON.stringify(json)
  )
}

/**
 * Algorithm:
 * - keystring column becomes keys
 * - other columns become fields inside of each value
 * - if there are multiple rows with the same keystring, each field becomes an array
 */

function csvToType(rowStrings: string[]): any {
  const firstRowString = rowStrings.shift()
  if (!firstRowString) throw new Error("No first row")
  const firstRow = firstRowString.split(',')
  const res: any = {}
  rowStrings.forEach(rowString => {
    const row = rowString.split(',')
    row.forEach((item, i) => {
      const heading = firstRow[i]
      if (!heading) throw new Error("No heading")
      const keystring = row[0]
      if (!keystring) throw new Error("No keystring in item")
      if (i === 0) {
        if (heading !== "keystring") throw new Error ("Expected 'keystring' heading")
        const current = res[keystring]
        if (!current) {
          res[keystring] = [{}] as any[]
        } else {
          res[keystring] = current.concat([{}])
        }
      } else {
        const objectArray: any[] = res[keystring]
        if (!objectArray) throw new Error("No object array")
        if (objectArray.length === 0) objectArray.push({})
        let object = objectArray[objectArray.length - 1]
        if (object === undefined) throw new Error("No object")
        object[heading] = item
        objectArray[objectArray.length - 1] = object
        res[keystring] = objectArray
      }
    })
  })
  return res
}

function loadCsv(fileName: string): string[] {
  const csv = fs.readFileSync(`${__dirname}/csv/${fileName}.csv`)
  const array = csv.toString('utf8').split('\r\n')
  const truncArray = array.map(string => {
    const index = string.indexOf(',,,')
    if (index >= 0) {
      const row = string.slice(0, index)
      if (!row) throw new Error("No row")
      return row
    }
  })
  return truncArray as string[]
}

writeJsonFromCsv('triggerMap')
