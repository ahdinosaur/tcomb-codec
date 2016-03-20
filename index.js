var t = require('tcomb')
var mapValues = require('lodash/mapValues')
var map = require('lodash/map')

module.exports = {
  name: 'tcomb',
  encode: function encode (Type) {
    if (!t.isType(Type)) {
      throw new Error('tcomb-codec: encode expects <Type>.')
    }
    var meta = Type.meta
    switch (meta.kind) {
      case 'irreducible':
        return {
          kind: 'irreducible',
          name: meta.name,
          predicate: meta.predicate.toString()
        }
      case 'refinement':
        return {
          kind: 'refinement',
          type: encode(meta.type),
          predicate: meta.predicate.toString(),
          name: meta.name
        }
      case 'enums':
        return {
          kind: 'enums',
          meta: meta.map,
          name: meta.name
        }
      case 'maybe':
        return {
          kind: 'maybe',
          type: meta.type,
          name: meta.name
        }
      case 'struct':
        return {
          kind: 'struct',
          props: mapValues(meta.props, (type) => encode(type)),
          name: meta.name
        }
      case 'tuple':
        return {
          kind: 'tuple',
          types: map(meta.types, (type) => decode(type)),
          name: meta.name
        }
      case 'list':
        return {
          kind: 'list',
          type: decode(meta.type),
          name: meta.name
        }
      case 'dict':
        return {
          kind: 'dict',
          domain: decode(meta.domain),
          codomain: decode(meta.codomain),
          name: meta.name
        }
      case 'union':
        return {
          kind: 'union',
          types: map(meta.types, (type) => decode(type)),
          name: meta.name
        }
      case 'intersection':
        return {
          kind: 'intersection',
          types: mapValues(meta.types, (type) => decode(type)),
          name: meta.name
        }
      case 'func':
        return {
          kind: 'func',
          domain: decode(meta.domain),
          codomain: decode(meta.codomain),
          name: meta.name
        }
      default:
        throw new Error('tcomb-codec: unknown meta.kind `'+meta.kind+'`')
    }
  },
  decode: function decode (meta) {
    if (meta == null) { return null }
    switch (meta.kind) {
      case 'irreducible':
        return t.irreducible(
          meta.name,
          toFunction(meta.predicate)
        )
      case 'refinement':
        return t.refinement(
          decode(meta.type),
          toFunction(meta.predicate),
          meta.name
        )
      case 'enums':
        return t.enums(meta.map, meta.name)
      case 'maybe':
        return t.maybe(decode(meta.type), meta.name)
      case 'struct':
        return t.struct(
          mapValues(meta.props, (type) => decode(type)),
          meta.name
        )
      case 'tuple':
        return t.tuple(
          map(meta.types, (type) => decode(type)),
          meta.name
        )
      case 'list':
        return t.list(decode(meta.type), meta.name)
      case 'dict':
        return t.dict(
          decode(meta.domain),
          decode(meta.codomain),
          meta.name
        )
      case 'union':
        return t.union(
          map(meta.types, (type) => decode(type)),
          meta.name
        )
      case 'intersection':
        return t.intersection(
          mapValues(meta.types, (type) => decode(type)),
          meta.name
        )
      case 'func':
        return t.func(
          decode(meta.domain),
          decode(meta.codomain),
          meta.name
        )
      default:
        throw new Error('tcomb-codec: unknown meta.kind `'+meta.kind+'`')
    }
  }
}

var genfun = require('generate-function')

function toFunction (string) {
  return genfun(string).toFunction()
}
