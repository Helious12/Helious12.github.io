const form = document.getElementById('contributionForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const pieces = document.getElementById('pieces').value;

    const thankYouUrl = `thankyou.html?name=${name}&pieces=${pieces}`;
    window.location.href = thankYouUrl; 
});

