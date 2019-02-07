import React, { cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import { createPortal, findDOMNode } from 'react-dom'
import classNames from 'classnames'

import { TOOLTIP_TESTID, HIGHLIGHT_DEFAULT } from './constants'
import styles from './Tooltip.module.scss'
import makeTooltipStyles from './utils/makeTooltipStyles'

export default class Tooltip extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.node,
      PropTypes.element,
    ]),
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    textHighlight: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    textUnderline: PropTypes.bool,
    light: PropTypes.bool,
  }

  static defaultProps = {
    position: 'top',
  }

  state = { isVisible: false, node: null }

  componentDidMount() {
    this.setState({ node: findDOMNode(this) })
  }

  render() {
    const { children } = this.props

    let child =
      typeof children === 'string'
        ? this.renderTextChild()
        : React.Children.only(children)

    const eventHandlersProps = {
      onMouseOver: this.makeHandleMouseOver(child.props),
      onMouseLeave: this.makeHandleMouseLeave(child.props),
      key: child.props.key || 'tooltip-children',
    }

    const childClone = cloneElement(child, eventHandlersProps)
    return [childClone, this.renderTooltip(childClone)]
  }

  renderTextChild() {
    const { children, textHighlight, textUnderline } = this.props
    let textChildStyles = {}
    if (textHighlight) {
      textChildStyles.backgroundColor =
        typeof textHighlight === 'string' ? textHighlight : HIGHLIGHT_DEFAULT
    }
    textChildStyles.textDecoration = textUnderline && 'underline'
    return <span style={textChildStyles}>{children}</span>
  }

  renderTooltip(triggerNode) {
    const { isVisible, node } = this.state
    return node && isVisible
      ? createPortal(this.renderTooltipContent(triggerNode), document.body)
      : null
  }

  renderTooltipContent() {
    const { content, position, light } = this.props
    const { node } = this.state

    if (!node || !content) {
      return null
    }

    const boundingRect = node.getBoundingClientRect()
    const tooltipStyles = makeTooltipStyles(position, boundingRect)

    return (
      <div
        data-testid={TOOLTIP_TESTID}
        className={classNames(styles.tooltip, {
          [styles.tooltipLight]: light,
          [styles.tooltipTop]: position === 'top',
          [styles.tooltipRight]: position === 'right',
          [styles.tooltipBottom]: position === 'bottom',
          [styles.tooltipLeft]: position === 'left',
        })}
        style={tooltipStyles}
      >
        {typeof content === 'function' ? content() : content}
      </div>
    )
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
}
