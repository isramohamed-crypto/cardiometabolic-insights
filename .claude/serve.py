#!/usr/bin/env python3
import os, http.server
os.chdir("/Users/sarahpage/Documents/Projects/Pre-Rx/People Inc")
handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(("", 8080), handler) as httpd:
    httpd.serve_forever()
