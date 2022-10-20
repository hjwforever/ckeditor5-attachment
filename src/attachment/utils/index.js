const ATTRIBUTE_WHITESPACES = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g // eslint-disable-line no-control-regex
const SAFE_URL = /^(?:(?:https?|ftps?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i

// Simplified email test - should be run over previously found URL.
const EMAIL_REG_EXP = /^[\S]+@((?![-_])(?:[-\w\u00a1-\uffff]{0,63}[^-_]\.))+(?:[a-z\u00a1-\uffff]{2,})$/i

// The regex checks for the protocol syntax ('xxxx://' or 'xxxx:')
// or non-word characters at the beginning of the link ('/', '#' etc.).
const PROTOCOL_REG_EXP = /^((\w+:(\/{2,})?)|(\W))/i

/**
 * A keystroke used by the {@link module:link/linkui~LinkUI link UI feature}.
 */
export const LINK_KEYSTROKE = 'Ctrl+K'

/**
 * Returns `true` if a given view node is the link element.
 *
 * @param {module:engine/view/node~Node} node
 * @returns {Boolean}
 */
export function isLinkElement(node) {
  return node.is('attributeElement') && !!node.getCustomProperty('link')
}

/**
 * Creates a link {@link module:engine/view/attributeelement~AttributeElement} with the provided `href` attribute.
 *
 * @param {String} href
 * @param {module:engine/conversion/downcastdispatcher~DowncastConversionApi} conversionApi
 * @returns {module:engine/view/attributeelement~AttributeElement}
 */
export function createLinkElement(href, { writer }) {
  // Priority 5 - https://github.com/ckeditor/ckeditor5-link/issues/121.
  const linkElement = writer.createAttributeElement('a', { href }, { priority: 5 })
  writer.setCustomProperty('link', true, linkElement)

  return linkElement
}

/**
 * Returns a safe URL based on a given value.
 *
 * A URL is considered safe if it is safe for the user (does not contain any malicious code).
 *
 * If a URL is considered unsafe, a simple `"#"` is returned.
 *
 * @protected
 * @param {*} url
 * @returns {String} Safe URL.
 */
export function ensureSafeUrl(url) {
  url = String(url)

  return isSafeUrl(url) ? url : '#'
}

// Checks whether the given URL is safe for the user (does not contain any malicious code).
//
// @param {String} url URL to check.
function isSafeUrl(url) {
  const normalizedUrl = url.replace(ATTRIBUTE_WHITESPACES, '')

  return normalizedUrl.match(SAFE_URL)
}

export function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

export function debugLog() {
  console.log(...arguments)
}
