// cSpell Settings
// REF https://cspell.org/configuration/
module.exports = {
    // Version of the setting file.
    version: "0.0.2",
    // language - current active spelling language
    language: "en",
    // words - list of words to be always considered correct
    words: [
        "Alphanum",
        "Fuction",
        "backlink",
        "enxa",
        "fcontent",
        "filetree",
        "katex",
        "nodelib",
        "pandoc",
        "siyuan",
    ],
    // flagWords - list of words to be always considered incorrect
    // This is useful for offensive words and common spelling errors.
    // For example "hte" should be "the"
    flagWords: [
    ],
    ignorePaths: [
        "./package.json",
        "./pnpm-lock.yaml",

        "./build/**",
        "./coverage/**",
        "./dist/**",
        "./node_modules/**",
        "./temp/**",
    ],
};