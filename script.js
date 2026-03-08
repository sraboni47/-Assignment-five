console.log("JS WORKING")



document
.getElementById("loginForm")
.addEventListener("submit", function(e){

e.preventDefault()

const username =
document.getElementById("username").value

const password =
document.getElementById("password").value

if(username === "admin" && password === "admin123"){
alert("Login Successful")
}
else{
alert("Invalid Username or Password")
}

})




const issues = [
{
id:1,
title:"Fix Navigation Menu On Mobile Devices",
description:"The navigation menu doesn't collapse properly on mobile devices.",
priority:"HIGH",
author:"john_doe",
date:"1/15/2024",
labels:["BUG","HELP WANTED"]
},
{
id:2,
title:"Fix Navigation Menu On Mobile Devices",
description:"The navigation menu doesn't collapse properly on mobile devices.",
priority:"MEDIUM",
author:"john_doe",
date:"1/15/2024",
labels:["BUG","HELP WANTED"]
},
{
id:3,
title:"Fix Navigation Menu On Mobile Devices",
description:"The navigation menu doesn't collapse properly on mobile devices.",
priority:"LOW",
author:"john_doe",
date:"1/15/2024",
labels:["ENHANCEMENT"]
}
]

const container = document.getElementById("issueContainer")

issues.forEach(issue => {

const labelsHTML = issue.labels.map(label =>

`<span class="badge badge-outline text-xs">${label}</span>`

).join("")

const card = `

<div class="bg-white rounded-lg shadow p-4">

<div class="flex justify-between items-center mb-2">

<span class="text-xs text-green-500 font-semibold">●</span>

<span class="badge badge-outline">${issue.priority}</span>

</div>

<h3 class="font-semibold mb-2">

${issue.title}

</h3>

<p class="text-sm text-gray-500 mb-3">

${issue.description}

</p>

<div class="flex gap-2 mb-3">

${labelsHTML}

</div>

<div class="text-xs text-gray-400">

#${issue.id} by ${issue.author}

</div>

<div class="text-xs text-gray-400">

${issue.date}

</div>

</div>

`

container.innerHTML += card

})