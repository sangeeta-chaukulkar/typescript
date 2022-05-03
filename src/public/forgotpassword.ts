import axios from 'axios';
function forgotpassword(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const userEmail = {
        email: form.get("email")
    }
    console.log(userEmail.email)
    axios.post('http://localhost:3000/forgotpassword',userEmail).then(response => {
        console.log(response);
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:green;">Mail Successfully sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}