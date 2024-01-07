
document.getElementById('darkMode').addEventListener('change', function(event){
    if(event.target.checked){
        // Enable dark mode
        document.getElementById('dark-style').disabled = false;
    } else {
        // Disable dark mode
        document.getElementById('dark-style').disabled = true;
    }
});