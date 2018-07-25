let recordButton;

window.onload = function () {
    recordButton = document.querySelector("button");
    recordButton.addEventListener("click", record);
}     

function record() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            player.src = "";
            recordButton.removeEventListener("click", record);
            let mimeType = "audio/webm;codecs=opus";

            let microphone = new MediaRecorder(stream, {
                mimeType: mimeType
            });
            microphone.start();

            let audioChunks = [];
            microphone.addEventListener("dataavailable", e => {
                audioChunks.push(e.data);
            });

            microphone.addEventListener("stop", () => {
                let blob = new Blob(audioChunks);

                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let data = reader.result;
                    // Send data back to server for processing.
                }

                let audioUrl = URL.createObjectURL(blob);
                player.src = audioUrl;
            });

            function stop() {
                microphone.stop();
                recordButton.removeEventListener("click", stop);
                recordButton.addEventListener("click", record);
            }
            recordButton.addEventListener("click", stop);
        });
}