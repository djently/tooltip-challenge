export default function makeTooltipStyles(position, { x, y, width, height }) {
  switch (position) {
    case 'top':
      return { top: y, left: x + width / 2 }
    case 'bottom':
      return { top: y + height, left: x + width / 2 }
    case 'left':
      return { top: y, left: x }
    case 'right':
      return { top: y, left: x + width }
    default:
      return { top: y, left: x + width / 2 }
  }
}
