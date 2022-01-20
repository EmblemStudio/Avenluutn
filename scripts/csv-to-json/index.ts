import * as fs from 'fs'

// TODO function that calls writeJsonFromCsv for everything in ./csv
function writeAll(dirPath: string) {
  fs.readdirSync(dirPath).forEach((fn: string) => {
    writeJsonFromCsv(dirPath, fn)
  })
}


function writeJsonFromCsv(dirPath: string, fileName: string) {
  console.log('trying to write', fileName)
  const json = csvToType(loadCsv(dirPath, fileName))
  console.log(json)
  fs.writeFileSync(
    `${__dirname}/json/${fileName.slice(0, fileName.length - 4)}.json`,
    JSON.stringify(json)
  )
}

/**
 * Algorithm:
 * - if keystring column, make an object. if enum, make "enum." if neither, make array.
 * - keystring column becomes keys
 * - other columns become fields inside of each value
 * - if there are multiple rows with the same keystring, each field becomes an array
 */

function csvToType(rowStrings: string[]): any {
  const firstRowString = rowStrings.shift()
  if (!firstRowString) throw new Error("No first row")
  const firstRow = firstRowString.split(',')
  const type = firstRow[0]
  let res: any = {}
  switch (type) {
    case undefined:
      throw new Error("No type")

    case "keystring":
      rowStrings.forEach(rowString => {
        const row = rowString.split(',')
        row.forEach((item, i) => {
          const heading = firstRow[i]
          if (!heading) throw new Error("No heading")
          const keystring = row[0]
          if (!keystring) throw new Error("No keystring in item")
          if (i === 0) {
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
      break

    default:
      // treat as array
      if (typeof res === "object") res = [] as string[]
      rowStrings.forEach(rowString => {
        res.push(rowString)
      })
  }
  return res
}

function loadCsv(dirPath: string, fileName: string): string[] {
  const csv = fs.readFileSync(`${dirPath}/${fileName}`)
  const array = csv.toString('utf8').split('\r\n')
  const truncArray = []
  for (let i = 0; i < array.length; i++) {
    const string = array[i]
    if (string !== undefined) {
      const index = string.indexOf(',,,')
      if (index >= 0) {
        const row = string.slice(0, index)
        if (row !== "") {
          truncArray.push(removeQuotes(row))
        }
      } else {
        truncArray.push(removeQuotes(string))
      }
    }
  }
  return truncArray as string[]
}

function removeQuotes(str: string): string {
  const a = str.split("")
  const f = a[0]
  const l = a[a.length - 1]
  if (f === '"') a.shift()
  if (l === '"') a.pop()
  return a.join("")
}

// writeJsonFromCsv('triggerMap')
writeAll(`${__dirname}/csv`)
