# Obsidian-Pseudocode

This is a plugin for [Obsidian](https://obsidian.md/) that allows you to render LaTeX-style pseudocode inside a code block. The plugin is based on [pseudocode.js](https://github.com/SaswatPadhi/pseudocode.js), a JavaScript library that typesets pseudocode beautifully to HTML.

## Features

- Intuitive grammar: The plugin takes a LaTeX-style input that supports the algorithmic constructs from LaTeX's algorithm packages. With or without LaTeX experience, a user should find the grammar fairly intuitive.
- Print quality: The HTML output produced by the plugin is (almost) identical with the pretty algorithms printed on publications that are typeset by LaTeX.
- Math formula support: Inserting math formulas in the pseudocode is as easy as LaTeX. Just enclose math expression in `$...$` or `\(...\)`.

### Future Features

- [ ] Syntax highlighting.
- [x] Auto-completion inside `pseudo` code block. (Release 1.1.0)

## Usage

To use the plugin, simply create a code block in your Obsidian note and add your pseudocode inside it. Then, add the language specifier `pseudo` (short for "pseudocode") to the code block. The plugin will automatically render the pseudocode as LaTeX.

**Rocommend: use the command `Pseudocode: Insert a new pseudocode block` to start.**

Here is an example:

```
    ```pseudo
    \begin{algorithm}
    \caption{Quicksort}
    \begin{algorithmic}
      \PROCEDURE{Quicksort}{$A, p, r$}
        \IF{$p < r$}
          \STATE $q = $ \CALL{Partition}{$A, p, r$}
          \STATE \CALL{Quicksort}{$A, p, q - 1$}
          \STATE \CALL{Quicksort}{$A, q + 1, r$}
        \ENDIF
      \ENDPROCEDURE
      \PROCEDURE{Partition}{$A, p, r$}
        \STATE $x = A[r]$
        \STATE $i = p - 1$
        \FOR{$j = p$ \TO $r - 1$}
          \IF{$A[j] < x$}
            \STATE $i = i + 1$
            \STATE exchange
            $A[i]$ with $A[j]$
          \ENDIF
        \STATE exchange $A[i]$ with $A[r]$
        \ENDFOR
      \ENDPROCEDURE
      \end{algorithmic}
    \end{algorithm}
    ```
```

This will be rendered as:

<img src="assets/example.png" alt="example" width="70%">

## Installation

### Use [BRAT](https://github.com/TfTHacker/obsidian42-brat#Quick-Guide-for-using-BRAT)

1. Install **Obsidian-42 BRAT** from the Community Plugins in Obsidian.
2. Open the command palette and run the command `BRAT: Add a beta plugin for testing`. Input this repo's URL `https://github.com/Yaotian-Liu/obsidian-pseudocode`.
3. Click on **Add Plugin** -- wait a few seconds and BRAT will tell you what is going on.
4. After BRAT confirms the installation, in Settings go to the **Community plugins** tab.
5. Refresh the list, find `Pseudocode` and enable it.

### Manual install

1. Create a folder named `pseudocode-in-obs` in your Obsidian vault plugin folder (which is {Your Vault}/.obsidian/plugins).
2. Download `main.js`, `manifest.json` and `styles.css` from the [releases page](https://github.com/yaotian-liu/obsidian-pseudocode/releases/latest), to the folder you just created in step 1.
3. Open your Obsidian, and enable the plugin in "Community Plugins" setting page.
4. Enjoy.

### Install from the Community Plugins in Obsidian.

Pending... You can check the [PR](https://github.com/obsidianmd/obsidian-releases/pull/1756).

<!-- ## Known Issues -->



## Credits

This plugin is based on [pseudocode.js](https://github.com/SaswatPadhi/pseudocode.js), a JavaScript library that typesets pseudocode beautifully to HTML. Many thanks to the pseudocode.js team for their great work!
