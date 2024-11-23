// Ensure that EmailJS is initialized with your public key
(function() {
    emailjs.init("UxhZZQX0H5Lvdu92H"); // Replace with your public key
})();

// Get the form element
const form = document.querySelector('.form');

// Add event listener for form submission
form.addEventListener('submit', function(event) {
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
        .then(function(response) {
            alert('Message sent successfully!');
            form.reset(); // Reset the form fields after successful submission
        }, function(error) {
            console.error('EmailJS Error:', error); // Log the error to the console
            alert('Failed to send message: ' + (error.text || 'Please check your internet connection and try again.'));
        });
});

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// jQuery validation for form
$(document).ready(function() {
    (function($) {
        "use strict";

        // Add custom validation for "answercheck" (for demonstration purposes)
        jQuery.validator.addMethod('answercheck', function(value, element) {
            return this.optional(element) || /^\bcat\b$/.test(value);
        }, "Type the correct answer -_-");

        // Validate contactForm form
        $('#contactForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                subject: {
                    required: true,
                    minlength: 4
                },
                number: {
                    required: true,
                    minlength: 5
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 20
                }
            },
            messages: {
                name: {
                    required: "Come on, you have a name, don't you?",
                    minlength: "Your name must consist of at least 2 characters"
                },
                subject: {
                    required: "Come on, you have a subject, don't you?",
                    minlength: "Your subject must consist of at least 4 characters"
                },
                number: {
                    required: "Come on, you have a number, don't you?",
                    minlength: "Your number must consist of at least 5 characters"
                },
                email: {
                    required: "No email, no message"
                },
                message: {
                    required: "Um...yeah, you have to write something to send this form.",
                    minlength: "That's all? Really?"
                }
            },
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    type: "POST",
                    data: $(form).serialize(),
                    url: "contact_process.php",
                    success: function() {
                        $('#contactForm :input').attr('disabled', 'disabled');
                        $('#contactForm').fadeTo("slow", 1, function() {
                            $(this).find(':input').attr('disabled', 'disabled');
                            $(this).find('label').css('cursor', 'default');
                            $('#success').fadeIn();
                            $('.modal').modal('hide');
                            $('#success').modal('show');
                        });
                    },
                    error: function() {
                        $('#contactForm').fadeTo("slow", 1, function() {
                            $('#error').fadeIn();
                            $('.modal').modal('hide');
                            $('#error').modal('show');
                        });
                    }
                });
            }
        });
    })(jQuery);
});
