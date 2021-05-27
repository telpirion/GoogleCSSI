let googleUser;

window.onload = (evt) => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUser = user;
        } else {
            window.location = 'index.html'; // If not logged in, navigate back to login page.
        }
    });
};

const handleNoteSubmit = () => {
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    firebase.database().ref(`users/${googleUser.uid}`).push({
        title: noteTitle.value,
        text: noteText.value
    })
    .then(() => {
        noteTitle.value = '';
        noteText.value = '';
    });
};