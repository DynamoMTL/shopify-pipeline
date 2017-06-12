import Foo from '../../assets/js/utilities/foo'

test('my passing test', () => {
  expect(Foo.bar('baz')).toBe('Bar: baz')
})
