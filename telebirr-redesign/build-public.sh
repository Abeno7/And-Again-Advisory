#!/usr/bin/env sh
# Builds public/kelal-wallet.html from index.html: renames the brand to the
# fictional "Kelal" and strips the document skeleton (the Artifact host adds its own).
set -e
cd "$(dirname "$0")"
mkdir -p public
sed \
  -e '/^<!doctype html>$/d' -e '/^<html lang="en">$/d' -e '/^<\/html>$/d' \
  -e '/^<head>$/d' -e '/^<\/head>$/d' -e '/^<body>$/d' -e '/^<\/body>$/d' \
  -e '/^<meta /d' \
  -e 's/telebirr Redesign Concept/Kelal Wallet/' \
  -e 's/telebirr · redesign concept/Kelal · wallet concept/' \
  -e 's/Unofficial design concept · not affiliated with Ethio telecom/Fictional brand · design concept/' \
  -e 's/Concept redesign for portfolio and discussion\. telebirr and Ethio telecom are trademarks of their owners\./Kelal is a fictional brand made for this design concept./' \
  -e "s/in telebirr's blue/in Kelal's blue/" \
  -e 's/Endekise savings/Savings goals/g' -e 's/Endekise/Savings/g' \
  -e 's/Mela loan/Quick loan/g' -e 's/>Mela</>Loans</g' \
  -e 's/telebirr/Kelal/g' \
  index.html > public/kelal-wallet.html
if grep -niE 'telebirr|ethio ?telecom|endekise|mela' public/kelal-wallet.html; then
  echo "Brand leak found" >&2; exit 1
fi
echo "Built public/kelal-wallet.html"
