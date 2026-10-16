---

## OpenAlex API Quick Reference for AI Agents

### 1. Base URL & Authentication

* **Base URL:** `[https://api.openalex.org](https://api.openalex.org)`
* **Authentication:** Highly recommended to get a free API key at [openalex.org/settings/api](https://openalex.org/settings/api). Pass it via query parameter `?api_key=KEY` or HTTP header `Authorization: Bearer KEY`.
* **Corpus Selection:** Defaults to the curated core corpus (~324M works). Append `corpus=all` to include the expanded corpus (~193M additional works).

### 2. Core Entity Endpoints

* `/works` — Scholarly articles, books, datasets, and preprints.
* `/authors` — Researcher profiles with disambiguated identities.
* `/sources` — Journals, book series, and repositories.
* `/institutions` — Universities and research organizations.
* `/topics` — Subject classifications arranged in a 4-level hierarchy (domain > field > subfield > topic).

---

### 3. Critical Rule: Two-Step ID Lookup

**Never filter by entity names directly** (e.g., author names or institution names), as names are ambiguous. Always use a two-step approach:

```http
# Step 1: Search for the entity to get its canonical ID
GET /authors?search=Heather+Piwowar

# Step 2: Filter the works endpoint using that ID
GET /works?filter=authorships.author.id:A5023888391

```

---

### 4. Essential Query Parameters

- `search=` — Full-text search across titles, abstracts, and full texts.
- `filter=` — Applies strict filters (see syntax below).
- `sort=` — Orders results (e.g., `cited_by_count:desc`).
- `select=` — Restricts returned JSON fields to reduce payload size (e.g., `select=id,title,publication_year`).
- `per_page=` — Number of records per page (default: 25, max: 100).
- `group_by=` — Aggregates results by a specified field (great for topic distributions or year trends).

---

### 5. Filter Syntax Rules

- **AND Condition:** Comma-separated filters (`?filter=publication_year:2024,is_oa:true`).
- **OR Condition:** Pipe-separated values up to 100 items (`?filter=type:article|book|dataset`).
- **Negation:** Use `!` (`?filter=type:!paratext`).
- **Numeric Ranges:** Use operators (`?filter=cited_by_count:>100` or `publication_year:2020-2024`).

### 6. Common Filter Fields for `/works`

- `authorships.author.id` — Author ID
- `authorships.institutions.id` — Institution ID
- `primary_location.source.id` — Journal/Source ID
- `topics.id` — Topic ID
- `publication_year` — Integer year
- `cited_by_count` — Total citation count
- `is_oa` — Boolean for open-access availability
