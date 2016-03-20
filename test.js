var test = require('tape')
var tcomb = require('tcomb')

var codec = require('./')

var decodedStruct = tcomb.struct({
  name: tcomb.String
}, 'Type')

var encodedStruct = {
  kind: 'struct',
  name: 'Type',
  props: {
    name: {
      name: 'String',
      kind: 'irreducible',
      predicate: tcomb.String.meta.predicate.toString()
    }
  }
}

test('encodes basic struct', function (t) {
  var Type = decodedStruct
  var actual = codec.encode(Type)
  var expected = encodedStruct
  t.deepEqual(actual, expected)
  t.end()
})

test('decodes basic struct', function (t) {
  var meta = encodedStruct
  var actual = codec.decode(meta)
  var expected = decodedStruct
  console.dir(actual.meta.props)
  console.dir(expected.meta.props)
  t.deepEqual(actual.meta.props, expected.meta.props)
  t.end()
})
