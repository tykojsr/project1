
import {
	arrayRemove,
	collection,
	doc,
	getDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore, storage } from "./firebase-config.js";
import { getStorage,ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

var resumeDocRef = doc(firestore, "portfolio", "resume");

const messageElement = document.getElementById("message");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const addressInput = document.getElementById("address");
const phonenumberInput = document.getElementById("phonenumber");
const nameError = document.getElementById("name-error");
const ageError = document.getElementById("age-error");
const addressError = document.getElementById("address-error");
const phonenumberError = document.getElementById("phonenumber-error");

const websiteContentForm = document.getElementById("website-content-form");

websiteContentForm.addEventListener("submit", (e) => {
	e.preventDefault(); // Prevent the form from submitting and reloading the page

	// Reset error messages
	nameError.style.display = "none";
	ageError.style.display = "none";
	addressError.style.display = "none";
	phonenumberError.style.display = "none";

	// Capture user inputs
	const name = nameInput.value;
	const age = ageInput.value;
	const address = addressInput.value;
	const phonenumber = phonenumberInput.value;

	// Basic form validation
	let isValid = true;

	if (!name) {
		nameError.textContent = "Enter your Name";
		nameError.style.display = "block";
		isValid = false;
	}

	if (!age) {
		ageError.textContent = "Enter Home Page Welcome";
		ageError.style.display = "block";
		isValid = false;
	}

	if (!address) {
		addressError.textContent = "Enter Home Page Caption";
		addressError.style.display = "block";
		isValid = false;
	}
	if (!phonenumber) {
		phonenumberError.textContent = "Enter Footer Message";
		console.log("a");
		phonenumberError.style.display = "block";
		isValid = false;
	}

	if (!isValid) {
		return;
	}

	const newData = {
		name: name,
		age: age,
		address: address,
		phonenumber: phonenumber,
	};
	updateDoc(resumeDocRef, newData)
		.then(() => {
			console.log("Data updated successfully!");
			messageElement.textContent =
				"Personal Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
    
		})
		.catch((error) => {
			console.error("Error updating data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
});


//----------------------------------------AboutUs Starts----------------------------------------------------------


const bio = document.getElementById("bio");
const aboutUsContainer = document.getElementById("aboutUsPoints");
const addAboutUsPointButton = document.getElementById("addAboutUsPoint")

var aboutMeDocRef = doc(firestore, "portfolio", "aboutme");

function saveAboutUsData() {
	const aboutUsData = collectFormData();

	updateDoc(aboutMeDocRef, aboutUsData)
		.then(() => {
			console.log("About Us data saved successfully!");
			console.log("Data updated successfully!");
			messageElement.textContent =
				"About Us Data updated successfully!";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}

function collectFormData() {
	const aboutUsData = {
		bio: bio.value,
		aboutUsPoints: [], // Initialize with an empty array
	};
	const pointInputs = aboutUsContainer.querySelectorAll(
		".about-us-point input[type='text']"
	);
	pointInputs.forEach((pointInput) => {
		const pointValue = pointInput.value.trim();
		if (pointValue !== "") {
			aboutUsData.aboutUsPoints.push(pointValue);
		}
	});

	return aboutUsData;
}



const aboutUsForm = document.getElementById("aboutus-content-form");
aboutUsForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveAboutUsData();
});


async function deletePointFromAboutUsDocRef(pointText) {
	try {
		const fieldValue = arrayRemove(pointText);
		await updateDoc(aboutMeDocRef, { aboutUsPoints: fieldValue });
		console.log("Point deleted from Firestore successfully!");
	} catch (error) {
		console.error("Error deleting point from Firestore: ", error);
	}
}

addAboutUsPointButton.addEventListener("click", () => {
	const newPointDiv = document.createElement("div");
	newPointDiv.classList.add("about-us-point");
	const pointInput = document.createElement("input");
	pointInput.type = "text";
	pointInput.classList.add("form-control");
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add("delete-point");
	deleteButton.value = "Delete";

	deleteButton.addEventListener("click", async () => {
		const pointText = newPointDiv
			.querySelector("input[type='text']")
			.value.trim();
		await deletePointFromAboutUsDocRef(pointText);
		aboutUsContainer.removeChild(newPointDiv);
	});

	newPointDiv.appendChild(document.createTextNode("skill: "));
	newPointDiv.appendChild(pointInput);
	newPointDiv.appendChild(deleteButton);

	aboutUsContainer.appendChild(newPointDiv);
});


//-------------------------------------------Educational Background-----------------------------------------

const educationContentForm = document.getElementById("Education-content-form");
const yourEducation = document.getElementById("yourEducation");
const addEducation = document.getElementById("addEducation");

async function saveEducationData() {
	const existingData = await getDoc(resumeDocRef); // Assuming you have a getDoc function to retrieve the existing data

    const educationData = collectEducationFormData();
    const updatedQualifications = existingData.exists() ? existingData.data().Qualification : [];

    // Merge the existing qualifications with the new ones
    educationData.Qualification = [...updatedQualifications, ...educationData.Qualification];

	// Save the data to Firebase
	updateDoc(resumeDocRef, educationData)
		.then(() => {
			console.log("Services data saved successfully!");
			console.log("Data updated successfully!");
			messageElement.textContent =
				"Education Data updated successfully!";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}
function  collectEducationFormData() {
	const educationData = {
		Qualification: [], // Initialize with an empty array
	};
	var i = 0;
	const educationElements = document.querySelectorAll(".education");
	educationElements.forEach((educationElement) => {
		const collegeNameInput = educationElement.querySelector(
			"input[placeholder='Enter your School/University name']"
		);
		const branch = educationElement.querySelector(
			"input[placeholder='Enter your Course/Degree name']"
		);
		const marks = educationElement.querySelector(
			"input[placeholder='Enter your Grade/Score/CGPI']"
		);
		const passOutYear = educationElement.querySelector(
			"input[placeholder='Enter your Year of passout']"
		);

		//console.log(serviceTitleInput);
		//console.log(serviceDescInput);
		const education = {
			InstitutionName: collegeNameInput.value,
			Course: branch.value,
			Grade: marks.value,
			PassOutYear: passOutYear.value,
		};

		educationData.Qualification.push(education);
	});
	return educationData;
}

educationContentForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveEducationData();
});

//----------------Adding a Educational qualification-------------

addEducation.addEventListener("click", () => {
	// Create a new div for the education
	const newEducationDiv = document.createElement("div");
	newEducationDiv.classList.add("education");

	// Create input elements for the Education like name of the college, branch etc
	const collegeNameInput = document.createElement("input");
	collegeNameInput.type = "text";
	collegeNameInput.classList.add(
		"form-control",
	);
	collegeNameInput.placeholder = "Enter your School/University name";

	const branch = document.createElement("input");
	branch.type = "text";
	branch.classList.add(
		"form-control",
	);
	branch.placeholder = "Enter your Course/Degree name";

	const marks = document.createElement("input");
	marks.type = "number";
	marks.classList.add(
		"form-control",
	);
	marks.placeholder = "Enter your Grade/Score/CGPI";

	const passOutYear = document.createElement("input");
	passOutYear.type = "number";
	passOutYear.classList.add(
		"form-control",
	);
	passOutYear.placeholder = "Enter your Year of passout";

	// Create a delete button
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add(
		"btn",
		"btn-primary",
		"delete-service",
		"red-button"
	);
	deleteButton.value = "Delete";

	// Add a click event listener to the delete button
	deleteButton.addEventListener("click", async () => {
		const collegeNameInput = newEducationDiv
			.querySelector("input[placeholder='Enter your School/University name']")
			.value.trim();
		const branch = newEducationDiv
			.querySelector("input[placeholder='Enter your Course/Degree name']")
			.value.trim();
		const marks = newEducationDiv
			.querySelector("input[placeholder='Enter your Grade/Score/CGPI']")
			.value.trim();
		const passOutYear = newEducationDiv
			.querySelector("input[placeholder='Enter your Grade/Score/CGPI']")
			.value.trim();
		await deleteEducationFromFirestore(collegeNameInput.value, branch.value,marks.value,passOutYear.value);
		yourEducation.removeChild(newEducationDiv);
		messageElement.textContent =
			"Experience Data Deleted successfully!";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});

	// Append the input elements and delete button to the service div
	newEducationDiv.appendChild(document.createTextNode("Name of your Institution: "));
	newEducationDiv.appendChild(collegeNameInput);
	newEducationDiv.appendChild(document.createTextNode("Enter your Specilization: "));
	newEducationDiv.appendChild(branch);
	newEducationDiv.appendChild(document.createTextNode("Enter your Grades: "));
	newEducationDiv.appendChild(marks);
	newEducationDiv.appendChild(document.createTextNode("Enter your session: "));
	newEducationDiv.appendChild(passOutYear);
	newEducationDiv.appendChild(deleteButton);

	// Append the new service div to the container
	yourEducation.appendChild(newEducationDiv);
});

async function deleteEducationFromFirestore(collegeNameInput,
    branch,
    marks,
    passOutYear) {
	try {
		const educationToRemove = {
			CollegeName: collegeNameInput,
			Branch: branch,
			Marks: marks,
			PassOutYear: passOutYear,
		};
		await updateDoc(resumeDocRef, {
			Qualifications: arrayRemove(educationToRemove),
		});

		console.log(
			"Service deleted from Firestore successfully!Go to Home Page and Refresh to see the changes."
		);
	} catch (error) {
		console.error("Error deleting service from Firestore: ", error);
	}
}

//--------------------------Experience Section---------------------------------------------------------------

const experienceContentForm = document.getElementById("Experience-content-form");
const yourExperience = document.getElementById("yourExperience");
const addExperience = document.getElementById("addExperience");

//---------------Adding Experience---------------

addExperience.addEventListener("click", () => {
	const newExperienceDiv = document.createElement("div");
	newExperienceDiv.classList.add("experience");

	// Create input elements for the Education like name of the college, branch etc
	const jobTitle = document.createElement("input");
	jobTitle.type = "text";
	jobTitle.classList.add(
		"form-control",
	);
	jobTitle.placeholder = "Enter your Job Title";

	const company = document.createElement("input");
	company.type = "text";
	company.classList.add(
		"form-control",
	);
	company.placeholder = "Enter your Company/Organisation";

	const duration = document.createElement("input");
	duration.type = "number";
	duration.classList.add(
		"form-control",
	);
	duration.placeholder = "Enter your Duration in months";

	const Description = document.createElement("input");
	Description.type = "textarea";
	Description.classList.add(
		"form-control",
	);
	Description.placeholder = "Enter your Description/Responsibilities:";

	const tools = document.createElement("input");
	tools.type = "textarea";
	tools.classList.add(
		"form-control",
	);
	tools.placeholder = "Enter your Key Technologies and Tools:";

	const projects = document.createElement("input");
	projects.type = "textarea";
	projects.classList.add(
		"form-control",
	);
	projects.placeholder = "Enter your Projects:";

	const achievement = document.createElement("input");
	achievement.type = "textarea";
	achievement.classList.add(
		"form-control",
	);
	achievement.placeholder = "Enter your Achievements:";

	// Create a delete button
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add(
		"btn",
		"btn-primary",
		"delete-service",
		"red-button"
	);
	deleteButton.value = "Delete";

	// Add a click event listener to the delete button
	deleteButton.addEventListener("click", async () => {
		const jobTitle = newExperienceDiv
			.querySelector("input[placeholder='Enter your Job Title']")
			.value.trim();
		const company = newExperienceDiv
			.querySelector("input[placeholder='Enter your Company/Organisation']")
			.value.trim();
		const duration = newExperienceDiv
			.querySelector("input[placeholder='Enter your Duration in months']")
			.value.trim();
		const Description = newExperienceDiv
			.querySelector("input[placeholder='Enter your Description/Responsibilities:]")
			.value.trim();
		const tools = newExperienceDiv
			.querySelector("input[placeholder='Enter your Key Technologies and Tools:]")
			.value.trim();
		const projects = newExperienceDiv
			.querySelector("input[placeholder='Enter your Projects:']")
			.value.trim();
		const achievement = newExperienceDiv
			.querySelector("input[placeholder='Enter your Achievement']")
			.value.trim();
		await deleteExperienceFromFirestore(jobTitle.value, company.value, duration.value, Description.value, tools.value, projects.value, achievement.value);
		yourEducation.removeChild(newEducationDiv);
		messageElement.textContent =
			"Education Data Deleted successfully!";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});

	// Append the input elements and delete button to the service div
	newExperienceDiv.appendChild(document.createTextNode("Job Title "));
	newExperienceDiv.appendChild(jobTitle);
	newExperienceDiv.appendChild(document.createTextNode("Name of Company/Organisation "));
	newExperienceDiv.appendChild(company);
	newExperienceDiv.appendChild(document.createTextNode("Duration "));
	newExperienceDiv.appendChild(duration);
	newExperienceDiv.appendChild(document.createTextNode("Job Description"));
	newExperienceDiv.appendChild(Description);
	newExperienceDiv.appendChild(document.createTextNode("Tools and Technologies"));
	newExperienceDiv.appendChild(tools);
	newExperienceDiv.appendChild(document.createTextNode("Projects"));
	newExperienceDiv.appendChild(projects);
	newExperienceDiv.appendChild(document.createTextNode("Personal Achievements"));
	newExperienceDiv.appendChild(achievement);
	newExperienceDiv.appendChild(deleteButton);

	// Append the new service div to the container
	yourExperience.appendChild(newExperienceDiv);
});

async function deleteExperienceFromFirestore(jobTitle, company, duration, Description, tools, projects, achievement) {
	try {
		const experienceToRemove = {
			jobTitle: jobTitle,
			company: company,
			duration: duration,
			Description: Description,
			tools: tools,
			projects: projects,
			achievement: achievement,
		};
		await updateDoc(resumeDocRef, {
			Experiences: arrayRemove(experienceToRemove),
		});

		console.log(
			"Experience details deleted from Firestore successfully!"
		);
	} catch (error) {
		console.error("Error deleting service from Firestore: ", error);
	}
}


//---------------Adding Experience Data to Firebase---------

async function saveExperienceData() {
    try {
        const existingData = await getDoc(resumeDocRef);
        const experienceData = collectExperienceFormData();

        let updatedExperience = existingData.exists() ? existingData.data().experience : [];

        // Append the new experience data to the existing array
        updatedExperience = [...updatedExperience, ...experienceData.experience];

        // Save the updated data to Firebase
        await updateDoc(resumeDocRef, { experience: updatedExperience });

        console.log("Experience data saved successfully!");
        console.log("Data updated successfully!");
        messageElement.textContent = "Experience Data updated successfully!";
        messageElement.style.color = "green";
        messageElement.style.display = "block";
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error saving data: ", error);
        messageElement.textContent = "Error updating data. Please try again.";
        messageElement.style.color = "red";
        messageElement.style.display = "block";
        window.scrollTo(0, 0);
    }
}


function  collectExperienceFormData() {
	const experienceData = {
		experience: [], // Initialize with an empty array
	};
	var i = 0;
	const experienceElements = document.querySelectorAll(".experience");
	experienceElements.forEach((experienceElement) => {
		const jobTitle = experienceElement.querySelector(
			"input[placeholder='Enter your Job Title']"
		);
		const company = experienceElement.querySelector(
			"input[placeholder='Enter your Company/Organisation']"
		);
		const duration = experienceElement.querySelector(
			"input[placeholder='Enter your Duration in months']"
		);
		const Description = experienceElement.querySelector(
			"input[placeholder='Enter your Description/Responsibilities:']"
		);
		const tools = experienceElement.querySelector(
			"input[placeholder='Enter your Key Technologies and Tools:']"
		);
		const projects = experienceElement.querySelector(
			"input[placeholder='Enter your Projects:']"
		);
		const achievement = experienceElement.querySelector(
			"input[placeholder='Enter your Achievements:']"
		);

		//console.log(serviceTitleInput);
		//console.log(serviceDescInput);
		const experience = {
			jobTitle: jobTitle.value,
			company: company.value,
			duration: duration.value,
			Description: Description.value,
			tools: tools.value,
			projects: projects.value,
			achievement: achievement.value,
		};

		experienceData.experience.push(experience);
	});
	return experienceData;
}

experienceContentForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveExperienceData();
});

//---------------------------Image Integration--------------------------------------------------

var fileInput = document.getElementById("formFile");
var message = document.getElementById("message");
var uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", async function () {
	var file = fileInput.files[0];

	if (file) {
		var storageRef = ref(storage, "portfolio/profilePic/" + file.name);
		var uploadTask = uploadBytesResumable(storageRef, file);

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










