document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        // Voorkom standaard form submission (pagina herladen)
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = document.getElementById('submitBtn');
        const statusDiv = document.getElementById('formStatus');

        // Visuele feedback: knop deactiveren en tekst veranderen
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Bezig met verzenden...';
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        statusDiv.classList.add('hidden'); // Verberg eerdere meldingen

        // Stuur de data naar de Web3Forms API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
            .then(async (response) => {
                let json = await response.json();

                if (response.status == 200) {
                    // Succes! Maak de div groen en toon succesbericht
                    statusDiv.innerHTML = 'Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact op.';
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-bold block';
                    form.reset(); // Maak formulier leeg
                } else {
                    // Fout vanuit API (bijv. verkeerde key). Maak div rood.
                    statusDiv.innerHTML = json.message || 'Er is iets misgegaan. Probeer het later opnieuw.';
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800 text-center font-bold block';
                }
            })
            .catch(error => {
                // Netwerkfout (geen internet e.d.)
                statusDiv.innerHTML = 'Er is een netwerkfout opgetreden. Controleer uw verbinding.';
                statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800 text-center font-bold block';
            })
            .finally(() => {
                // Herstel de verzendknop altijd, ongeacht succes of falen
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            });
    });
});