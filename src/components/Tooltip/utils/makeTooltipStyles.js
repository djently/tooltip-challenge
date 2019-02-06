export default function makeTooltipStyles(position, { left, top, width, height }) {
  switch (position) {
    case 'top':
      return { top: top + window.scrollY, left: left + width / 2 + window.scrollX }
    case 'bottom':
      return { top: top + height + window.scrollY, left: left + width / 2 + window.scrollX }
    case 'left':
      return { top: top + window.scrollY, left: left + window.scrollX }
    case 'right':
      return { top: top + window.scrollY, left: left + width + window.scrollX }
    default:
      return { top: top + window.scrollY, left: left + width / 2 + window.scrollX }
  }
}
