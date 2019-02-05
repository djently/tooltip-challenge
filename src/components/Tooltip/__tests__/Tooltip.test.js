import React from 'react'
import {
  queryByTestId,
  fireEvent,
  render,
  cleanup,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Tooltip, { TOOLTIP_TESTID } from '../Tooltip'

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
})
