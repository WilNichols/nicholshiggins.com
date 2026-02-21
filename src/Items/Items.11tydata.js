export default function () {
  return {
    permalink: "/{{ page.fileSlug | slugify }}/index.html",
    layout: 'item.njk',
    tags: ["All Items"],
    date: "Last Modified",
    eleventyComputed: {
      title: data => data.page.fileSlug
    }
  }
}
