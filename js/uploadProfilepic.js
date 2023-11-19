import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

import {
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

var fileInput = document.getElementById("formFile");
var message = document.getElementById("message");
var uploadButton = document.getElementById("uploadButton");
var resumeDocRef = doc(firestore, "portfolio", "resume");

uploadButton.addEventListener("click", async function () {
	var file = fileInput.files[0];

	if (file) {
		var storageRef = ref(storage, "portfolio" + file.name);
		var uploadTask = uploadBytesResumable(storageRef, file);
		var url = null;

		uploadTask.on(
			"state_changed",
			function progress(snapshot) {
				var percentage =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				message.innerText = "Upload in progress ";
			},
			function error(err) {
				message.innerText = "Upload failed: " + err.message;
			},
			function complete() {
				message.innerText = "Upload successful!";
			}
		);
	} else {
		message.innerText = "Please select a file to upload.";
	}

	try {
		await uploadTask; // Wait for the upload to complete
		url = await getDownloadURL(storageRef); // Wait for the URL to be retrieved
		console.log("URL", url);
	  } catch (error) {
		console.error("Error getting the download URL:", error);
	  }


	  try {
		  await updateDoc(resumeDocRef, {
			imageUrl: url,
		  });

		  alert("Data added successfully");
		} catch (error) {
		  alert("Unsuccessful operation, error: " + error);
		}
});
