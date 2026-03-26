/**
 * Promo Cards Block logic for NICO Life.
 * Layout: Image left, Content right.
 */

export default function decorate(block) {
    const cards = [...block.children];
    block.textContent = '';

    cards.forEach((row) => {
        const card = document.createElement('div');
        card.classList.add('promo-card');

        // Col 1: Image
        const imgCol = row.children[0];
        if (imgCol) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('promo-card-image');
            imgContainer.append(...imgCol.childNodes);
            card.append(imgContainer);
        }

        // Col 2: Content
        const contentCol = row.children[1];
        if (contentCol) {
            const contentContainer = document.createElement('div');
            contentContainer.classList.add('promo-card-content');
            contentContainer.append(...contentCol.childNodes);

            // Transform headings for better styling if needed
            const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading) heading.classList.add('promo-card-heading');

            // Decorate buttons
            contentContainer.querySelectorAll('a').forEach((link) => {
                link.classList.add('button', 'primary');
            });

            card.append(contentContainer);
        }

        block.append(card);
    });
}
