import React, { Component } from 'react'

import articleStyles from './article.module.css'
import codeSnippetImage from './code_snippet.png'
import Tooltip from './components/Tooltip/Tooltip'

class App extends Component {
  render() {
    return (
      <article className={articleStyles.article}>
        <header>Introducing JSX</header>

        <header className={articleStyles.subheader}>
          Consider this variable declaration:
        </header>

        <div className={articleStyles.imageContainer}>
          <Tooltip content="This is the code snippet">
            <img src={codeSnippetImage} alt="code snippet" />
          </Tooltip>
        </div>

        <p>This funny tag syntax is neither a string nor HTML.</p>

        <p>
          It is called{' '}
          <Tooltip
            position="bottom"
            content={
              <React.Fragment>
                <b>J</b>ava<b>S</b>cript <b>X</b>ML
              </React.Fragment>
            }
            textHighlight
            textUnderline
          >
            JSX
          </Tooltip>
          , and it is a syntax extension to JavaScript. We recommend using it
          with React to describe what the UI should look like. JSX may remind
          you of a template language, but it comes with the full power of
          JavaScript.
        </p>

        <p>
          JSX produces React “elements”. We will explore rendering them to the{' '}
          <Tooltip
            content="Document Object Model"
            position="left"
            textHighlight="#bbeffd"
          >
            DOM
          </Tooltip>{' '}
          in the next section. Below, you can find the basics of JSX necessary
          to get you started.
        </p>

        <p className={articleStyles.buttonContainer}>
          <Tooltip content="A tooltip for the button!" position="right">
            <button type="button">Hover me!</button>
          </Tooltip>
        </p>

        <p>
          <i>
            The text is taken from{' '}
            <a href="https://reactjs.org/docs/introducing-jsx.html">
              React Docs
            </a>
          </i>
        </p>
      </article>
    )
  }
}

export default App
