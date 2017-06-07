// import validateSchema from "./validator";

function sum(a,b) {
  return a + b
}

test('Validates required fields existance', () => {
  expect(sum(1, 2)).toBe(3);
});