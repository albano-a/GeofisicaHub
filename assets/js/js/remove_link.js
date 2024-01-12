<script>
  document.addEventListener('DOMContentLoaded', function () {
    var fadedLinks = document.querySelectorAll('.text-muted');

    fadedLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        link.classList.add('d-none'); // Adds "d-none" class to hide the link
      });
    });
  });
</script>