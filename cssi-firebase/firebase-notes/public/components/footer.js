/**
 * Creates a reusable Footer component across multiple pages.
 * 
 * Usage:
 * <x-footer></x-footer>
 *
 * Documentation:
 *  - Bulma: TODO
 */
const footerTemplate = `
    <style></style>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="http://jgthms.com">Jeremy Thomas</a>.
            The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
          <p>
            <strong>ml5.js</strong> is an open source machine learning library in JavaScript. See
            the <a href="https://ml5js.org/">documentation</a> for more information.
          </p>
          <p>
            <strong>emoji.css</strong> is an <a href='https://ionicabizau.github.io/emoji.css/'>open source CSS style sheet</a>.
            The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
        </div>
      </div>
    </footer>
`;

/**
 * XFooter class that defineds the behavior of the <x-navbar> element.
 */
class XFooter extends HTMLElement {
    constructor() {
        super();
    }

  connectedCallback() {
    this.innerHTML = footerTemplate;
  }
}

customElements.define('x-footer', XFooter);