---
layout: index.njk
title: "Wil’s & Darien’s internet yard sale"
pagination:
  data: collections['tagsList']
  size: 1
  alias: tag
permalink: "{% if tag == 'All Items' %}/index.html{% else %}/{{ tag | slugify }}/index.html{% endif %}"
---
# Hi there!
Welcome to our internet yard sale.

We move to France in under two months, and between large items and 110-120 volt appliances, little is moving with me. Help me get rid of it all. Haggling is welcome, but you’ll already find steep discounts.

If something’s not listed, we might have it anyway. [Ask about a specific item.](mailto:{{ meta.email }})
