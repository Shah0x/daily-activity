class TrieNode {
  constructor() {
    // Using a plain object for simplicity.
    // TODO: Consider Map() instead of object literal if we get weird key collisions with Object prototype inherited keys
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Inserts a word into the trie.
   * @param {string} word
   */
  insert(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    // console.log(`Successfully inserted: ${word}`); // debug log
  }

  /**
   * Returns if the word is in the trie.
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    return current.isEndOfWord;
  }

  /**
   * Returns if there is any word in the trie that starts with the given prefix.
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
    let current = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    return true;
  }
  
  // TODO: Implement delete(word). 
  // It's tricky because we must only delete nodes that do not branch to other words.
  // Need to use recursion to clean up from bottom up.
}

// Scratchpad validation 
const myTrie = new Trie();
myTrie.insert("apple");
console.log("Searching for 'apple':", myTrie.search("apple")); // expected: true
console.log("Searching for 'app':", myTrie.search("app"));     // expected: false
console.log("Starts with 'app':", myTrie.startsWith("app"));   // expected: true

myTrie.insert("app");
console.log("Searching for 'app' after insert:", myTrie.search("app")); // expected: true