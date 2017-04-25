import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if ('target' in node) {
    node.setAttribute('target','_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {};
}

export function colourIsLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Counting the perceptive luminance
  // human eye favors green color...
  var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return (a < 0.5);
}

export const markdown = new MarkdownIt({
  linkify: true,
});

export const sanitize = DOMPurify.sanitize;
