# WordPress Multi-Block Boilerplate (Plugin)

A tiny setup for building **multiple Gutenberg blocks** in **one plugin** with a single toolchain.

- **Block API v3** everywhere (editor iframe isolation)  
- One **`package.json`** for all blocks  
- Per-block builds go to `build/<slug>` (with `index.asset.php`)  
- Fast registration via **blocks manifest** (WP **6.8+** one-call API; **6.7** fallback)  
- Optional custom **Node helper** (`scripts/new-block.mjs`) to scaffold new blocks without copy-pasting flags  

<br>

## Available NPM Scripts:

| Script          | Purpose                                                                                                                                            |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`new:block`** | Runs the Node helper (`scripts/new-block.mjs`) to scaffold a new block interactively using `@wordpress/create-block` with your namespace and slug. |
| **`build`**     | Compiles all blocks from `src/` into `build/<namespace>/<slug>/`, generating JS, CSS, and `.asset.php` files. Also updates the blocks manifest.    |
| **`start`**     | Runs the same build pipeline in **watch** mode for local development.                                                                              |
| **`start:hot`** | Starts the dev server with **Hot Module Reloading (HMR)** for instant updates inside the block editor.                                             |
| **`manifest`**  | Regenerates the `blocks-manifest.php` file for WordPress 6.7 / 6.8 optimized block registration.                                                   |


<br>

## Requirements

- **WordPress** ≥ 6.8  *(works on 6.7 with the fallback)*  
- **PHP** ≥ 7.4
- **Node.js** ≥ 20
