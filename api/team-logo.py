"""Same-origin MLB team-logo proxy with long-lived browser caching."""

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen


TEAM_SLUGS = {
    108: "laa", 109: "ari", 110: "bal", 111: "bos", 112: "chc", 113: "cin",
    114: "cle", 115: "col", 116: "det", 117: "hou", 118: "kc", 119: "lad",
    120: "wsh", 121: "nym", 133: "oak", 134: "pit", 135: "sd", 136: "sea",
    137: "sf", 138: "stl", 139: "tb", 140: "tex", 141: "tor", 142: "min",
    143: "phi", 144: "atl", 145: "chw", 146: "mia", 147: "nyy", 158: "mil",
}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        try:
            team_id = int(query.get("teamId", [""])[0])
        except (TypeError, ValueError):
            return self._send_error(400)

        slug = TEAM_SLUGS.get(team_id)
        if not slug:
            return self._send_error(404)

        sources = (
            f"https://a.espncdn.com/i/teamlogos/mlb/500/{slug}.png",
            f"https://www.mlbstatic.com/team-logos/{team_id}.svg",
        )
        for source in sources:
            try:
                request = Request(source, headers={"User-Agent": "Krazy-Picks/1.0", "Accept": "image/*"})
                with urlopen(request, timeout=8) as response:
                    body = response.read()
                    content_type = response.headers.get_content_type()
                if body and content_type.startswith("image/"):
                    self.send_response(200)
                    self.send_header("Content-Type", content_type)
                    self.send_header("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return
            except Exception:  # noqa: BLE001
                continue
        self._send_error(502)

    def _send_error(self, status):
        self.send_response(status)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

