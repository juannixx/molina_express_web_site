# Image generation prompts - Molina Express

Cada imagem abaixo tem um placeholder SVG no repo. Gerar a imagem, exportar
no formato/dimensão indicados e salvar por cima do path indicado (o código
já referencia esse path). Depois atualizar a extensão em `src/content/site.ts`
e remover o campo `status` correspondente.

## 1. hero-operation (home)
- Path final: `public/images/hero-operation.jpg` (1600x1000, JPG qualidade 80)
- Alt text (já no código): "Molina Express driver loading labelled parcels into a branded van at first light"
- Prompt: "Documentary photograph, delivery driver in navy uniform loading labelled cardboard parcels into the back of a white long-wheelbase van, early morning golden light, UK industrial estate, thermal shipping labels visible, shallow depth of field, candid working moment, no posing, natural colors, 35mm"

## 2. tracking-mock
- Path final: `public/images/tracking-mock.png` (1200x900, PNG)
- Alt text: "Molina Express tracking screen showing a live map with driver position and delivery status"
- Prompt: "Clean mobile app UI mockup of a parcel tracking screen, street map of Ipswich UK with a cobalt blue route line and van position marker, status timeline showing Picked up / In transit / Delivered with the middle step active, white background, sans-serif typography, no watermark, high fidelity UI design"

## 3. hero-drivers
- Path final: `public/images/hero-drivers.jpg` (1600x1000, JPG qualidade 80)
- Alt text: "Molina Express driver in uniform closing the rear door of a long-wheelbase van"
- Prompt: "Documentary photograph, confident delivery driver in navy uniform closing the rear roller door of a white 3.5 tonne van, British residential street, daylight, hi-vis vest draped on shoulder, genuine work moment, natural skin tones, 50mm lens"

## 4. hero-fulfilment
- Path final: `public/images/hero-fulfilment.jpg` (1600x1000, JPG qualidade 80)
- Alt text: "Racked pallet positions inside the Molina Fulfilment warehouse in Ipswich"
- Prompt: "Documentary photograph inside a small clean UK fulfilment warehouse, blue steel pallet racking filled with shrink-wrapped pallets and labelled cartons, worker with handheld scanner picking an order, bright even industrial lighting, packing bench with tape and boxes in foreground, realistic working operation, 35mm"

## 5. og (Open Graph)
- Path final: `public/images/og.jpg` (1200x630, JPG)
- Prompt: "Wide banner, white background, bold extra-wide dark blue headline 'Delivery across East Anglia' left-aligned, a cobalt route line with vertex dots crossing the composition, small green reflective accent, minimal, print-quality graphic design, no photo"

Regra: verificar cada imagem no navegador em 360px e 1440px antes de publicar.
