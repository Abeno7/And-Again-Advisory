#!/usr/bin/env sh
# Builds public/bela-delivery.html from index.html: renames the brand to the
# fictional "Bela" and strips the document skeleton (the Artifact host adds its own).
set -e
cd "$(dirname "$0")"
mkdir -p public
sed \
  -e '/^<!doctype html>$/d' -e '/^<html lang="en">$/d' -e '/^<\/html>$/d' \
  -e '/^<head>$/d' -e '/^<\/head>$/d' -e '/^<body>$/d' -e '/^<\/body>$/d' -e '/^<meta /d' \
  -e 's/beU Delivery Redesign/Bela Delivery/' \
  -e 's/be<span>U<\/span>/Be<span>la<\/span>/g' \
  -e 's/A redesign of beU Delivery that keeps its orange identity and works end to end\./A delivery app concept in warm orange that works end to end./' \
  -e 's/Unofficial redesign concept · not affiliated with beU Delivery\./Bela is a fictional brand made for this demo./' \
  -e 's/working redesign prototype/working prototype/' \
  -e 's/beU/Bela/g' \
  index.html > public/bela-delivery.html
if grep -nE 'beU|beu-|redesign' public/bela-delivery.html; then echo "Brand leak found" >&2; exit 1; fi
echo "Built public/bela-delivery.html"
