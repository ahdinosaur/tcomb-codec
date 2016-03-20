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
  // encode again as a deterministic hash
  // TODO test decoded form better for correctness
  t.deepEqual(codec.encode(actual), codec.encode(expected))
  t.end()
})
