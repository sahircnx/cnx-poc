/**
 * Info Cards Block logic for NICO Life.
 * Layout: Text-only cards in a grid/flex row.
 */

export default function decorate(block) {
    /* Change the structure to a flat list of cards */
    const cardRows = [...block.children];
    block.textContent = '';

    cardRows.forEach((row) => {
        const card = document.createElement('div');
        card.classList.add('info-card');

        // Expected structure: Column 1 contains all the content
        const content = row.children[0];
        if (content) {
            card.append(...content.childNodes);

            // Add specialized classes to internal elements for easier styling
            const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading) heading.classList.add('info-card-heading');

            const paragraphs = card.querySelectorAll('p');
            paragraphs.forEach((p) => p.classList.add('info-card-text'));
        }

        block.append(card);
    });
}
