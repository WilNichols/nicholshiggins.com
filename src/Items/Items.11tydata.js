export default function () {
  return {
    permalink: "/{{ page.fileSlug | slugify }}/index.html",
    layout: 'item.njk'
  }
}
