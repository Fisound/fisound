/**
 * Fisound Search
 * Usage: search("query") → Promise<Array>
 *
 * Each result object:
 *   { id, filename, title, tags, duration, uploader, url }
 *
 * The manifest lives at cdn/audio/manifest.json.
 * Add entries there for every file you drop in cdn/audio/.
 */

const MANIFEST_URL = "cdn/audio/manifest.json";
const AUDIO_BASE   = "cdn/audio/";

let _manifest = null;

async function _loadManifest() {
  if (_manifest) return _manifest;
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error("Could not load audio manifest.");
  _manifest = await res.json();
  return _manifest;
}

/**
 * Search audio files by query string.
 * Matches against title and tags (case-insensitive).
 * Returns all files if query is empty.
 *
 * @param {string} query
 * @returns {Promise<Array<{id, filename, title, tags, duration, uploader, url}>>}
 */
async function search(query = "") {
  const manifest = await _loadManifest();
  const q = query.trim().toLowerCase();

  const results = q
    ? manifest.filter(track =>
        track.title.toLowerCase().includes(q) ||
        (track.tags || []).some(tag => tag.toLowerCase().includes(q))
      )
    : manifest;

  return results.map(track => ({
    ...track,
    url: AUDIO_BASE + track.filename,
  }));
}
