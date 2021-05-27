const signIn = () => {
    //console.log("Signing in ...");
    const provider = new firebase.auth.GoogleAuthProvider();
    //console.log(provider);
    firebase.auth()
        // triggers a Google Sign-in pop up to render and allows users to login using a Google account 
        .signInWithPopup(provider)
        .then((result) => { 
            console.log(result);
            /** @type {firebase.auth.OAuthCredential} */ 
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API. We won’t be using it here, but it’s good to know that it’s available to you
            var token = credential.accessToken;
            // The signed-in user info. 
            var user = result.user;
            console.log(user);
            window.location = 'writeNote.html';
        })
        .catch((error) => {
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user’s account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // … 
        });
}