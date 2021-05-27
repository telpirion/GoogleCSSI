/**
 * Creates a reusable NavBar component across multiple pages.
 * 
 * Usage:
 * <x-navbar></x-navbar>
 * 
 * Documentation:
 *  - Bulma: https://bulma.io/documentation/components/navbar/
 *  - MDN: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
 */
const navTemplate = `
<style>
   .navbar {
       background-color: #ccc;
   }
   .firebrand {
       margin-top: 10px;
       margin-left: 10px;
       margin-right: 20px;
   }
   .avatar {
       border-radius: 12px;
   }
</style>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <h3 class="title is-2 firebrand">
        🔥
    </h3>

    <a role="button" class="navbar-burger"
       aria-label="menu"
       aria-expanded="false"
       data-target="navbarMenu">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarMenu" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item" href="writeNote.html">
        Write
      </a>
      <a class="navbar-item" href="viewNotes.html">
        View / Edit
      </a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="log-in button is-hidden is-primary">
            <strong>Log in</strong>
          </a>
          <a class="log-out button is-light">
            Log out
          </a>
        </div>
      </div>
    </div>
    <div class="navbar-item">    
        <a class="avatar image is-48x48" style="background: url('img/simple-avatar-48.png'); background-repeat: no-repeat">
        </a>
    </div>
  </div>
</nav>
`;

/**
 * XNavBar class that defineds the behavior of the <x-navbar> element.
 */
class XNavBar extends HTMLElement {

    // Required default constructor.
    constructor() {
        super();
        this.USER_AVATAR_URL_KEY = 'userAvatar';
        this.USER_IS_LOGGED_IN = 'userLoggedIn';
    }

    // Event listener. Called when HTML element is added to DOM.
    connectedCallback() {
        this.innerHTML = navTemplate;
        eval(this);

        // Add the show/hide function to the hamburger menu.
        this.addHamburgerEvent();

        // Check whether user's avatar URL has already been cached.
        let avatarImg = '';        
        avatarImg = window.sessionStorage.getItem(this.USER_AVATAR_URL_KEY);
        let isLoggedIn = window.sessionStorage.getItem(this.USER_IS_LOGGED_IN);
        
        // If we have the user's avatar and they're logged in, just change state. 
        if (avatarImg && isLoggedIn) {
            this.setLoggedState(avatarImg);
            return;
        } else {
            // Must add event listener rather than assign (e.g. `window.onload =`),
            // Otherwise we could overwrite any other registered event handlers.
            // Yes, this is a hack ;D
            window.addEventListener('load', () => {
            this.getLoggedInStatus();
        });
        }
    }

    // Adds a close/show event listener to the hamburger button.
    addHamburgerEvent(hamburger) {
        const hamburgerButton = this.querySelector('.navbar-burger');
        hamburgerButton.addEventListener('click', (evt) => {
            hamburgerButton.classList.toggle('is-active');
            
            // Get the ID of the navbar menu
            const navMenu = hamburgerButton.dataset.target;
            const navMenuEl = this.querySelector(`#${navMenu}`);
            navMenuEl.classList.toggle('is-active');
            
        });
    }

    // Determine whether the user is logged in.
    getLoggedInStatus() {
        // Bail right away if Firebase isn't available.
        if (!firebase) {
            return;
        }

        // Start auth flow to get logged-in status.
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                window.sessionStorage.setItem(this.USER_AVATAR_URL_KEY, user.photoURL);
                window.sessionStorage.setItem(this.USER_IS_LOGGED_IN, true);
                this.setLoggedState(user.photoURL);
            }
        });
    }

    // Change the navbar state if the user is logged in
    setLoggedState(url) {
        const avatar = this.querySelector('.avatar');
        const logInButton = this.querySelector('.log-in');
        const logOutButton = this.querySelector('.log-out');

        logInButton.classList.add('is-hidden')

        const avatarImg = url;
        avatar.style.backgroundImage = `url('${avatarImg}')`;
        avatar.style.backgroundSize = '48px 48px';
        
        logOutButton.addEventListener('click', this.logOut);
    }

    // Logs the user out.
    logOut() {
        if (!firebase) {
            return;
        }

        firebase.auth()
            .signOut()
            .then(() => {
                window.location = 'index.html';
                sessionStorage.removeItem(this.USER_AVATAR_URL_KEY);
                sessionStorage.removeItem(this.USER_IS_LOGGED_IN);
            })
            .catch(err => {
                console.log(err);
            });                
    }
}

// Register the custom element with the browser.
customElements.define('x-navbar', XNavBar);