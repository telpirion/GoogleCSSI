let googleUser, sentiment;

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

    // Next, load the text sentiment analysis model.
    sentiment = ml5.sentiment('movieReviews', () => {
        console.log('Model ready!');
    })
};

const handleNoteSubmit = () => {
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');

    const message = `${noteTitle.value}. ${noteText.value}`;

    // Get the text sentiment as a value between 0 (negative) and 1 (positive)
    const sentimentPrediction = sentiment.predict(message);
    console.log(sentimentPrediction);

    firebase.database().ref(`users/${googleUser.uid}`).push({
        title: noteTitle.value,
        text: noteText.value,
        score: sentimentPrediction.score
    })
    .then(() => {
        noteTitle.value = '';
        noteText.value = '';
    });
};