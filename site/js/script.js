document.addEventListener('DOMContentLoaded', () => {

    // 1. Contact formulier logica (alleen uitvoeren als het formulier bestaat op deze pagina)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const submitBtn = document.getElementById('submitBtn');
            const statusDiv = document.getElementById('formStatus');

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Bezig met verzenden...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            statusDiv.classList.add('hidden');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();

                if (response.status == 200) {
                    statusDiv.innerHTML = 'Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact op.';
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-bold block';
                    form.reset();
                } else {
                    statusDiv.innerHTML = json.message || 'Er is iets misgegaan. Probeer het later opnieuw.';
                    statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800 text-center font-bold block';
                }
            })
            .catch(error => {
                statusDiv.innerHTML = 'Er is een netwerkfout opgetreden. Controleer uw verbinding.';
                statusDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 text-red-800 text-center font-bold block';
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            });
        });
    }

    // 2. Leaflet kaart logica (alleen uitvoeren als de kaart-div bestaat op deze pagina)
    const mapContainer = document.getElementById('leaflet-map');
    if (mapContainer) {
        // Coördinaten voor Maaseikerweg 45, Weert
        const lat = 51.245811;
        const lng = 5.716120;

        // Initialiseer de kaart
        const map = L.map('leaflet-map').setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Voeg een marker toe met een popup
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup("<b>Gezondheidscentrum Weert</b><br>Maaseikerweg 45").openPopup();
    }
});