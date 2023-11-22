import assert from 'node:assert/strict'
import { Cpe } from '../src/index.js'

describe('Cpe', function () {
  describe('formatted strings', function () {
    it('shall throw with invalid part', function () {
      const fstr =
        'cpe:2.3:i:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
      try {
        new Cpe().parse(fstr)
        throw new Error('fail')
      } catch (e) {
        assert.equal(e.message, 'Invalid part')
      }
    })

    it('shall throw if formatted string contains less parts', function () {
      const fstr = 'cpe:2.3:i:microsoft:internet_explorer:8.0.6001:beta'
      try {
        new Cpe().parse(fstr)
        throw new Error('fail')
      } catch (e) {
        assert.equal(e.message, 'invalid CPE')
      }
    })

    it('shall throw if CPE prefix is missing', function () {
      const fstr = 'a:microsoft:internet_explorer:8.0.6001:beta'
      try {
        new Cpe().parse(fstr)
        throw new Error('fail')
      } catch (e) {
        assert.equal(e.message, 'CPE Identifier not supported')
      }
    })

    it('shall generate CPE', function () {
      assert.equal(new Cpe().toString(), 'cpe:2.3:a:*:*:*:*:*:*:*:*:*:*')
    })

    it('shall generate CPE from attributes', function () {
      assert.equal(
        new Cpe({
          vendor: 'microsoft',
          product: 'internet explorer',
          version: '8.0.6001',
          update: 'beta'
        }).toString(),
        'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
      )
    })

    it('shall parse example 1', function () {
      const fstr =
        'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
      const cpe = new Cpe().parse(fstr)
      assert.deepEqual(jsonify(cpe), {
        part: 'a',
        vendor: 'microsoft',
        product: 'internet explorer',
        version: '8.0.6001',
        update: 'beta',
        edition: '*',
        language: '*',
        swEdition: '*',
        targetSw: '*',
        targetHw: '*',
        other: '*'
      })

      assert.equal(cpe.toString(), fstr)
    })

    it('shall parse example 2', function () {
      const fstr = 'cpe:2.3:a:microsoft:internet_explorer:8.*:sp?:*:*:*:*:*:*'
      const cpe = new Cpe().parse(fstr)
      assert.deepEqual(jsonify(cpe), {
        part: 'a',
        vendor: 'microsoft',
        product: 'internet explorer',
        version: '8.*',
        update: 'sp?',
        edition: '*',
        language: '*',
        swEdition: '*',
        targetSw: '*',
        targetHw: '*',
        other: '*'
      })

      assert.equal(cpe.toString(), fstr)
    })

    it('shall parse example 3', function () {
      const fstr = 'cpe:2.3:a:hp:insight:7.4.0.1570:-:*:*:online:win2003:x64:*'
      const cpe = new Cpe().parse(fstr)
      assert.deepEqual(jsonify(cpe), {
        part: 'a',
        vendor: 'hp',
        product: 'insight',
        version: '7.4.0.1570',
        update: '',
        edition: '*',
        language: '*',
        swEdition: 'online',
        targetSw: 'win2003',
        targetHw: 'x64',
        other: '*'
      })

      assert.equal(cpe.toString(), fstr)
    })

    it('shall parse example 4', function () {
      const fstr =
        'cpe:2.3:a:hp:openview_network_manager:7.51:*:*:*:*:linux:*:*'
      const cpe = new Cpe().parse(fstr)
      assert.deepEqual(jsonify(cpe), {
        part: 'a',
        vendor: 'hp',
        product: 'openview network manager',
        version: '7.51',
        update: '*',
        edition: '*',
        language: '*',
        swEdition: '*',
        targetSw: 'linux',
        targetHw: '*',
        other: '*'
      })

      assert.equal(cpe.toString(), fstr)
    })

    it('shall parse example 5', function () {
      const fstr =
        'cpe:2.3:a:foo\\\\bar:big\\$money_2010:*:*:*:*:special:ipod_touch:80gb:*'
      const cpe = new Cpe().parse(fstr)
      assert.deepEqual(jsonify(cpe), {
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
      })

      assert.equal(cpe.toString(), fstr)
    })

    it('shall parse string with dashes', function () {
      const fstr =
        'cpe:2.3:a:\\@nubosoftware\\/node-static_project:\\@nubosoftware\\/node-static:-:*:*:*:*:node.js:*:*'
      const cpe = new Cpe().parse(fstr)
      assert.deepEqual(jsonify(cpe), {
        part: 'a',
        vendor: '@nubosoftware/node-static project',
        product: '@nubosoftware/node-static',
        version: '',
        update: '*',
        edition: '*',
        language: '*',
        swEdition: '*',
        targetSw: 'node.js',
        targetHw: '*',
        other: '*'
      })

      assert.equal(cpe.toString(), fstr)
    })
  })
})

const jsonify = (o) => JSON.parse(JSON.stringify(o))
