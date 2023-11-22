/**
 * @typedef {object} CpeAttributes
 * @property {string} [part]
 * @property {string} [vendor]
 * @property {string} [product]
 * @property {string} [version]
 * @property {string} [update]
 * @property {string} [edition]
 * @property {string} [language]
 * @property {string} [sw_edition]
 * @property {string} [target_sw]
 * @property {string} [target_hw]
 * @property {string} [other]
 */

/** part == Application */
export const PART_APP = 'a'
/** part == Operating System */
export const PART_OS = 'o'
/** part == Hardware */
export const PART_HW = 'h'

const ANY = '*'

const FS_PREFIX = 'cpe:2.3:'

const FIELDS = [
  'part',
  'vendor',
  'product',
  'version',
  'update',
  'edition',
  'language',
  'swEdition',
  'targetSw',
  'targetHw',
  'other'
]

export class Cpe {
  part = PART_APP
  vendor = ANY
  product = ANY
  version = ANY
  update = ANY
  edition = ANY
  language = ANY
  swEdition = ANY
  targetSw = ANY
  targetHw = ANY
  other = ANY

  /**
   * @param {CpeAttributes} [attrs]
   */
  constructor(attrs) {
    if (!attrs) {
      return this
    }
    for (const attr of Object.keys(this)) {
      if (attrs[attr] === undefined) {
        continue
      }
      this[attr] = attrs[attr]
    }
  }

  /**
   * @param {string} str
   * @returns {this}
   */
  parse(str = '') {
    if (str.startsWith(FS_PREFIX)) {
      const parts = str.slice(FS_PREFIX.length).split(':')
      if (parts.length !== FIELDS.length) {
        throw new TypeError('invalid CPE')
      }
      for (let i = 0; i < FIELDS.length; i++) {
        const field = FIELDS[i]
        const value = parts[i]
        if (
          field === 'part' &&
          value !== PART_APP &&
          value !== PART_HW &&
          value !== PART_OS
        ) {
          throw Error('Invalid part')
        }
        this[field] = unbind(value)
      }
    } else {
      throw new Error('CPE Identifier not supported')
    }
    return this
  }

  /**
   * constructs only CPE as formatted string
   * @returns {string} cpe23
   */
  toString() {
    const arr = []
    for (let i = 0; i < FIELDS.length; i++) {
      const field = FIELDS[i]
      const value = this[field]
      arr.push(bind(value))
    }
    return FS_PREFIX + arr.join(':')
  }
}

// "!\"#$%&'()+,/:;<=>@[]^`{|}~*?".split('').map((c) => c.charCodeAt(0))
const PUNCT = [
  33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 47, 58, 59, 60, 61, 62, 64,
  91, 93, 94, 96, 123, 124, 125, 126
]
// "*?".split('').map((c) => c.charCodeAt(0))
const SPECIAL = [42, 63]
// " \t".split('').map((c) => c.charCodeAt(0))
const SPACE = [32, 9]
// "-"
const DASH = 45
// "."
const DOT = 46
// "\\"
const ESC = 92

const prevEsc = (code) => (code === ESC ? '' : '\\')

export const bind = (inp) => {
  if (!inp) {
    return '-'
  }
  const len = [...inp].length
  let out = ''
  let prev = 0
  for (let i = 0; i < len; i++) {
    const code = inp.charCodeAt(i)
    const char = String.fromCharCode(code)
    if (
      (code >= 0x41 && code <= 0x5a) || // A-Z
      (code >= 0x30 && code <= 0x39) || // 0-9
      (code >= 0x61 && code <= 0x7a) || // a-z
      code === 0x5f || // "_"
      code === DOT
    ) {
      out += char
    } else if (SPACE.includes(code)) {
      out += '_'
    } else if (code === DASH && i !== 0) {
      out += char
    } else if (PUNCT.includes(code) || code === ESC) {
      out += prevEsc(prev) + char
    } else if (SPECIAL.includes(code)) {
      out += char
    }
    prev = code
  }
  return out
}

export const unbind = (inp) => {
  if (inp === '-') {
    return ''
  }
  const len = [...inp].length
  const punct = [...PUNCT, ...SPECIAL, DASH, ESC]
  let out = ''
  for (let i = 0; i < len; i++) {
    const code = inp.charCodeAt(i)
    const char = String.fromCharCode(code)
    const next = inp.charCodeAt(i + 1)
    if (code === ESC && punct.includes(next)) {
      continue
    }
    if (code === 0x5f) {
      out += ' '
      continue
    }
    out += char
  }
  return out
}
