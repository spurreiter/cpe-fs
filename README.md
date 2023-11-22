# cpe-fs

Parses and generates Common Platform Enumeration Identifiers

Supports only formatted strings from [Common Platform Enumeration: Naming Specification Version 2.3][]

Does not use WFN as internal value representation.

# install

```sh
npm install cpe-fs
```

# usage

generate a CPE from attributes

```js
import { Cpe } from 'cpe-fs'

new Cpe({
  vendor: 'microsoft',
  product: 'internet explorer',
  version: '8.0.6001',
  update: 'beta'
}).toString()
//> 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
```

parse CPE

```js
import { Cpe } from 'cpe-fs'

const cpe = new Cpe().parse('cpe:2.3:a:foo\\\\bar:big\\$money_2010:*:*:*:*:special:ipod_touch:80gb:*')
{
  part: 'a',
  vendor: 'foo\\bar',
  product: 'big$money 2010',
  version: '*',
  update: '*',
  edition: '*',
  language: '*',
  swEdition: 'special',
  targetSw: 'ipod touch',
  targetHw: '80gb',
  other: '*'
}
```

# license

[MIT Licensed](./LICENSE)

[Common Platform Enumeration: Naming Specification Version 2.3]: https://csrc.nist.gov/pubs/ir/7695/final
