export default function () {  
  const us = {
    wil: "Wil Nichols-Higgins",
    darien: "Darien Nichols-Higgins",
    us: "Wil & Darien",
    email: "yardsale@nicholshiggins.com"
  }
  const meta = {
    lang: 'en',
    url: 'https://nicholshiggins.com/',
    description: 'Our internet yard sale',
    title: {
      base: us.name,
      separator: ' | '
    }
  }
  return {
    ...us,
    ...meta
  }
}