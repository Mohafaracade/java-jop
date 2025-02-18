// Form Validation Functions
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.errorMessages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            url: 'Please enter a valid URL',
            minLength: 'Please enter at least {min} characters',
            maxLength: 'Please enter no more than {max} characters',
            number: 'Please enter a valid number',
            date: 'Please enter a valid date',
            fileSize: 'File size must be less than 5MB',
            fileType: 'Please upload a valid file type (PDF, DOC, DOCX)',
            salary: 'Please enter a valid salary amount',
            passwordMatch: 'Passwords do not match'
        };
    }

    // Initialize validation
    init() {
        this.setupValidation();
        this.setupFormSubmission();
    }

    // Setup validation for all form fields
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.validateField(input));
            
            // Add validation classes
            if (input.required) {
                input.classList.add('needs-validation');
            }
        });
    }

    // Validate individual field
    validateField(field) {
        const errorElement = this.getErrorElement(field);
        let isValid = true;
        let errorMessage = '';

        // Remove existing validation classes
        field.classList.remove('is-invalid', 'is-valid');

        // Required field validation
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = this.errorMessages.required;
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = this.errorMessages.email;
            }
        }

        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorMessage = this.errorMessages.phone;
            }
        }

        // URL validation
        if (field.type === 'url' && field.value) {
            try {
                new URL(field.value);
            } catch {
                isValid = false;
                errorMessage = this.errorMessages.url;
            }
        }

        // Number validation
        if (field.type === 'number' && field.value) {
            const num = parseFloat(field.value);
            if (isNaN(num)) {
                isValid = false;
                errorMessage = this.errorMessages.number;
            }
            // Salary validation
            if (field.name.toLowerCase().includes('salary')) {
                if (num < 1000 || num > 1000000) {
                    isValid = false;
                    errorMessage = this.errorMessages.salary;
                }
            }
        }

        // Date validation
        if (field.type === 'date' && field.value) {
            const date = new Date(field.value);
            if (isNaN(date.getTime())) {
                isValid = false;
                errorMessage = this.errorMessages.date;
            }
        }

        // File validation
        if (field.type === 'file' && field.files.length > 0) {
            const file = field.files[0];
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            // Check file type
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                isValid = false;
                errorMessage = this.errorMessages.fileType;
            }

            // Check file size
            if (file.size > maxSize) {
                isValid = false;
                errorMessage = this.errorMessages.fileSize;
            }
        }

        // Update field status
        if (!isValid) {
            field.classList.add('is-invalid');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        } else {
            field.classList.add('is-valid');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        return isValid;
    }

    // Get or create error element for a field
    getErrorElement(field) {
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        return errorElement;
    }

    // Setup form submission validation
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = this.form.querySelectorAll('input, select, textarea');
            let isFormValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Show success message
                Swal.fire({
                    title: 'Success!',
                    text: 'Form submitted successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Handle form submission based on form ID
                    this.handleFormSubmission();
                });
            } else {
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Please check the form for errors.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

                // Focus first invalid field
                const firstInvalidField = this.form.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });
    }

    // Handle form submission based on form ID
    handleFormSubmission() {
        switch (this.form.id) {
            case 'applicationForm':
                window.location.href = 'job-details.html';
                break;
            case 'createJobForm':
                const modal = bootstrap.Modal.getInstance(document.getElementById('createJobModal'));
                if (modal) {
                    modal.hide();
                }
                this.form.reset();
                break;
            default:
                this.form.reset();
                break;
        }
    }
}

// Initialize validation for all forms
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        new FormValidator(form).init();
    });
}); 