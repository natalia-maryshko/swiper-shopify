# Swiper Gallery (Shopify theme – Dawn based)

Тестове завдання: Swiper-галерея в існуючій секції продукту + фільтрація фото за кольором без перезавантаження.

## Live preview
- Store: https://test-store-nata.myshopify.com/?preview_theme_id=183561257328
- Password: MyFirtsStore1222


## Локальний запуск
```bash
shopify login --store test-store-nata.myshopify.com
shopify theme dev


Деплой прев’ю-теми
```bash
shopify theme push --unpublished
# або
shopify theme push --theme 183561257328

Структура
snippets/swiper-gallery.liquid – розмітка Swiper + JSON-конфіг

assets/swiper-gallery.js – ініціалізація Swiper + фільтр

assets/swiper-gallery.css – стилі слайдера

sections/main-product.liquid – вмикання/вимикання Swiper через schema