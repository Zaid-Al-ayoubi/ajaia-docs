import { expect, test } from 'vitest'

// دالة بسيطة بنختبرها (نفس اللوجيك اللي بالـ Upload)
function convertTextToHtml(text: string) {
  return text
    .split('\n')
    .map(line => `<p>${line || '<br>'}</p>`)
    .join('')
}

test('converts plain text to HTML paragraphs', () => {
  const input = "Hello\nWorld"
  const expected = "<p>Hello</p><p>World</p>"
  expect(convertTextToHtml(input)).toBe(expected)
})