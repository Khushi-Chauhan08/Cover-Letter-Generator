const form = document.getElementById("form");
const output = document.getElementById("output");

form.addEventListener("submit", async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const company = document.getElementById("company").value;
  const skills = document.getElementById("skills").value;
  const file = document.getElementById("resume").files[0];

  output.value = "Generating...";

  try{
   let resumeText = "";
   const res = await fetch("/api/generate",{
  method: "POST",
  headers: {
    "Content-Type" : "application/json"
  },
  body: JSON.stringify({name, role, company, skills, resumeText})
});
 

if(!res.ok){
  throw new Error("Generate API failed");
}
const data = await res.json();
output.value = data.text;
  }catch(error){
    console.error(error);
    output.value = "Error generating cover letter";
  }
});

function copyText(){
  const text = output.value;
  navigator.clipboard.writeText(text);
  alert("Copied!");
}