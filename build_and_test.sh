#!/bin/zsh

echo "🧹 Removing old builds..."
rm -rf fonts/ttf fonts/otf fonts/webfonts

echo "🏗  Building fonts..."
python3 -m gftools.builder build.yaml

echo "📁 Creating reports folder..."
mkdir -p reports

echo "🧪 Running FontBakery..."
fontbakery check-googlefonts fonts/ttf/AgravePro-*.ttf \
  --html reports/fontbakery-agravepro.html

echo "📖 Opening report..."
open reports/fontbakery-agravepro.html

echo "✅ Done!"
