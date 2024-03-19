// cSpell Settings
// REF https://cspell.org/configuration/
module.exports = {
    $schema: "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/packages/cspell-types/cspell.schema.json",
    // Version of the setting file.
    version: "0.0.2",
    // language - current active spelling language
    language: "en",
    // words - list of words to be always considered correct
    words: [
        "ALPN",
        "Alives",
        "Alphanum",
        "FSRS",
        "Fuction",
        "IAPI",
        "ITLS",
        "IURL",
        "OCSP",
        "Proto",
        "Punycode",
        "Referer",
        "backlink",
        "backlinks",
        "backmention",
        "blockquote",
        "cobertura",
        "contenteditable",
        "docpath",
        "docsize",
        "dotfiles",
        "endregion",
        "enxa",
        "fcontent",
        "filetree",
        "formdata",
        "fullscreen",
        "hpath",
        "hpaths",
        "idna",
        "iframe",
        "iife",
        "instanceof",
        "katex",
        "keymap",
        "lcov",
        "nodelib",
        "ofetch",
        "outdent",
        "pandoc",
        "protyle",
        "quicktype",
        "siyuan",
        "succ",
        "userinfo",
        "webdav",
    ],
    ignoreRegExpList: [
        String.raw`\d{14}-[0-9a-z]{7}`,
    ],
    // flagWords - list of words to be always considered incorrect
    // This is useful for offensive words and common spelling errors.
    // For example "hte" should be "the"
    flagWords: [
    ],
    ignorePaths: [
        "./package.json",
        "./pnpm-lock.yaml",

        "./coverage/**",
        "./dist/**",
        "./node_modules/**",
        "./temp/**",
        "./tests/constants.ts",
    ],
};
