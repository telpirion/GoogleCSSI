let googleUserId, sentiment;

window.onload = evt => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Console log the user to confirm they are logged in
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            getNotes(googleUserId);
        } else {
            // If not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });

    // Next, load the text sentiment analysis model.
    sentiment = ml5.sentiment('movieReviews', () => {
        console.log('Model ready!');
    })
};

const getNotes = userId => {
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    });
};

const renderDataAsHtml = data => {
    let cards = ``;
    for(const noteItem in data) {
        const note = data[noteItem];
        // For each note create an HTML card
        cards += createCard(note, noteItem);
    }
    document.querySelector('#app').innerHTML = cards;
};

// Determines the emotional state, given a score of 0 (sad) to 1 (happy).
const determineEmotionalState = (score) => {
    if (score > 0.75) {
        return {
            state: 'happy',
            emoticon: 'grinning'
        };
    } else if (score > 0.3) {
        return {
            state: 'meh',
            emoticon: 'neutral-face'
        };
    } else {
        return {
            state: 'sad',
            emoticon: 'cry'
        };
    }
}

const createCard = (note, noteId) => {
    const emotionalState = determineEmotionalState(note.score);

    let innerHTML = "";
    innerHTML += `<div class="column is-one-quarter">`
    innerHTML += `<div class="card card-${emotionalState.state}">`
    innerHTML += `<header class="card-header">`
    innerHTML += `<p class="card-header-title">`
    innerHTML += `${note.title}&nbsp <span class='ec ec-${emotionalState.emoticon}'></span>`
    innerHTML += `</p>`
    innerHTML += `</header>`
    innerHTML += `<div class="card-content">`
    innerHTML += `<div class="content">`
    innerHTML += `${note.text}`
    innerHTML += `</div>`
    innerHTML += `</div>`
    innerHTML +=  `<footer class="card-footer">`
    innerHTML +=  `<a id="${noteId}" class="card-footer-item" onclick="editNote(this.id)">Edit</a>`
    innerHTML +=  `<a id="${noteId}" href="#" class="card-footer-item" onclick="deleteNote(this.id)">Delete</a>`
    innerHTML +=  `</footer>`
    innerHTML += `</div>`
    innerHTML += `</div>`

    return innerHTML;
}

const deleteNote = noteId => {
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
};

const editNote = (noteId) => {
    const editNoteModal = document.querySelector('#editNoteModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const noteDetails = data[noteId];
        document.querySelector('#editTitleInput').value = noteDetails.title;
        document.querySelector('#editTextInput').value = noteDetails.text;
    });
    const saveEditBtn = document.querySelector('#saveEdit');
    saveEditBtn.onclick = handleSaveEdit.bind(this, noteId);
    
    // Can also do it this way, without `bind()`:
    //saveEditBtn.addEventListener('click', () => { handleSaveEdit(noteId); });
    
    editNoteModal.classList.toggle('is-active');
};

const handleSaveEdit = (noteId) => {
    const noteTitle = document.querySelector('#editTitleInput').value;
    const noteText = document.querySelector('#editTextInput').value;

    const message = `${noteTitle}. ${noteText}`;

    // Get the text sentiment as a value between 0 (negative) and 1 (positive)
    const sentimentPrediction = sentiment.predict(message);
    console.log(sentimentPrediction);

    var noteEdits = {
        title: noteTitle,
        text: noteText,
        score: sentimentPrediction.score
    };
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
    closeEditModal();
}

const closeEditModal = () => {
  const editNoteModal = document.querySelector('#editNoteModal');
  editNoteModal.classList.toggle('is-active');
};