// Ensure that EmailJS is initialized with your public key
(function () {
    emailjs.init("UxhZZQX0H5Lvdu92H"); // Replace with your EmailJS public key
})();

// Get the form element
const form = document.querySelector('.form');

// Add event listener for form submission
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form field values
    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const subject = document.querySelector('input[name="subject"]').value.trim();
    const message = document.querySelector('textarea[name="message"]').value.trim();

    // Validate form fields
    if (!name || !email || !subject || !message) {
        alert("All fields are required.");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Prepare the parameters to send to EmailJS
    const templateParams = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        to_email: 'ak7462514@gmail.com' // Fixed recipient email
    };

    // Send the email using EmailJS
    emailjs.send("service_4hz28vu", "template_mt4qeu8", templateParams) // Replace with your Service ID and Template ID
        .then(function (response) {
            console.log('Email successfully sent:', response);
            alert('Message sent successfully!');
            form.reset(); // Reset the form fields after successful submission
        })
        .catch(function (error) {
            console.error('EmailJS Error:', error); // Log the error for debugging
            alert('Failed to send the message. Please try again later.');
        });
});

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
