# Header Block Authoring Guide

The Header is authored as a fragment (usually at `/nav`) with four distinct sections. Each section corresponds to a specific part of the header layout.

## Content Structure

### Section 1: Brand (Logo)
Contains the primary site logo.
- **Content**: A single image linked to the homepage.
- **Example**:
  | Logo |
  | :--- |
  | ![NICO Life](https://nico-life.com/wp-content/uploads/2024/07/nl-logo.png) |

### Section 2: Tools (Meta Links & Contact)
Contains the top-bar links and contact information.
- **Content**: Two paragraphs/lines of links and text.
- **Example**:
  | Tools |
  | :--- |
  | [Tilitonse Funeral T&Cs](/tcs) \| [Customer Portal](/portal) |
  | [customercare@nicomw.com](mailto:customercare@nicomw.com) \| Call Centre: 323 |

### Section 3: Navigation (Primary Menu)
Contains the main navigation links.
- **Content**: A nested unordered list.
- **Example**:
  | Navigation |
  | :--- |
  | <ul><li>[HOME](/)</li><li>[ABOUT US](/about)<ul><li>[Profile](/profile)</li><li>[Board](/board)</li></ul></li></ul> |

### Section 4: Social
Contains social media links.
- **Content**: A list of links with social media icons.
- **Example**:
  | Social |
  | :--- |
  | [:youtube:](https://youtube.com) [:facebook:](https://facebook.com) [:twitter:](https://twitter.com) |

## Technical Note
The `decorate` function in `header.js` expects exactly 4 sections in the fragment. It will assign classes `.nav-brand`, `.nav-tools`, `.nav-sections`, and `.nav-social` respectively.
