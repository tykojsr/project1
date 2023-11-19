
import {
	listAll,
	ref,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import {
	arrayRemove,
	collection,
	doc,
	getDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore, storage } from "./firebase-config.js";

const resumeDocRef = doc(firestore, "portfolio", "resume");
const aboutmeDocRef = doc(firestore, "portfolio", "aboutme" );

//----------------------------------Personal Data--------------------------------------------------

async function getpersonalDataFromFirestoreAndSave() {
    await getDoc(resumeDocRef).
    then((dogSnapshot) => {
        if(dogSnapshot.exists()){
            const resumedata = dogSnapshot.data();
            if(resumedata){
               // console.log(resumedata);
                const name = document.getElementById("name");
                const age = document.getElementById("age");
                const address = document.getElementById("address");
                const phonenumber = document.getElementById("phonenumber");
                name.value = resumedata.name;
                age.value = resumedata.age;
                address.value = resumedata.address;
                phonenumber.value = resumedata.phonenumber;
            }
        }
    })
}
getpersonalDataFromFirestoreAndSave();

//--------------------------------------AboutMe data---------------------------------------------

async function getAboutMeDataFromFirestoreAndSave() {
    await getDoc(aboutmeDocRef).
    then((dogSnapshot) => {
        if(dogSnapshot.exists()){
            const aboutmedata = dogSnapshot.data();
            if(aboutmedata){
                //console.log(aboutmedata.bio);
                var bio = document.getElementById("bio");
                bio.value = aboutmedata.bio;

                const aboutUsPoints = document.getElementById("aboutUsPoints");

                aboutmedata.aboutUsPoints.forEach((point, index) => {
                    const col = document.createElement("div");
                    col.className = "form-group"

                    const pointElement = document.createElement("p");
                    pointElement.className = "form-group";

                    pointElement.textContent = point;
                    col.appendChild(pointElement);
                    aboutUsPoints.appendChild(col);

                })
            }
        }
    })
}
getAboutMeDataFromFirestoreAndSave();

//-------------------------------------Education Data----------------------------------------------------


// async function geteducationDataFromFirestoreAndSave() {
//     await getDoc(resumeDocRef).
//     then((dogSnapshot) => {
//         if(dogSnapshot.exists()){
//             const resumedata = dogSnapshot.data();
//             if(resumedata){
//                 //console.log(resumedata);
//                 resumedata.Qualification.forEach((group, index) => {
//                     console.log(group);
//                     const col = document.createElement("div");
//                     col.className = "form-group";

//                     const yourEducation = document.getElementById("yourEducation");

//                   const education = document.createElement("div");
//                   education.className = "form-group";

//                   const institutionName = document.createElement("p");
//                   institutionName.className = "form-group1";
//                   institutionName.textContent = group.InstitutionName;
//                   education.appendChild(document.createTextNode("Name of your School/University/Institution: "));
//                   education.appendChild(institutionName);

//                   const Course = document.createElement("p");
//                   Course.className = "form-group2";
//                   Course.textContent = group.Course;
//                   education.appendChild(document.createTextNode("Name of the Course"));
//                   education.appendChild(Course);

//                   const Grade = document.createElement("p");
//                   Grade.className = "form-group3";
//                   Grade.textContent = group.Grade;
//                   education.appendChild(document.createTextNode("Grade/Percentage?CGPI: "));
//                   education.appendChild(Grade);                               //due to this gap btw semicolon and the closing inverted commas, there will be a gap of one line the browser.

//                   const PassOutYear = document.createElement("p");
//                   PassOutYear.className = "form-group4";
//                   PassOutYear.textContent = group.PassOutYear;
//                   education.appendChild(document.createTextNode("Pass Out Year: "));
//                   education.appendChild(PassOutYear);

//                   col.appendChild(education);
//                   yourEducation.appendChild(col);

//                   const lineBreak = document.createElement("hr");
//                   yourEducation.appendChild(lineBreak);

                  

//                 })
//             }
//         }
//     })
// }

// geteducationDataFromFirestoreAndSave();


async function geteducationDataFromFirestoreAndSave() {
    await getDoc(resumeDocRef).
    then((dogSnapshot) => {
        if(dogSnapshot.exists()){
            const resumedata = dogSnapshot.data();
            if(resumedata && resumedata.Qualification){
                resumedata.Qualification.forEach((group, index) => {
                    const col = document.createElement("div");
                    col.className = "form-group";

                    const yourEducation = document.getElementById("yourEducation");

                    const education = document.createElement("div");
                    education.className = "form-group";

                    // An array of objects with label and value pairs
                    const items = [
                        { label: "Name of your School/University/Institution: ", value: group.InstitutionName },
                        { label: "Course: ", value: group.Course },
                        { label: "Grade: ", value: group.Grade },
                        { label: "Pass Out Year: ", value: group.PassOutYear }
                    ];

                    // Loop through the items array and create elements dynamically
                    items.forEach(item => {
                        const itemElement = document.createElement("p");
                        itemElement.textContent = `${item.label}${item.value}`;
                        education.appendChild(itemElement);
                    });

                    col.appendChild(education);
                    yourEducation.appendChild(col);

                    // Add a line break between each group
                    const lineBreak = document.createElement("hr");
                    yourEducation.appendChild(lineBreak);
                });
            }
        }
    });
}

geteducationDataFromFirestoreAndSave();

//---------------------------------------Experience Data---------------------------------------------

async function getExperienceDataFromFirestoreAndSave(){
    await getDoc(resumeDocRef)
    .then((dogSnapshot)=>{
        if(dogSnapshot.exists()){
            const resumedata = dogSnapshot.data();
            if(resumedata && resumedata.experience){
                resumedata.experience.forEach((group, index) => {
                    const col = document.createElement("div");
                    col.className = "form-group";

                    const yourExperience = document.getElementById("yourExperience");

                    const experience = document.createElement("div");
                    experience.className = "form-group";

                    const items = [
                        { label: "Job Title: ", value: group.jobTitle },
                        { label: "Company/Organisation: ", value: group.company },
                        { label: "Enter your Duration in months: ", value: group.duration },
                        { label: "Description/Responsibilities: ", value: group.Description },
                        { label: "Technologies and Tools: ", value: group.tools },
                        { label: "Projects: ", value: group.projects },
                        { label: "Achievement: ", value: group.achievement },
                    ];

                    items.forEach(item => {
                        const itemElement = document.createElement("p");
                        itemElement.textContent = `${item.label}${item.value}`;
                        experience.appendChild(itemElement);
                    });

                    col.appendChild(experience);
                    yourExperience.appendChild(col);

                    // Add a line break between each group
                    const lineBreak = document.createElement("hr");
                    yourExperience.appendChild(lineBreak);

                })
            }
        }
    })
}
getExperienceDataFromFirestoreAndSave();