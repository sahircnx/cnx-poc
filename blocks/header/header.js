import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // NICO Life Structure: top-bar and main-nav
  const topBarContainer = document.createElement('div');
  topBarContainer.classList.add('nav-top-bar');

  const mainNavContainer = document.createElement('div');
  mainNavContainer.classList.add('nav-main-nav');

  const innerMainNavContainer = document.createElement('div');
  innerMainNavContainer.classList.add('nav-main-nav-inner');
  mainNavContainer.append(innerMainNavContainer);

  const navSectionsRaw = [...nav.children];
  console.log('Nav sections found:', navSectionsRaw.length);

  // Identify sections by content
  const brand = navSectionsRaw.find((s) => s.querySelector('picture, img'));
  const social = navSectionsRaw.find((s) => s.querySelector('.icon'));

  // Distinguish between main nav and tools: main nav usually has more list items
  const lists = navSectionsRaw.filter((s) => s.querySelector('ul') && s !== brand && s !== social);
  let sections;
  let tools;

  if (lists.length >= 2) {
    // Pick the one with more LI items as 'sections'
    lists.sort((a, b) => b.querySelectorAll('li').length - a.querySelectorAll('li').length);
    [sections, tools] = lists;
  } else if (lists.length === 1) {
    sections = lists[0];
    tools = navSectionsRaw.find((s) => s !== brand && s !== social && s !== sections);
  } else {
    tools = navSectionsRaw.find((s) => s !== brand && s !== social);
  }

  if (brand) {
    brand.classList.add('nav-brand');
    topBarContainer.append(brand);
  }

  if (tools) {
    tools.classList.add('nav-tools');
    topBarContainer.append(tools);
  }

  if (sections) {
    sections.classList.add('nav-sections');
    innerMainNavContainer.append(sections);

    sections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(sections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  if (social) {
    social.classList.add('nav-social');
    innerMainNavContainer.append(social);
  }

  // Search component
  const search = document.createElement('div');
  search.classList.add('nav-search');
  search.innerHTML = `
        <input class="nav-search-input" type="text" name="q" placeholder="Search..." aria-label="Search">
  `;
  innerMainNavContainer.append(search);

  // Toggle search input on click
  // const searchBtn = search.querySelector('.nav-search-button');
  // searchBtn.addEventListener('click', () => {
  //   search.classList.toggle('active');
  //   if (search.classList.contains('active')) {
  //     search.querySelector('input').focus();
  //   }
  // });

  nav.innerHTML = '';
  nav.append(topBarContainer);
  nav.append(mainNavContainer);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, sections));
  innerMainNavContainer.append(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Initial state and layout change handling
  isDesktop.addEventListener('change', () => toggleMenu(nav, sections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  decorateIcons(nav);
}
