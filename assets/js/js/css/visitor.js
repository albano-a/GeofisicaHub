// counter.js
document.addEventListener('DOMContentLoaded', function () {
    let count = localStorage.getItem('counter') || 0;
    document.getElementById('counter').textContent = count;

    // Increment the counter on each page load
    count++;
    document.getElementById('counter').textContent = count;
    localStorage.setItem('counter', count.toString());
});
