import React from 'react'
import {
  queryByTestId,
  fireEvent,
  render,
  cleanup,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Tooltip, { TOOLTIP_TESTID } from '../Tooltip'
import tooltipStyles from '../Tooltip.module.css'

afterEach(cleanup)

describe('Tooltip component', () => {
  it('should render children text content', () => {
    const mockText = 'Hello, tooltip!'
    const { getByText } = render(<Tooltip>{mockText}</Tooltip>)
    expect(getByText(mockText)).toBeTruthy()
  })

  it('should wrap text children in span', () => {
    const mockText = 'Hello, tooltip!'
    const { getByText } = render(<Tooltip>{mockText}</Tooltip>)
    expect(getByText(mockText).tagName).toBe('SPAN')
  })

  it('should not make any wrappers for non-text children', () => {
    const childrenTestID = 'childrenTestID'
    const { container } = render(
      <Tooltip>
        <div id={childrenTestID} />
      </Tooltip>,
    )
    expect(container.firstChild).toHaveAttribute('id', childrenTestID)
  })

  it('should throw an exception if there are multiple children', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}) // To suppress console.error
    expect(() =>
      render(
        <Tooltip>
          tes <div />
        </Tooltip>,
      ),
    ).toThrowError()
  })

  it('should keep child classname', () => {
    const childTestId = 'childTestId'
    const mockClassName = 'mockClassName'
    const { getByTestId } = render(
      <Tooltip>
        <span data-testid={childTestId} className={mockClassName} />
      </Tooltip>,
    )
    expect(getByTestId(childTestId).className).toBe(mockClassName)
  })

  it('should render tooltip to the body onMouseOver and hide it onMouseLeave', () => {
    const mockText = 'mockText'
    const { getByText } = render(<Tooltip>{mockText}</Tooltip>)
    const children = getByText(mockText)

    fireEvent.mouseOver(children)
    expect(queryByTestId(document.body, TOOLTIP_TESTID)).toBeInTheDocument()

    fireEvent.mouseLeave(children)
    expect(queryByTestId(document.body, TOOLTIP_TESTID)).not.toBeInTheDocument()
  })

  it("should not mute children component's onMouserOver and onMouseLeave", () => {
    const mockText = 'mockText'
    const [mouseOverHandler, mouseLeaveHandler] = [jest.fn(), jest.fn()]
    const { getByText } = render(
      <Tooltip>
        <span onMouseOver={mouseOverHandler} onMouseLeave={mouseLeaveHandler}>
          {mockText}
        </span>
      </Tooltip>,
    )
    const children = getByText(mockText)

    fireEvent.mouseOver(children)
    expect(mouseOverHandler).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(children)
    expect(mouseLeaveHandler).toHaveBeenCalledTimes(1)
  })

  it('should render content', () => {
    const mockTextContent = 'Dat tooltip'
    const triggerTestId = 'triggerTestId'
    const { rerender, getByText, getByTestId } = render(
      <Tooltip content={mockTextContent}>
        <span data-testid={triggerTestId}>Test</span>
      </Tooltip>,
    )

    // Text component
    fireEvent.mouseOver(getByTestId(triggerTestId))
    expect(queryByTestId(document.body, TOOLTIP_TESTID)).toContainElement(
      getByText(mockTextContent),
    )

    // Component content
    const contentTestId = 'contentTestId'
    rerender(
      <Tooltip content={<div data-testid={contentTestId} />}>
        <span data-testid={triggerTestId}>trigger</span>
      </Tooltip>,
    )
    expect(queryByTestId(document.body, TOOLTIP_TESTID)).toContainElement(
      getByTestId(contentTestId),
    )

    // Content render function
    rerender(
      <Tooltip content={() => <div data-testid={contentTestId} />}>
        <span data-testid={triggerTestId}>Test</span>
      </Tooltip>,
    )
    expect(queryByTestId(document.body, TOOLTIP_TESTID)).toContainElement(
      getByTestId(contentTestId),
    )
  })

  it('should have class according the position', () => {
    const triggerTestId = 'triggerTestId'
    const { getByTestId, rerender } = render(
      <Tooltip position="top">
        <span data-testid={triggerTestId}>trigger</span>
      </Tooltip>,
    )
    fireEvent.mouseOver(getByTestId(triggerTestId))
    const cases = [
      ['top', tooltipStyles.tooltipTop],
      ['right', tooltipStyles.tooltipRight],
      ['bottom', tooltipStyles.tooltipBottom],
      ['left', tooltipStyles.tooltipLeft],
    ]
    cases.forEach(([position, className]) => {
      rerender(
        <Tooltip position={position}>
          <span data-testid={triggerTestId}>trigger</span>
        </Tooltip>,
      )
      expect(queryByTestId(document.body, TOOLTIP_TESTID)).toHaveClass(className)
    })
  })
})
