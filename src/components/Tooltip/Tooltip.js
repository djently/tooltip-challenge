import React, { cloneElement, Component } from 'react'
import { createPortal } from 'react-dom'

export const TOOLTIP_TESTID = 'TOOLTIP_TESTID'

export default class Tooltip extends Component {
  state = { isVisible: false }
  render() {
    const { children } = this.props

    let child =
      typeof children === 'string' ? (
        <span>{children}</span>
      ) : (
        React.Children.only(children)
      )

    const eventHandlersProps = {
      onMouseOver: this.makeHandleMouseOver(child.props),
      onMouseLeave: this.makeHandleMouseLeave(child.props),
      key: child.props.key || 'tooltip-children',
    }

    const childClone = cloneElement(child, eventHandlersProps)
    return [childClone, this.renderTooltip()]
  }

  makeHandleMouseOver = ({ onMouseOver }) => event => {
    if (typeof onMouseOver === 'function') {
      onMouseOver(event)
    }
    this.setState({ isVisible: true })
  }

  makeHandleMouseLeave = ({ onMouseLeave }) => event => {
    if (typeof onMouseLeave === 'function') {
      onMouseLeave(event)
    }
    this.setState({ isVisible: false })
  }

  renderTooltip() {
    const { isVisible } = this.state
    return isVisible
      ? createPortal(this.renderTooltipContent(), document.body)
      : null
  }

  renderTooltipContent() {
    return <div data-testid={TOOLTIP_TESTID}>tooltip</div>
  }
}
