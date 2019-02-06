import React, { cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import { createPortal, findDOMNode } from 'react-dom'
import classNames from "classnames";

import styles from './Tooltip.module.css'
import makeTooltipStyles from './makeTooltipStyles'

export const TOOLTIP_TESTID = 'TOOLTIP_TESTID'

export default class Tooltip extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.node,
    ]),
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  }

  static defaultProps = {
    position: 'top',
  }

  state = { isVisible: false, node: null }

  componentDidMount() {
    const node = findDOMNode(this)
    this.setState({ node })
    node.addEventListener('resize', this.handleResize)
  }

  handleResize = () => console.log('resize')

  componentWillUnmount() {
    this.state.node.removeEventListener('resize', this.handleResize)
  }

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
    return [childClone, this.renderTooltip(childClone)]
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

  renderTooltip(triggerNode) {
    const { isVisible, node } = this.state
    return node && isVisible
      ? createPortal(this.renderTooltipContent(triggerNode), document.body)
      : null
  }

  renderTooltipContent() {
    const { content, position } = this.props
    const { node } = this.state

    if (!node) { return null };

    const boundingRect = node.getBoundingClientRect()
    const tooltipStyles = makeTooltipStyles(position, boundingRect)

    return (
      <div
        data-testid={TOOLTIP_TESTID}
        className={classNames(styles.tooltip, {
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
}
